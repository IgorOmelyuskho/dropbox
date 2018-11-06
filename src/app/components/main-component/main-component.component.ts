import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FileOperationsService, FileOrFolder} from '../../services/file-operations/file-operations.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.css']
})
export class MainComponentComponent implements OnInit {

  fileForPreview: FileOrFolder = null;

  constructor(private router: Router, public fileService: FileOperationsService) {
    this.fileService.fileForPreview.subscribe(value => {
      this.fileForPreview = value;
    });
  }

  ngOnInit() {
    this.router.navigateByUrl('home');
  }

}
