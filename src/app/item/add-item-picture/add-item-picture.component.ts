import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../item';
import {FormControl} from '@angular/forms';
import {ItemService} from '../item.service';

@Component({
  selector: 'app-add-item-picture',
  templateUrl: './add-item-picture.component.html',
  styleUrls: ['./add-item-picture.component.css']
})
export class AddItemPictureComponent implements OnInit {

  @Input()
  item: Item;

  fileToUpload: File = null;

  showPicture = false;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
  }

  handleFileInput(e): void {
    this.fileToUpload = (e.target as HTMLInputElement).files[0];
  }

  upload(): void {
    const formData = new FormData();
    formData.append('picture', this.fileToUpload);

    this.itemService.uploadItemPicture(this.item._id, formData).subscribe({
      next: data => {
        console.log(data);
        this.showPicture = true;
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
