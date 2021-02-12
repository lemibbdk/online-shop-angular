import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../item.service';
import {ActivatedRoute} from '@angular/router';
import {Item} from '../item';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  itemForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]),
    discount: new FormControl('', [
      Validators.required,
    ]),
    category: new FormControl('', [
      Validators.required,
    ]),
    subCategory: new FormControl('', [
      Validators.required,
    ]),
    shortDescription: new FormControl('', [
      Validators.required,
    ]),
    remaining: new FormControl('', [
      Validators.required,
    ]),
    seller: new FormControl('', [
      Validators.required,
    ]),
    countryOrigin: new FormControl('', [
      Validators.required,
    ]),
    locatedIn: new FormControl('', [
      Validators.required,
    ]),
    properties: new FormArray([])
  });

  get locatedIn(): any { return this.itemForm.get('locatedIn'); }

  cities = ['Belgrade', 'Novi Sad', 'Nis', 'Kragujevac', 'Leskovac', 'Subotica', 'Cacak'];

  itemUploaded = false;

  itemId: string;

  item: Item;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private itemService: ItemService) {
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.itemService.readItem(this.itemId).subscribe({
        next: data => {
          console.log(data);
          Object.keys(data).forEach(name => {
            if (this.itemForm.controls[name]) {
              this.itemForm.controls[name].patchValue(data[name]);
            }
          });

          data.properties.forEach(el => {
            this.t.push(this.fb.group({
              property: [el.property, [Validators.required]],
              value: [el.value, [Validators.required]]
            }));
          });

          console.log(this.itemForm.value);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  get f(): any { return this.itemForm.controls; }
  get t(): any { return this.f.properties as FormArray; }
  get propertiesFormGroups(): FormGroup[] { return this.t.controls as FormGroup[]; }

  addProperty(e): void {
    this.t.push(this.fb.group({
      property: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeProperty(i): void {
    this.t.removeAt(i);
  }


  onSubmit(): void {
    if (this.itemId) {
      this.itemService.updateItem(this.itemId, this.itemForm.value).subscribe({
        next: data => {
          console.log(data);
          this.itemUploaded = true;
          this.item = data;
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      this.itemService.createItem(this.itemForm.value).subscribe({
        next: data => {
          console.log(data);
          this.itemUploaded = true;
          this.item = data;
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }
}
