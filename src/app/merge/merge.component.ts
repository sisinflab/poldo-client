import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Http, URLSearchParams, Response} from '@angular/http';
import {Modal} from 'angular2-modal/plugins/bootstrap/modal';
import 'rxjs/Rx';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.css']
})
export class MergeComponent implements OnInit {

  // if i use fileArray for ngFor it doesn't work.
  fileArray = [];
  fileNameArray = [];
  file;

  @ViewChildren('inputFile') indexView: QueryList<any>;

  constructor(private http: Http, public modal: Modal) {
    this.fileArray[0] = '';
    this.fileArray[1] = '';
    this.fileNameArray[0] = 'file not selected';
    this.fileNameArray[1] = 'file not selected';
  }

  ngOnInit() {
  }

  moreThanTwoFiles() {
    if (this.fileNameArray.length > 2)
      return true;
    else
      return false;
  }



  loadFile(event, i) {
    console.log(i);

    this.fileNameArray[i] = event.target.value.substring(event.target.value.lastIndexOf('\\') + 1);

    const reader = new FileReader();
    reader.onload = () => {
      // this 'text' is the content of the file
      this.file = reader.result;
      this.fileArray.splice(i, 1, reader.result);
      // this.fileArray[i] = reader.result  // same thing
    };
    reader.readAsText(event.target.files[0]);
  }

  addFile() {
    this.fileNameArray.push('file not selected');
    this.fileArray.push('');
  }

  removeFile(i) {

    this.fileNameArray.splice(i, 1);
    this.fileArray.splice(i, 1);
  }

  mergeFiles() {
    console.log(this.fileArray);
    const param = {};
    param['models'] = this.fileArray;
    console.log(JSON.stringify(param));

    const params = new URLSearchParams();
    params.append('models', JSON.stringify(param));

    this.http.post(AppComponent.endpointURL + '/endpoint/merge', params)
      .subscribe(responseData => this.modelReceived(responseData),
        err => { this.showAlert('Status: ' + err.status, '' + err.statusText); } );

  }

  modelReceived(response: Response){
    console.log(response);
    const blob = new Blob([response.text()], { type: 'text/ttl'});
    const currentDate = new Date();
    const dateTime = currentDate.getDate() + '/'
      + (currentDate.getMonth() + 1)  + '/'
      + currentDate.getFullYear() + ' @ '
      + currentDate.getHours() + ':'
      + currentDate.getMinutes() + ':'
      + currentDate.getSeconds();

    const fileName = 'FileMap' + dateTime + '.ttl';

    const fileSaver = require('file-saver');

    fileSaver.saveAs(blob, fileName);

  }

  showAlert (title, message) {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title(title)
      .body(message)
      .open();
  }

}
