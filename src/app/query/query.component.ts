import {Component, OnInit, ViewChild} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Modal} from 'angular2-modal/plugins/bootstrap/modal';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  mappingFile = '';
  query= 'Select * where { ?s ?p ?o }';
  isExample = false;
  pendingRequestQuery;
  pendingRequestMapping;
  querySent = false;

  jsonResponse;
  responseIsValid = false;

  @ViewChild('mappingInput') mappingInputVariable: any;


  constructor(private http: Http, public modal: Modal) {
  }

  showAlert (title, message) {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title(title)
      .body(message)
      .open();
  }


  checkMappingAndQuery() {
    if (this.mappingFile.length === 0 || this.query.length === 0 || this.querySent) {
      return true;
    } else {
      return false;
    }
  }

  loadMapping(event) {

    const reader = new FileReader();
    reader.onload = () => {
      // this 'text' is the content of the file
      this.mappingFile = reader.result;
    };
    reader.readAsText(event.target.files[0]);
  }

  runQuery() {
    this.responseIsValid = false;
    const params = new URLSearchParams();
    params.append('query', this.query);
    params.append('model', this.mappingFile);

    this.http.post(AppComponent.endpointURL + '/endpoint/querywithmapping', params)
      .subscribe(responseData => this.buildTable(responseData),
        err => {
          this.querySent = false;
          if (err.status === 0) {
            this.showAlert('Error', 'Connection refused');
          } else {
            this.showAlert('Status: ' + err.status, err._body);
          }
        } );

    this.querySent = true;
    // this.showAlert('Query Sent', 'Wait for the answer...');

  }

  buildTable(response: Response) {
    this.querySent = false;
    this.jsonResponse = response.json();
    console.log(this.jsonResponse);
    this.responseIsValid = true;
  }

  loadForecastExample() {
    if (this.pendingRequestQuery) {
      this.pendingRequestQuery.unsubscribe();
    }
    if (this.pendingRequestMapping) {
      this.pendingRequestMapping.unsubscribe();
    }
    this.pendingRequestQuery = this.http.get('./examples/forecast/query-new.txt')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.query = responseData);
    this.pendingRequestMapping = this.http.get('./examples/forecast/forecast-new.ttl')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.mappingFile = responseData);
    this.isExample = true;
  }

  loadFlutrackExample() {
    if (this.pendingRequestQuery) {
      this.pendingRequestQuery.unsubscribe();
    }
    if (this.pendingRequestMapping) {
      this.pendingRequestMapping.unsubscribe();
    }
    this.pendingRequestQuery = this.http.get('./examples/flutrack/query.txt')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.query = responseData);
    this.pendingRequestMapping = this.http.get('./examples/flutrack/flutrack.ttl')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.mappingFile = responseData);
    this.isExample = true;
  }

  reset() {
    if (this.isExample === false) {
      this.mappingInputVariable.nativeElement.value = '';
    }
    this.mappingFile = '';
    this.query = 'Select * where { ?s ?p ?o }';
    this.isExample = false;
    this.responseIsValid = false;
    this.querySent = false;
  }


  ngOnInit() {
  }

}
