import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { Cs2tsComponent } from './cs2ts/cs2ts.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: "home", pathMatch: "full" },

    { path: 'home', title: "CodeChef", component: HomeComponent },
    { path: 'cs2ts', title: "C# 2 TS • CodeChef", component: Cs2tsComponent },

    { path: '**', title: "Not Found • CodeChef", component: NotFoundComponent },
];
