import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponentComponent } from './components/main-component/main-component.component';
import { ContentAreaComponent } from './components/content-area/content-area.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { PreviewComponent } from './components/preview/preview.component';
import {RouterModule} from '@angular/router';
import { ContentAndToolbarWrapperComponent } from './components/content-and-toolbar-wrapper/content-and-toolbar-wrapper.component';
import { ChooseIconDirective } from './directives/choose-icon/choose-icon.directive';


@NgModule({
  declarations: [
    AppComponent,
    MainComponentComponent,
    ContentAreaComponent,
    ToolbarComponent,
    PreviewComponent,
    ContentAndToolbarWrapperComponent,
    ChooseIconDirective,
  ],
  imports: [
    BrowserModule,
    Ng2SmartTableModule,
    DataTablesModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: ContentAndToolbarWrapperComponent,
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: ContentAndToolbarWrapperComponent,
      },
      {
        path: '**',
        component: ContentAndToolbarWrapperComponent,
      }
    ]),

  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
