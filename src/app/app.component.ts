import {AfterViewChecked, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
//  static endpointURL = 'http://localhost:8080';
  static endpointURL = 'http://193.204.59.20:8081/poldo';

  static adjustFrame() {
    // console.log('adjust');
    const iframe = window.parent.document.getElementById('angular-frame');
    if (iframe) {
      iframe.style.height = document.body.offsetHeight + 'px';
      iframe.style.width = document.body.offsetWidth + 'px';
    }
  }
}
