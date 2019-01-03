import React from 'react';
import { render } from 'react-dom';
import MyComponent from '../../src';

import './index.css';

const App = () => (
  <div className="container">
    <div className="header">
      <h1>Header</h1>
    </div>
    <div className="content">Content…</div>
    <MyComponent mediaQuery="screen and (min-width: 600px)" containerClass="side-1" childSelector=".sticky-panel">
      <div className="sticky-panel">
        <p>
          Sticky side panel<br />
          <span className="sticky-warning">Sticks only if widht is >= 600px</span>
        </p>
      </div>
    </MyComponent>
    <div className="side-2">Side 2</div>
    <div className="footer">
      <h1>Footer</h1>
      <p>Sliding panel won't scrol down here</p>
    </div>
  </div>
  
);
render(<App />, document.getElementById("root"));