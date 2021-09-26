import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  getArray(n: number): Array<void> {
    return new Array(n);
  }

  onEventFooterElementHidden(): void {
    console.log('onEventFooterElementHidden');
  }

  onEventFooterElementShown(): void {
    console.log('onEventFooterElementShown');
  }
}
