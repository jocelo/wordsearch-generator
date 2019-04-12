import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SeasonsComponent } from "./seasons/seasons.component";
import { DesignerComponent } from "./designer/designer.component";

const routes: Routes = [
	{ path: 'categories', component: SeasonsComponent },
	{ path: 'designer/:season/:episode', component: DesignerComponent },
	//{ path: 'designer', pathMatch: 'full', redirectTo: '/categories' },
	{ path: '', pathMatch: 'full', redirectTo: '/categories' }
]

@NgModule({
	imports:[RouterModule.forRoot(routes)],
	exports:[RouterModule]
})

export class AppRouting {}