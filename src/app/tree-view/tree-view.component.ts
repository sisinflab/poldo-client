import {Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {MappingOutput} from '../outputModel';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit, OnChanges {

  separator = '/';

  @Input() private children: Array<MappingOutput>;
  @Input() private path: string;

  @Output() private outputChange: EventEmitter<MappingOutput[]> = new EventEmitter<MappingOutput[]>();

  private outputSubList: Array<MappingOutput> = new Array<MappingOutput>();

  private classPlaceholder: string;


  constructor() {
  }

  isClassPristine(i) {
    if (this.outputSubList[i].classPristine === undefined) {
      return true;
    } else {
      if (this.outputSubList[i].classPristine.valueOf() === true) {
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

  changeContentType(newValue, i) {
    this.outputSubList[i].contentType = newValue;
    this.outputSubList[i].isEdited = true;
  }

  changeHasValue(newValue, i) {
    this.outputSubList[i].hasValue = newValue;
    this.outputSubList[i].isEdited = true;
  }

  changeRdfClass(newValue, i) {
    this.outputSubList[i].rdfClass = newValue;
    this.outputSubList[i].isEdited = true;
    this.outputSubList[i].classPristine = false;

  }

  changeDatatypeProperty(newValue, i) {
    this.outputSubList[i].isDatatypeProperty = newValue;
    this.outputSubList[i].isEdited = true;
  }

  changeFindUri(newValue, i) {
    this.outputSubList[i].findUri = newValue;
    this.outputSubList[i].isEdited = true;
  }

  emitChanges(childChanges: Array<MappingOutput>) {
    if (childChanges == null) {
      this.outputChange.emit(this.outputSubList);
    } else {
      this.outputChange.emit(this.outputSubList.concat(childChanges));
    }
  }

  ngOnChanges() {
    this.emitChanges(null);
  }

  ngOnInit() {
    // add every child to outputSubList
    if (this.children) {
      for (const child of this.children) {
        // console.log(child);
        const outputChild = new MappingOutput();
        outputChild.uri = child.uri;
        outputChild.label = child.label;
        if (child.hasValue) {
          outputChild.hasValue = child.hasValue;
          outputChild.contentType = child.contentType;
        }

        this.outputSubList.push(outputChild);

        // console.log(outputChild.label);

      }
    }
    // this.outputChange.emit(this.outputSubList);
  }


}
