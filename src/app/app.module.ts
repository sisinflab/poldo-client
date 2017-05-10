import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AlertModule } from 'ng2-bootstrap';
import { QueryComponent } from './query/query.component';
import { MappingComponent } from './mapping/mapping.component';
import { RouterModule } from '@angular/router';
import { KeyValuePipePipe } from './key-value-pipe.pipe';
import {ModalModule} from 'angular2-modal';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import { MergeComponent } from './merge/merge.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { EditMappingComponent } from './edit-mapping/edit-mapping.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryComponent,
    MappingComponent,
    KeyValuePipePipe,
    MergeComponent,
    TreeViewComponent,
    EditMappingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    AlertModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: QueryComponent
      },
      {
        path: 'mapping',
        component: MappingComponent
      },
      {
        path: 'merge',
        component: MergeComponent
      },
      {
        path: 'edit-mapping',
        component: EditMappingComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
