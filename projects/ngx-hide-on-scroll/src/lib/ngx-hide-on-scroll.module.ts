import { ModuleWithProviders, NgModule } from '@angular/core';
import { NGX_HIDE_ON_SCROLL_CONFIG } from './ngx-hide-on-scroll-config-injection-token';
import { NgxHideOnScrollDirective } from './ngx-hide-on-scroll.directive';
import { NgxHideOnScrollConfig } from './models/ngx-hide-on-scroll-config';
import { NgxHideOnScrollConfigProvider } from './ngx-hide-on-scroll-config-provider.service';


@NgModule({
  declarations: [NgxHideOnScrollDirective],
  exports: [NgxHideOnScrollDirective],
  providers: [NgxHideOnScrollConfigProvider]
})
export class NgxHideOnScrollModule {

  private static forRootNgxHideOnScrollConfig: NgxHideOnScrollConfig;

  /**
   * Use this method in your root module.
   */
  static forRoot(config?: NgxHideOnScrollConfig): ModuleWithProviders<NgxHideOnScrollModule> {
    if (config) {
      NgxHideOnScrollModule.forRootNgxHideOnScrollConfig = config;
    }

    return {
      ngModule: NgxHideOnScrollModule,
      providers: [
        { provide: NGX_HIDE_ON_SCROLL_CONFIG, useValue: config }
      ]
    };
  }

  /**
   * Use this method in your other (non root) modules.
   */
  static forChild(config?: NgxHideOnScrollConfig): ModuleWithProviders<NgxHideOnScrollModule> {
    return NgxHideOnScrollModule.forRoot(config || NgxHideOnScrollModule.forRootNgxHideOnScrollConfig);
  }
}
