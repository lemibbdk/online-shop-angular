import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemPictureComponent } from './add-item-picture.component';

describe('AddItemPictureComponent', () => {
  let component: AddItemPictureComponent;
  let fixture: ComponentFixture<AddItemPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
