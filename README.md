# Sticky side panel component

Sticky side panel, that will float in it's container attempting to be always visible. [Demo](https://czmavi.github.io/stickypanel/)

## Instalation

You can install it via NPM `npm i sticky-panel`

## Usage

First import it `import StickyPanel from 'sticky-panel'`

Then put it into your component render method

Minimum required parameters is just `childSelector` which is used to get reference of the child component that should be sticky.

```javascript
<StickyPanel containerClass="side-1" childSelector=".sticky-panel">
    <div className="sticky-panel">
      <p>
        Sticky side panel
      </p>
    </div>
  </StickyPanel>
```

## Parameters

| Name | Mandatory | Default | Description |
| ---  | --- | --- | --- |
| childSelector | Yes |  | Is used to get reference of the provided child component that should be sticky |
| active | No | True | Enable or disable sticky functionality |
| mediaQuery | No | | When provided stickyness will only work when the media query results to true. For example it can be used to disable sticky behavior on mobile. |
| containerClass | No | | Class that will be added to the container of provided child elements |
| topSpace | No | 0 | Top spacing. Should be used if there is something like fixed position menu bar on the top of the page |
| bottomSpace | No | 0 | Same as top spacing just on the bottom |
