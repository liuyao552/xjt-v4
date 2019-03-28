import { BatteryComponent } from './battery/battery.component';
import { NgModule } from '@angular/core';
import { PhotoComponent } from './photo/photo.component';
import { IonicModule } from '@ionic/angular';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { ToTopComponent } from './to-top/to-top.component';
import { DragComponent } from './drag/drag.component';
// import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [
        PhotoComponent,
        StatusBarComponent,
        BatteryComponent,
        ToTopComponent,
        DragComponent
    ],
    imports: [IonicModule, ], // PipesModule
    exports: [
        PhotoComponent,
        StatusBarComponent,
        BatteryComponent,
        ToTopComponent,
        DragComponent]
})
export class ComponentsModule { }
