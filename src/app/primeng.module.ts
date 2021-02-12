import { NgModule } from '@angular/core';
import {RatingModule} from 'primeng/rating';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {CheckboxModule} from 'primeng/checkbox';


@NgModule({
  imports: [
    RatingModule,
    BreadcrumbModule
  ],
  exports: [
    RatingModule,
    BreadcrumbModule
  ]
})

export class PrimengModule {}
