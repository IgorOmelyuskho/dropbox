import {
  Component,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {FileOperationsService, FileOrFolder} from '../../services/file-operations/file-operations.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.css'],
})
export class ContentAreaComponent implements OnInit, OnDestroy {
  @ViewChild('tableBody') tableBody: ElementRef;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  getSelected() {
    console.log(this.fileService.checkedRowData);
  }

  constructor(
    private router: Router,
    public fileService: FileOperationsService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
    };
    this.dtTrigger.next();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // file or folder
  rowOnSelect(fileOrFolder: FileOrFolder) {
    this.fileService.openFileOrFolder(fileOrFolder);
  }

  checkboxOnClick(fileOrFolder: FileOrFolder, event) {
    event.stopPropagation();
  }

  selectAll(event) {
    this.fileService.selectAll(event, this.tableBody);
  }

  checkBoxOnChange(fileOrFolder, event) {
    this.fileService.checkBoxOnChange(fileOrFolder, event);
  }

  getHomeFolder() {
    console.log(this.fileService.homeFolder);
  }

  getRouteParams() {
    console.log('PREVIEW = FILENAME = ', this.activateRoute.snapshot.queryParams.preview);
    console.log(this.activateRoute.snapshot);
    console.log(this.activateRoute.snapshot['_routerState'].url);
  }

  getCurrentFolder() {
    console.log(this.fileService.currentFolder);
  }
}
