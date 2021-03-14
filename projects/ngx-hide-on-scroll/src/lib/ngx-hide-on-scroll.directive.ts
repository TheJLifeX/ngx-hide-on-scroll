import { Directive, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, Input } from '@angular/core';
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

// Inspired by: https://netbasal.com/reactive-sticky-header-in-angular-12dbffb3f1d3

/**
 * The `ngxHideOnScroll` directive allows you to hide an html element (e.g. navbar) on scroll down and show it again on scroll up.
 */
@Directive({
  selector: '[ngxHideOnScroll]'
})
export class NgxHideOnScrollDirective implements AfterViewInit, OnDestroy {

  /**
   * `'Down'`: The element will be hidden on scroll down and it will be shown again on scroll up.<br/>`Up`: The element will be hidden on scroll up and it will be shown again on scroll down.
   */
  @Input() hideOnScroll: 'Down' | 'Up' = 'Down';

  /**
   * The CSS property used to hide/show the element.
   */
  @Input() propertyUsedToHide: 'top' | 'bottom' | 'height' = 'top';

  /**
   * The value of `propertyUsedToHide` when the element is hidden.
   */
  @Input() valueWhenHidden: string = '-100px';

  /**
   * The value of `propertyUsedToHide` when the element is shown.
   */
  @Input() valueWhenShown: string = '0px';

  /**
   * The selector of the element you want to listen the scroll event, in case it is not the default browser scrolling element (`document.scrollingElement` or `document.documentElement`). For example [` .mat-sidenav-content`]( https://stackoverflow.com/a/52931772/12954396) if you are using [Angular Material Sidenav]( https://material.angular.io/components/sidenav)
   */
  @Input() scrollingElementSelector: string = '';

  private unsubscribeNotifier = new Subject();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    let elementToListenScrollEvent;
    let scrollingElement: HTMLElement;
    if (!this.scrollingElementSelector) {
      elementToListenScrollEvent = window;
      scrollingElement = this.getDefaultScrollingElement();
    } else {
      scrollingElement = document.querySelector(this.scrollingElementSelector) as HTMLElement;
      if (!scrollingElement) {
        console.error(`NgxHideOnScroll: @Input() scrollingElementSelector\nElement with selector: "${this.scrollingElementSelector}" not found.`);
        return;
      }
      elementToListenScrollEvent = scrollingElement;
    }

    const scroll$ = fromEvent(elementToListenScrollEvent, 'scroll').pipe(
      takeUntil(this.unsubscribeNotifier),
      throttleTime(50), // only emit every 50 ms
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

enum ScrollDirection {
  Up = 'Up',
  Down = 'Down'
}