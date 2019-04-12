import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { ToolsComponent } from './tools/tools.component';
import { DirectionGridComponent } from './direction-grid/direction-grid.component';
import { WordService } from './shared/services/word.service';
import { ToolsService } from './shared/services/tools.service';
import { NotificationsService } from './shared/services/notifications.service';
import { FirebaseService } from './shared/services/firebase.service';
import { HttpModule } from '@angular/http';
import { SeasonsComponent } from './seasons/seasons.component';
import { AppRouting } from './app-routing.module';
import { DesignerComponent } from './designer/designer.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ToolsComponent,
    DirectionGridComponent,
    SeasonsComponent,
    DesignerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRouting
  ],
  providers: [WordService, ToolsService, NotificationsService, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
