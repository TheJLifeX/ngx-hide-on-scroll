export interface NgxHideOnScrollConfig {
  /**
   * `'Down'`: The element will be hidden on scroll down and it will be shown again on scroll up.<br/>`Up`: The element will be hidden on scroll up and it will be shown again on scroll down.
   * ___
   * Default value: `'Down'`.
 */
  hideOnScroll?: 'Down' | 'Up';

  /**
   * The CSS property used to hide/show the element.
   * ___
   * Default value: `'top'`.
   */
  propertyUsedToHide?: 'top' | 'bottom' | 'height';

  /**
   * The value of `propertyUsedToHide` when the element is hidden.
   * ___
   * Default value: `'-100px'`.
   */
  valueWhenHidden?: string;

  /**
   * The value of `propertyUsedToHide` when the element is shown.
   * ___
   * Default value: `'0px'`.
   */
  valueWhenShown?: string;

  /**
   * The selector of the element you want to listen the scroll event, in case it is not the default browser scrolling element (`document.scrollingElement` or `document.documentElement`). For example [`.mat-sidenav-content`]( https://stackoverflow.com/a/52931772/12954396) if you are using [Angular Material Sidenav]( https://material.angular.io/components/sidenav).
   * ___
   * Default value: `undefined`.
   */
  scrollingElementSelector?: string;

  /**
   * The throttle duration in milliseconds. It is used to throttle the 'scroll' event stream with the use of the [Rxjs throttleTime](https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttletime) operator to get better performance.
   * ___
   * Default value: `50`.
   */
  throttleDuration?: number;
}
