import { NgxHideOnScrollConfig } from './models/ngx-hide-on-scroll-config';

export const defaultNgxHideOnScrollConfig: NgxHideOnScrollConfig = {
  hideOnScroll: 'Down',
  propertyUsedToHide: 'top',
  valueWhenHidden: '-100px',
  valueWhenShown: '0px',
  throttleDuration: 50
};
