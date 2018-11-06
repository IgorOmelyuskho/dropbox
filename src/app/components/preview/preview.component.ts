import {Component, DoCheck, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {FileOperationsService, FileOrFolder, FileType} from '../../services/file-operations/file-operations.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Renderer3} from '@angular/core/src/render3/interfaces/renderer';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  fileForPreview: FileOrFolder = null;
  fileContent = '';

  constructor(
    private renderer: Renderer2, private route: ActivatedRoute, private router: Router, public fileService: FileOperationsService
  ) { }

  ngOnInit() {
    this.fileService.fileForPreview.subscribe(value => {
      console.log(value);
      this.fileForPreview = value;
      this.readFile(value);
    });
  }

  readFile(file: FileOrFolder): void {
    if (!file) {
      return;
    }
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (event) => {
      this.fileContent = myReader.result;
    };

    if (file.type === FileType.Folder) {
      this.fileContent = 'Folder';
    } else if (file.type === FileType.Text) {
      myReader.readAsText(file.fileData);
    } else if (file.type === FileType.Image) {
      myReader.readAsDataURL(file.fileData);
    } else if (file.type === FileType.Audio) {
      myReader.readAsDataURL(file.fileData);
    } else if (file.type === FileType.Video) {
      myReader.readAsDataURL(file.fileData);
    } else {
      this.fileContent = 'Unknown file type';
    }
  }

}
