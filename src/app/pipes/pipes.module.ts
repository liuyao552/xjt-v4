import { NgModule } from '@angular/core';
import { StatusPipe } from './status/status';
import { FilterDataPipe } from './filter-data/filter-data';
import { FaildTextPipe } from './faild-text/faild-text';
import { NavbarPipe } from './navbar/navbar';
@NgModule({
declarations: [StatusPipe, FilterDataPipe, FaildTextPipe,
    NavbarPipe],
imports: [],
exports: [StatusPipe, FilterDataPipe, FaildTextPipe,
    NavbarPipe]
})
export class PipesModule {}
