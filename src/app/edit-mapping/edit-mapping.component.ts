import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-mapping',
  templateUrl: './edit-mapping.component.html',
  styleUrls: ['./edit-mapping.component.css']
})
export class EditMappingComponent implements OnInit {

  mappingFile;

  constructor() { }

  ngOnInit() {
  }

  loadMapping(event) {

    const reader = new FileReader();
    reader.onload = () => {
      // this 'text' is the content of the file
      this.mappingFile = reader.result;
    };
    reader.readAsText(event.target.files[0]);
  }

  save() {
    const blob = new Blob([this.mappingFile], { type: 'text/ttl'});
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

}
