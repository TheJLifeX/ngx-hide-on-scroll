# NgxHideOnScroll
## Hide an element on scroll down or up in Angular.
This library allows you to hide an html element (e.g. navbar) on scroll down and show it again on scroll up.

## [View the demo](https://stackblitz.com/edit/ngx-hide-on-scroll)

## Installation
```sh
npm install ngx-hide-on-scroll --save
```

## Usage
### Step 01: Import the NgxHideOnScrollModule to your module.
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// Import NgxHideOnScrollModule
import { NgxHideOnScrollModule } from 'ngx-hide-on-scroll';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxHideOnScrollModule // Import NgxHideOnScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### Step 02: Add the `ngxHideOnScroll` directive to your element.
**app.component.html**
```html
<!-- Example 01 -->
<nav ngxHideOnScroll [propertyUsedToHide]="'top'" [valueWhenHidden]="'-100px'" [valueWhenShown]="'0px'">
  <h2>Navbar</h2>
</nav>

<!-- Example 02 -->
<div class="fixed-footer" ngxHideOnScroll [propertyUsedToHide]="'bottom'" [valueWhenHidden]="'-100px'"
  [valueWhenShown]="'0px'">
  <h2>Fixed footer, with transition on hide/show.</h2>
</div>
```
**app.component.scss**
```scss
// Example 01
nav {
  position: fixed;
  top: 0;
  width: 100%;
  color: white;
  background-color: #2980b9;
  padding: 0 2rem;
}

// Example 02
.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  color: white;
  background-color: #2c3e50;
  padding: 0 2rem;

  transition: bottom 0.3s ease-in-out; // Transition on hide/show.
}
```

## Documentation
| `@Input()`               | Type                                   | Required | Default    | Description                                                                                                                                                                                                                                                                                                                                                               |
|--------------------------|----------------------------------------|----------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| hideOnScroll             | `'Down'` \| `'Up'`                     | optional | `'Down'`   | `'Down'`: The element will be hidden on scroll down and it will be shown again on scroll up.<br/>`Up`: The element will be hidden on scroll up and it will be shown again on scroll down.                                                                                                                                                                                 |
| propertyUsedToHide       | `'top'` \| `'bottom'` \| `'height'` | optional | `'top'`    | The CSS property used to hide/show the element.                                                                                                                                                                                                                                                                                                                           |
| valueWhenHidden          | string                                 | optional | `'-100px'` | The value of the `propertyUsedToHide` when the element is hidden.                                                                                                                                                                                                                                                                                                         |
| valueWhenShown           | string                                 | optional | `'0px'`    | The value of the `propertyUsedToHide` when the element is shown.                                                                                                                                                                                                                                                                                                          |
| scrollingElementSelector | string                                 | optional |  none      | The selector of the element you want to listen the scroll event, in case it is not the browser default scrolling element (`document.scrollingElement` or `document.documentElement`). For example [`'.mat-sidenav-content'`]( https://stackoverflow.com/a/52931772/12954396) if you are using [Angular Material Sidenav]( https://material.angular.io/components/sidenav). |

## License
MIT