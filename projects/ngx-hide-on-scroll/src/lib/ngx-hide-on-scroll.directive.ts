import { Directive, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, Input, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  takeUntil,
  throttleTime
} from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { NgxHideOnScrollConfigProvider } from './ngx-hide-on-scroll-config-provider.service';
import { ScrollDirection } from './models/scroll-direction';

// Learn more about html elements that can be displayed or hidden based on the direction of the scroll in angular in this artcile: https://netbasal.com/reactive-sticky-header-in-angular-12dbffb3f1d3

/**
 * The `ngxHideOnScroll` directive allows you to hide an html element (e.g. navbar) on scroll down and show it again on scroll up.
 */
@Directive({
  selector: '[ngxHideOnScroll]'
})
export class NgxHideOnScrollDirective implements OnInit, AfterViewInit, OnDestroy {

  /**
   * `'Down'`: The element will be hidden on scroll down and it will be shown again on scroll up.<br/>`Up`: The element will be hidden on scroll up and it will be shown again on scroll down.
   * ___
   * Default value: `'Down'`.
   */
  @Input() hideOnScroll!: 'Down' | 'Up';

  /**
   * The CSS property used to hide/show the element.
   * ___
   * Default value: `'top'`.
   */
  @Input() propertyUsedToHide!: 'top' | 'bottom' | 'height';

  /**
   * The value of `propertyUsedToHide` when the element is hidden.
   * ___
   * Default value: `'-100px'`.
   */
  @Input() valueWhenHidden!: string;

  /**
   * The value of `propertyUsedToHide` when the element is shown.
   * ___
   * Default value: `'0px'`.
   */
  @Input() valueWhenShown!: string

  /**
   * The selector of the element you want to listen the scroll event, in case it is not the default browser scrolling element (`document.scrollingElement` or `document.documentElement`). For example [`.mat-sidenav-content`]( https://stackoverflow.com/a/52931772/12954396) if you are using [Angular Material Sidenav]( https://material.angular.io/components/sidenav).
   * ___
   * Default value: `undefined`.
   */
  @Input() scrollingElementSelector?: string;

  /**
   * The throttle duration in milliseconds. It is used to throttle the 'scroll' event stream with the use of the [Rxjs throttleTime](https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttletime) operator to get better performance.
   * ___
   * Default value: `50`.
   */
  @Input() throttleDuration!: number;

  private unsubscribeNotifier = new Subject();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private configProvider: NgxHideOnScrollConfigProvider,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const {
      hideOnScroll,
      propertyUsedToHide,
      valueWhenHidden,
      valueWhenShown,
      scrollingElementSelector,
      throttleDuration
    } = this.configProvider.ngxHideOnScrollConfig;

    this.hideOnScroll = this.hideOnScroll || hideOnScroll;
    this.propertyUsedToHide = this.propertyUsedToHide || propertyUsedToHide;
    this.valueWhenHidden = this.valueWhenHidden || (valueWhenHidden as string);
    this.valueWhenShown = this.valueWhenShown || (valueWhenShown as string);
    this.scrollingElementSelector = this.scrollingElementSelector || (scrollingElementSelector as string);
    this.throttleDuration = this.throttleDuration || (throttleDuration as number);
  }

  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    let elementToListenScrollEvent: Window | HTMLElement;
    let scrollingElement: HTMLElement;
    if (!this.scrollingElementSelector) {
      elementToListenScrollEvent = window;
      scrollingElement = this.getDefaultScrollingElement();
    } else {
      scrollingElement = document.querySelector(this.scrollingElementSelector) as HTMLElement;
      if (!scrollingElement) {
        console.error(`\nNgxHideOnScroll: @Input() scrollingElementSelector\nElement with selector: "${this.scrollingElementSelector}" not found.`);
        return;
      }
      elementToListenScrollEvent = scrollingElement;
    }

    const scroll$ = fromEvent(elementToListenScrollEvent, 'scroll').pipe(
      takeUntil(this.unsubscribeNotifier),
      throttleTime(this.throttleDuration),
      map(() => scrollingElement.scrollTop), // get vertical scroll position
      pairwise(),  // look at this and the last emitted element
      // compare this and the last element to figure out scrolling direction
      map(([y1, y2]): ScrollDirection => (y2 < y1 ? ScrollDirection.Up : ScrollDirection.Down)),
      distinctUntilChanged(), // only emit when scrolling direction changed
      share() // share a single subscription to the underlying sequence in case of multiple subscribers
    );

    const scrollUp$ = scroll$.pipe(
      filter(direction => direction === ScrollDirection.Up)
    );

    const scrollDown$ = scroll$.pipe(
      filter(direction => direction === ScrollDirection.Down)
    );

    let scrollUpAction: () => void;
    let scrollDownAction: () => void;
    if (this.hideOnScroll === 'Up') {
      scrollUpAction = () => this.hideElement();
      scrollDownAction = () => this.showElement();
    } else {
      scrollUpAction = () => this.showElement();
      scrollDownAction = () => this.hideElement();
    }

    scrollUp$.subscribe(() => scrollUpAction());
    scrollDown$.subscribe(() => scrollDownAction());
  }

  ngOnDestroy(): void {
    this.unsubscribeNotifier.next();
    this.unsubscribeNotifier.complete();
  }

  private hideElement() {
    this.elementRef.nativeElement.style[this.propertyUsedToHide] = this.valueWhenHidden;
  }

  private showElement() {
    this.elementRef.nativeElement.style[this.propertyUsedToHide] = this.valueWhenShown;
  }

  private getDefaultScrollingElement() {
    return (document.scrollingElement || document.documentElement) as HTMLElement;
  }
}
