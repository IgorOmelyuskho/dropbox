import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileOperationsService} from '../../services/file-operations/file-operations.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private fileService: FileOperationsService) { }

  ngOnInit() {
  }

  handleFileInput(target) {
    const files: File[]  = target.files;
    this.fileService.addNewFilesToFolder(files);
    this.fileService.setAllFoldersSize();
    target.value = '';
  }

  handleFolderInput(target) {
    const files: File[]  = target.files;
    this.fileService.addNewFolderToFolder(files);
    this.fileService.setAllFoldersSize();
    target.value = '';
  }

  removeSelected() {
    this.fileService.removeSelected();
    this.fileService.setAllFoldersSize();
  }

  notImplemented() {
    alert('Not Implemented');
  }
}
