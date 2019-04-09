import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { ToolsComponent } from './tools/tools.component';
import { DirectionGridComponent } from './direction-grid/direction-grid.component';
import { WordService } from './shared/services/word.service';
import { ToolsService } from './shared/services/tools.service';
import { NotificationsService } from './shared/services/notifications.service';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ToolsComponent,
    DirectionGridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WordService, ToolsService, NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
