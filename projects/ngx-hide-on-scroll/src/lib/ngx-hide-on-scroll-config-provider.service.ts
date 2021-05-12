import { Inject, Injectable } from '@angular/core';
import { defaultNgxHideOnScrollConfig } from './default-ngx-hide-on-scroll-config';
import { NgxHideOnScrollConfig } from './models/ngx-hide-on-scroll-config';
import { NGX_HIDE_ON_SCROLL_CONFIG } from './ngx-hide-on-scroll-config-injection-token';

@Injectable()
export class NgxHideOnScrollConfigProvider {

  readonly ngxHideOnScrollConfig: NgxHideOnScrollConfig;

  constructor(@Inject(NGX_HIDE_ON_SCROLL_CONFIG) config: NgxHideOnScrollConfig) {
    this.ngxHideOnScrollConfig = Object.assign(defaultNgxHideOnScrollConfig, config);
  }
}
