import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { Cs2tsComponent } from './cs2ts/cs2ts.component';
import { HomeComponent } from './home/home.component';
import { MssqlScaffoldComponent } from './mssql-scaffolder/mssql-scaffolder.component';

export const routes: Routes = [
    { path: '', redirectTo: "home", pathMatch: "full" },

    { path: 'home', title: "Home • CodeChef", component: HomeComponent },
    { path: 'cs2ts', title: "C# to TS • CodeChef", component: Cs2tsComponent },
    { path: 'mssqlscaffold', title: "MSSQL Scaffolder • CodeChef", component: MssqlScaffoldComponent },

    { path: '**', title: "Not Found • CodeChef", component: NotFoundComponent },
];
