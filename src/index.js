import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getOffset(el) {
  const bounds = el.getBoundingClientRect();
  return {
    left: bounds.left + (window.scrollX || window.pageXOffset),
    top: bounds.top + (window.scrollY || window.pageYOffset),
  };
}

function setStyle(element, cssProperty) {
  Object.keys(cssProperty).forEach((property) => {
    element.style[property] = cssProperty[property];
  });
}

class StickyPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSticky: false,
      mediaQueryMatches: !props.mediaQuery,
    };

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onMediaQueryStateChange = this.onMediaQueryStateChange.bind(this);
    this.setContainerRef = this.setContainerRef.bind(this);
    this.scrollOptions = {
      lastScrollVal: 0,
      topFixed: false,
      bottomFixed: false,
    };
  }

  componentDidMount() {
    if (this.props.mediaQuery) {
      this.mediaQueryList = window.matchMedia(this.props.mediaQuery);
      this.mediaQueryList.addListener(this.onMediaQueryStateChange);
      this.onMediaQueryStateChange(this.mediaQueryList);
    }
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);

    if (this.props.active) {
      this.initSticky();
    }
  }

  /*
  * Change sticky element position on scroll
  */
  onScroll() {
    this.updatePosition();
  }

  /*
  * After window resize we need to recalculate sticky position so that it doesn't
  * move out of it's container on next scroll
  */
  onResize() {
    if (this.sticky && this.props.active) {
      this.destroySticky();
      this.initSticky();
      this.updatePosition();
    }
  }

  componentDidUpdate() {
    if (this.props.active && !this.sticky) {
      this.initSticky();
    } else if (!this.props.active && this.sticky) {
      this.destroySticky();
    }
  }

  initSticky() {
    const { childSelector } = this.props;

    const sticky = document.querySelector(childSelector);

    this.sticky = {
      element: sticky,
      stickyHeight: sticky.getBoundingClientRect().height,
      stickyOffsetTop: getOffset(sticky).top,
      stickyOffsetBottom: getOffset(sticky).top + sticky.getBoundingClientRect().height,
      stickyOffsetLeft: getOffset(sticky).left,
    };
  }

  destroySticky() {
    if (this.sticky) {
      setStyle(this.sticky.element, {
        top: '',
        left: '',
        bottom: '',
        width: '',
        position: '',
      });

      this.sticky = null;
    }
  }

  /*
  * When the media query changes we need to update state since
  */
  onMediaQueryStateChange(evt) {
    if (evt.matches !== this.state.mediaQueryMatches) {
      this.setState({
        mediaQueryMatches: evt.matches,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    if (this.mediaQueryList) {
      this.mediaQueryList.removeListener(this.onMediaQueryStateChange);
    }
  }

  setContainerRef(element) {
    this.container = element;
  }

  updatePosition() {
    if (!this.sticky) {
      return;
    }

    const {
      element: sticky,
      stickyHeight,
      stickyOffsetTop,
      stickyOffsetBottom,
      stickyOffsetLeft,
    } = this.sticky;

    const { mediaQueryMatches } = this.state;
    const { topSpace, bottomSpace } = this.props;
    let { lastScrollVal, topFixed, bottomFixed } = this.scrollOptions;

    const scrollTop = window.scrollY || window.pageYOffset;
    if (scrollTop > stickyOffsetTop - topSpace && mediaQueryMatches) {
      if (stickyHeight <= window.innerHeight - topSpace) {
        const stickyBoundingClientRect = sticky.getBoundingClientRect();
        const containerBoundingClientRect = this.container.getBoundingClientRect();
        let spacing = topSpace;
        const containerTopOffset =
          containerBoundingClientRect.top + (window.scrollY || window.pageYOffset);
        if (containerBoundingClientRect.height
          - topSpace + containerTopOffset < scrollTop + stickyBoundingClientRect.height) {
          spacing = containerBoundingClientRect.height - scrollTop
            + containerTopOffset - stickyBoundingClientRect.height;
        }
        setStyle(sticky, {
          top: spacing + 'px',
          left: stickyOffsetLeft + 'px',
          bottom: '',
          width: stickyBoundingClientRect.width + 'px',
          position: 'fixed',
        });
      } else {
        if (scrollTop > lastScrollVal) {
          if (topFixed) {
            const absoluteStickyOffsetTop = getOffset(sticky).top;
            setStyle(sticky, {
              top: absoluteStickyOffsetTop - getOffset(this.container).top + 'px',
              left: '',
              bottom: '',
              width: '',
              position: 'absolute',
            });
            topFixed = false;
          }
          if (scrollTop > stickyOffsetBottom - window.innerHeight) {
            setStyle(sticky, {
              top: '',
              left: stickyOffsetLeft + 'px',
              bottom: bottomSpace + 'px',
              width: sticky.getBoundingClientRect().width + 'px',
              position: 'fixed',
            });
            bottomFixed = true;
          }
        } else {
          const absoluteStickyOffsetTop = getOffset(sticky).top;
          if (bottomFixed) {
            setStyle(sticky, {
              top: absoluteStickyOffsetTop - getOffset(this.container).top + 'px',
              left: '',
              bottom: '',
              width: '',
              position: 'absolute',
            });
            bottomFixed = false;
          }
          if (scrollTop < absoluteStickyOffsetTop - topSpace) {
            setStyle(sticky, {
              top: topSpace + 'px',
              left: stickyOffsetLeft + 'px',
              bottom: '',
              width: sticky.getBoundingClientRect().width + 'px',
              position: 'fixed',
            });
            topFixed = true;
          }
        }
        lastScrollVal = scrollTop;

        this.scrollOptions = {
          lastScrollVal,
          topFixed,
          bottomFixed,
        };
      }
    } else {
      setStyle(this.sticky.element, {
        top: '',
        left: '',
        bottom: '',
        width: '',
        position: '',
      });
    }
  }

  render() {
    const { containerClass, children } = this.props;

    return (
      <div className={containerClass} ref={this.setContainerRef}>
        {children}
      </div>);
  }
}
StickyPanel.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  mediaQuery: PropTypes.string,
  containerClass: PropTypes.string,
  childSelector: PropTypes.string.isRequired,
  topSpace: PropTypes.number,
  bottomSpace: PropTypes.number,
};
StickyPanel.defaultProps = {
  active: true,
  bottomSpace: 0,
  topSpace: 0
};

export default StickyPanel;
