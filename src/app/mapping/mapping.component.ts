import {AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Http, URLSearchParams, Response} from '@angular/http';
import {AppComponent} from '../app.component';
import {Modal} from 'angular2-modal/plugins/bootstrap/modal';
import {MappingInput} from '../inputModel';
import {MappingOutput} from '../outputModel';
import {AddProperty} from '../addPropertyModel';
import {AddResource} from '../addResourceModel';
import {CustomResourceIsSubjectOf} from '../CustomResourceIsSubjectOfModel';
import {CustomResourceIsObjectOf} from '../CustomResourceIsObjectOfModel';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements AfterViewChecked {

  customString = 'custom';
  separator = '/';

  serviceURL;
  output;
  namespace;
  language;
  pendingRequestURL;
  pendingRequestOutput;
  step = 1;

  model;

  jsonResponse;
  outputs;

  customResourceList: Array<AddResource>;

  inputList: Array<MappingInput>;
  editOutputList: Array<MappingOutput>;

  outputList: Array<MappingOutput>;

  suggestedPropertyList: Array<AddProperty>;
  customPropertyList: Array<AddProperty>;

  constructor(private http: Http, private modal: Modal) {
    this.inputList = [];
    this.editOutputList = [];
    this.suggestedPropertyList = [];
    this.customPropertyList = [];
    this.customResourceList = [];
  }

  isClassPristine(i) {
    if (this.inputList[i].classPristine === undefined) {
      return true;
    } else {
      if (this.inputList[i].classPristine.valueOf() === true) {
        return true;
      } else {
        return false;
      }
    }
  }


  isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }

  showAlert (title, message) {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title(title)
      .body(message)
      .open();
  }

  deleteSuggestedProperty(i) {
    this.suggestedPropertyList.splice(i, 1);
  }

  deleteCustomProperty(i) {
    this.customPropertyList.splice(i, 1);
  }

  addCustomProperty() {
    this.customPropertyList.push(new AddProperty());
  }

  addCustomResource() {
    const customResource = new AddResource();
    customResource.customResourceIsSubjectOf = [];
    customResource.customResourceIsObjectOf = [];
    this.customResourceList.push(customResource);
  }

  deleteCustomResource(i) {
    this.customResourceList.splice(i, 1);
  }

  addCustomResourceIsSubjectOf(i) {
    this.customResourceList[i].customResourceIsSubjectOf.push(new CustomResourceIsSubjectOf());
  }

  deleteCustomResourceIsSubjectOf(i, j) {
    this.customResourceList[i].customResourceIsSubjectOf.splice(j, 1);
  }

  addCustomResourceIsObjectOf(i) {
    this.customResourceList[i].customResourceIsObjectOf.push(new CustomResourceIsObjectOf());
  }

  deleteCustomResourceIsObjectOf(i, j) {
    this.customResourceList[i].customResourceIsObjectOf.splice(j, 1);
  }

  changeIsMandatory (newValue, i) {
    this.inputList[i].isMandatory = newValue;
    this.inputList[i].isEdited = true;
  }

  changeIsDatatypeProperty (newValue, i) {
    this.inputList[i].isDatatypeProperty = newValue;
    this.inputList[i].isEdited = true;
  }

  changeFindUri (newValue, i) {
    this.inputList[i].findUri = newValue;
    this.inputList[i].isEdited = true;
  }

  changeRdfClass (newValue, i) {
    this.inputList[i].rdfClass = newValue;
    this.inputList[i].isEdited = true;
    this.inputList[i].classPristine = false;
  }

  changeDefaultValue (newValue, i) {
    this.inputList[i].defaultValue = newValue;
    this.inputList[i].isEdited = true;
  }

  writeOutputChanges(changes: Array<MappingOutput>) {

    for (const change of changes) {
      let seen = false;
      for (let j = 0; j != this.editOutputList.length; j++) {
        if (change.uri == this.editOutputList[j].uri) {
          seen = true;
        }
      }
      if (!seen) {
        this.editOutputList.push(change);
      }
    }

  }

  ngAfterViewChecked() {
    AppComponent.adjustFrame();
  }

  loadForecastExample () {
    if (this.pendingRequestURL) {
      this.pendingRequestURL.unsubscribe();
    }
    if (this.pendingRequestOutput) {
      this.pendingRequestOutput.unsubscribe();
    }
    this.pendingRequestURL = this.http.get('./examples/forecast/forecast-url.txt')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.serviceURL = responseData);
    this.pendingRequestOutput = this.http.get('./examples/forecast/forecast-output.txt')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.output = responseData);
    this.language = 'xml';
  }

  loadFlutrackExample () {
    if (this.pendingRequestURL) {
      this.pendingRequestURL.unsubscribe();
    }
    if (this.pendingRequestOutput) {
      this.pendingRequestOutput.unsubscribe();
    }
    this.pendingRequestURL = this.http.get('./examples/flutrack/url.txt')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.serviceURL = responseData);
    this.pendingRequestOutput = this.http.get('./examples/flutrack/output.txt')
      .map((responseData) => responseData.text())
      .subscribe(responseData => this.output = responseData);
    this.language = 'json';
  }

  save() {
    const blob = new Blob([this.model], { type: 'text/ttl'});
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

    this.step++;

  }

  firstRequest() {
    this.step++;

    const params = new URLSearchParams();
    params.append('url', this.serviceURL);
    params.append('output', this.output);
    params.append('language', this.language);
    if (this.namespace != null) {
      params.append('namespace', this.namespace);
    }

    this.http.post(AppComponent.endpointURL + '/endpoint/getmodelandstructuredparams', params)
      .subscribe(responseData => this.firstResponse(responseData),
        err => {
          if (err.status === 0) {
            this.showAlert('Error', 'Connection refused');
            this.step--;
          } else {
            this.showAlert('Status: ' + err.status, err._body);
            this.step--;
          }
        } );
  }

  firstResponse(response) {
    this.step ++;

    this.jsonResponse = response.json();

    this.outputs = this.jsonResponse.Output;

    this.inputList = this.jsonResponse.Input;

    this.outputList = this.jsonResponse.outputList;


    this.model = this.jsonResponse.model;


  }

  secondRequest() {
    this.step++;

    const inputParam = [];
    const outputParam = [];

    const customResources = [];
    const customResourcesIsObject = [];
    const customResourcesIsSubject = [];

    for (const input of this.inputList) {
      if (input.isEdited) {
        const inputEdit = {};
        inputEdit['inputURI'] = input.uri;
        if (input.defaultValue) {
          inputEdit['fixedValue'] = input.defaultValue;
        }
        if (input.isMandatory) {
          inputEdit['isRequired'] = input.isMandatory;
        }
        if (input.isDatatypeProperty) {
          inputEdit['DatatypeProperty'] = input.isDatatypeProperty;
        }
        if (input.rdfClass) {
          inputEdit['classRDF'] = input.rdfClass;
        }
        if (input.findUri) {
          inputEdit['findUri'] = input.findUri;
        }
        inputParam.push(inputEdit);
      }
    }

    for (const output of this.editOutputList) {
      if (output.isEdited) {
        const outputEdit = {};
        outputEdit['outputURI'] = output.uri;
        if (output.hasValue) {
          outputEdit['isData'] = output.hasValue;
        }
        if (output.isDatatypeProperty) {
          outputEdit['DatatypeProperty'] = output.isDatatypeProperty;
        }
        if (output.contentType) {
          outputEdit['content'] = output.contentType;
        }
        if (output.rdfClass) {
          outputEdit['classRDF'] = output.rdfClass;
        }
        if (output.findUri) {
          outputEdit['findUri'] = output.findUri;
        }

        outputParam.push(outputEdit);
      }
    }

    for (const customResource of this.customResourceList) {
      for (const resourceIsSubject of customResource.customResourceIsSubjectOf) {
        const resourceIsSubjectObj = {};
        resourceIsSubjectObj['propertyURI'] = resourceIsSubject.propertyURI;
        resourceIsSubjectObj['objectURI'] = resourceIsSubject.objectURI;
        customResourcesIsSubject.push(resourceIsSubjectObj);
      }
      for (const resourceIsObject of customResource.customResourceIsObjectOf) {
        const resourceIsObjectObj = {};
        resourceIsObjectObj['propertyURI'] = resourceIsObject.propertyURI;
        resourceIsObjectObj['subjectURI'] = resourceIsObject.subjectURI;
        customResourcesIsObject.push(resourceIsObjectObj);
      }
      const customResourceObj = {};
      if (customResource.findUri) {
        customResourceObj['findUri'] = customResource.findUri;
      }
      customResourceObj['resourceIsSubjectOf'] = customResourcesIsSubject;
      customResourceObj['resourceIsObjectOf'] = customResourcesIsObject;
      customResources.push(customResourceObj);
    }


    const param = {};


    param['editInput'] = inputParam;
    param['editOutput'] = outputParam;
    param['addResource'] = customResources;
    param['model'] = this.model;

    const params = new URLSearchParams();

    params.append('json', JSON.stringify(param));

    console.log(params);

    this.http.post(AppComponent.endpointURL + '/endpoint/edit', params)
      .subscribe(responseData => this.secondResponse(responseData),
        err => {
          if (err.status === 0) {
            this.showAlert('Error', 'Connection refused');
            this.step--;
          } else {
            this.showAlert('Status: ' + err.status, err._body);
            this.step--;
          }
        } );

  }

  secondResponse(response) {
    this.thirdRequest(response._body);
  }

  thirdRequest(secondResponse) {
    const params = new URLSearchParams();

    params.append('model', secondResponse);
    this.model = secondResponse;

    this.http.post(AppComponent.endpointURL + '/endpoint/suggestproperties', params)
      .subscribe(responseData => this.thirdResponse(responseData),
        err => {
          if (err.status === 0) {
            this.showAlert('Error', 'Connection refused');
            this.step--;
          } else {
            this.showAlert('Status: ' + err.status, err._body);
            this.step--;
          }
        } );

  }


  thirdResponse(response) {
    this.step++;

    this.jsonResponse = response.json();

    this.suggestedPropertyList = this.jsonResponse.properties;

  }

  fourthRequest() {
    this.step++;

    const params = new URLSearchParams();

    const jsonParam = {};

    jsonParam['model'] = this.model;

    const addPropertyList = [];
    if (this.suggestedPropertyList) {
      for (const prop of this.suggestedPropertyList){
        const property = {};
        property['subjectURI'] = prop.subjectUri;
        property['objectURI'] = prop.objectUri;
        property['propertyURI'] = prop.property;
        if (prop.property === this.customString) {
          property['propertyURI'] = prop.customProperty;
        } else {
          property['propertyURI'] = prop.property;
        }
        addPropertyList.push(property);
      }
    }
    if (this.customPropertyList) {
      for (const prop of this.customPropertyList){
        const property = {};
        property['subjectURI'] = prop.subjectUri;
        property['objectURI'] = prop.objectUri;
        property['propertyURI'] = prop.property;
        addPropertyList.push(property);
      }
    }


    jsonParam['addProperty'] = addPropertyList;

    params.append('json', JSON.stringify(jsonParam));


    console.log(params);
    console.log(jsonParam);


    this.http.post(AppComponent.endpointURL + '/endpoint/edit', params)
      .subscribe(responseData => this.fourthResponse(responseData),
        err => {
          if (err.status === 0) {
            this.showAlert('Error', 'Connection refused');
            this.step--;
          } else {
            this.showAlert('Status: ' + err.status, err._body);
            this.step--;
          }
        } );
  }

  fourthResponse(response) {
    this.step ++;

    this.model = response.text();

  }


}
