import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {FileType} from '../../services/file-operations/file-operations.service';


@Directive({
  selector: '[appChooseIcon]'
})
export class ChooseIconDirective implements OnInit {
  @Input('fileType') fileType: FileType;

  constructor(
    private elementRef: ElementRef,
    // private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    console.log(this.elementRef);
    // console.log(this.templateRef);
    console.log(this.viewContainerRef);
    // console.log(this.fileType);
    let className = '';
    if (this.fileType === FileType.Folder) {
      className = 'fa-folder';
    } else if (this.fileType === FileType.Text) {
      className = 'fa-file-alt';
    } else if (this.fileType === FileType.Image) {
      className = 'fa-file-image';
    } else if (this.fileType === FileType.Audio) {
      className = 'fa-file-audio';
    } else if (this.fileType === FileType.Video) {
      className = 'fa-file-video';
    } else {
      className = 'fa-file';
    }

    this.elementRef.nativeElement.classList.add(className);
  }

}


