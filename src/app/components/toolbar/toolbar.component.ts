import { Component, OnInit } from '@angular/core';
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

  handleFileInput(files: File[]) {
    this.fileService.addNewFilesToFolder(files);
  }

  handleFolderInput(files: File[]) {
    this.fileService.addNewFolderToFolder(files);
  }

  removeSelected() {
    this.fileService.removeSelected();
  }
}
