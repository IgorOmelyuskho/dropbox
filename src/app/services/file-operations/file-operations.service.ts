import {Injectable, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { v4 as UUID } from 'uuid';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';


export enum FileType {
  Folder = 'Folder',
  Text = 'Text',
  Image = 'Image',
  Audio = 'Audio',
  Video = 'Video',
  Another = 'Another'
}

export class FileOrFolder {
  name: string;
  size: number;
  modificationDate: string;
  type: FileType;
  fileData: File; // only file
  folderData: FileOrFolder[]; // only folder
  parentFolder: FileOrFolder;

  constructor(name: string, size: number, modificationDate: string,
              type: FileType, fileData: File, folderData: FileOrFolder[], parentFolder: FileOrFolder) {
    this.name = name;
    this.size = size;
    this.modificationDate = modificationDate;
    this.type = type;
    this.fileData = fileData;
    this.folderData = folderData;
    this.parentFolder = parentFolder;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileOperationsService {

  checkedRowData: FileOrFolder[] = [];

  fileForPreview: BehaviorSubject<FileOrFolder> = new BehaviorSubject(null);

  homeFolder = new FileOrFolder('home', 0, '- -', FileType.Folder, null, [], null);

  currentFolder: FileOrFolder = this.homeFolder;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.resetSelected();
        data.urlAfterRedirects = decodeURI(data.urlAfterRedirects);
        const pathAndParams = data.urlAfterRedirects.split('?');
        const foldersArr = pathAndParams[0].split('/');
        this.currentFolder = this.getFolderFromPath(foldersArr);

        if (pathAndParams.length > 1) { // has file name in request URL
          const fileForePreview = this.getFileFromFolder(this.currentFolder, pathAndParams[1].split('=')[1]);
          if (fileForePreview) {
            this.fileForPreview.next(fileForePreview);
          } else {
            console.log('CURRENT FILE === NULL'); // some error
            this.fileForPreview.next(null);
          }
        } else {
          // console.log('CURRENT FILE === NULL'); // no has file name on request URL
          this.fileForPreview.next(null);
        }

      }
    });
  }

  getFileFromFolder(folder: FileOrFolder, fileName: string): FileOrFolder {
    for (let i = 0; i < folder.folderData.length; i++) {
      if (folder.folderData[i].name === fileName && folder.folderData[i].type !== FileType.Folder) {
        return folder.folderData[i];
      }
    }
    return null;
  }

  getFolderFromPath(path: string[]): FileOrFolder {
    path.shift();
    let result = this.homeFolder;
    for (let i = 0; i < path.length; i++) {
      for (let j = 0; j < result.folderData.length; j++) {
        if (result.folderData[j].name === path[i]) {
          result = result.folderData[j];
          break;
        }
      }
    }
    return result;
  }

  getPathForFolder(folder: FileOrFolder): string[] {
    let currentName;
    let currentFolder = folder;
    let result: string[] = [];
    while (currentFolder.parentFolder !== null) {
      currentName = currentFolder.name;
      result.push(currentName);
      currentFolder = currentFolder.parentFolder;
    }
    result.push('home');
    result = result.reverse();
    return result;
  }

  openFileOrFolder(fileOrFolder: FileOrFolder) {
    let path: string[] = [];
    if (fileOrFolder.type === FileType.Folder) { // folder
      this.currentFolder = fileOrFolder;
      path = this.getPathForFolder(this.currentFolder);
      this.router.navigate([...path]);
      console.log('FOLDER');
    } else { // file
      const fileName = fileOrFolder.fileData.name;
      path = this.getPathForFolder(this.currentFolder);
      console.log('FILE');

      this.router.navigate(
        [...path],
        {
          queryParams: {
            'preview': fileName,
          }
        }
      );
    }
  }

  parseDate(timestampDate: number) {
    const date = new Date(timestampDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  removeSelected() {
    if (this.checkedRowData.length === 0) {
      return;
    }

    for (let i = this.currentFolder.folderData.length - 1; i >= 0 ; i--) {
      for (let j = 0; j < this.checkedRowData.length; j++) {
        if (this.currentFolder.folderData[i] === this.checkedRowData[j]) {
          this.currentFolder.folderData.splice(i, 1);
        }
      }
    }

    this.checkedRowData = [];
  }

  selectAll(event, tableBody) {
    const inputs = tableBody.nativeElement.querySelectorAll('tr td input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].checked = event.target.checked;
    }
    if (event.target.checked === true) {
      this.checkedRowData = [];
      for (let i = 0; i < this.currentFolder.folderData.length; i++) {
        this.checkedRowData.push(this.currentFolder.folderData[i]);
      }
    } else {
      this.checkedRowData = [];
    }
    console.log(this.checkedRowData);
  }

  checkBoxOnChange(fileOrFolder, event) {
    if (event.target.checked === true) {
      this.checkedRowData.push(fileOrFolder);
    } else {
      for (let i = 0; i < this.checkedRowData.length; i++) {
        if (fileOrFolder === this.checkedRowData[i]) {
          this.checkedRowData.splice(i, 1);
        }
      }
    }
    console.log(this.checkedRowData);
  }

  addNewFilesToFolder(files: File[], parentFolder: FileOrFolder = this.currentFolder) {
    for (let i = 0; i < files.length; i++) {
      const newFile = this.createFile(files[i], parentFolder);
      parentFolder.folderData.push(newFile);
    }
  }

  createFile(file: File, parentFolder: FileOrFolder): FileOrFolder {
    const fileName = file.name;
    const fileSize = file.size;
    const fileType: FileType = this.switchFileType(file.type.split('/')[0]);
    const modificationDate = this.parseDate(file.lastModified);
    const fileData: File = file;
    const folderData = null;
    return new FileOrFolder(fileName, fileSize, modificationDate, fileType, fileData, folderData, parentFolder);
  }

  switchFileType(plainFileType: string): FileType {
    if (plainFileType === 'text') {
      return FileType.Text;
    } else if (plainFileType === 'image') {
      return FileType.Image;
    } else if (plainFileType === 'audio') {
      return FileType.Audio;
    } else if (plainFileType === 'video') {
      return FileType.Video;
    } else {
      return FileType.Another;
    }
  }

  // return root folder (and inserted in this folder files)
  addNewFolderToFolder(files: File[], parentFolder: FileOrFolder = this.currentFolder, depth: number = 1): FileOrFolder {
    const rootFolderName = files[0].webkitRelativePath.split('/')[depth - 1];
    const rootFolder = new FileOrFolder(rootFolderName, 0, '- -', FileType.Folder, null, [], parentFolder);
    parentFolder.folderData.push(rootFolder);
    const equalF: File[][] = this.getListEqualFolders(files, depth);

    for (let i = 0; i < equalF[0].length; i++) {
      const newFile: FileOrFolder = this.createFile(equalF[0][i], rootFolder);
      rootFolder.folderData.push(newFile);
    }

    for (let i = 1; i < equalF.length; i++) {
        this.addNewFolderToFolder(equalF[i], rootFolder, depth + 1);
    }
    return rootFolder;
  }

  setAllFoldersSize(currentFolder: FileOrFolder = this.homeFolder): number {
    let currentFolderSize = 0;
    for (let i = 0; i < currentFolder.folderData.length; i++) {
      if (currentFolder.folderData[i].type === FileType.Folder) {
        currentFolderSize += this.setAllFoldersSize(currentFolder.folderData[i]);
      } else {
        currentFolderSize += currentFolder.folderData[i].size;
      }
    }
    currentFolder.size = currentFolderSize;
    return currentFolderSize;
  }

  resetSelected() {
    this.checkedRowData = [];
  }

  getListEqualFolders(files: File[], depth: number): File[][] {
    const tempResult: File[][] = [];
    const result: File[][] = [];
    let resultItem: File[] = [files[0]];
    tempResult.push(resultItem);
    for (let i = 0; i < files.length - 1; i++) {
      if (files[i].webkitRelativePath.split('/')[depth] === files[i + 1].webkitRelativePath.split('/')[depth]) {
        resultItem.push(files[i + 1]);
      } else {
        resultItem = [];
        resultItem.push(files[i + 1]);
        tempResult.push(resultItem);
      }
    }

    let c = 0;
    const filesArr: File[] = [];
    while (tempResult[c].length === 1 && (tempResult[c][0].webkitRelativePath.split('/').length - depth) === 1) {
      filesArr.push(tempResult[c][0]);
      c++;
      if (!tempResult[c]) {
        break;
      }
    }

    result.push(filesArr);
    for (let i = c; i < tempResult.length; i++) {
      result.push(tempResult[i]);
    }

    return result;
  }
}
