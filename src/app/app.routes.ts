import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { Cs2tsComponent } from './cs2ts/cs2ts.component';
import { HomeComponent } from './home/home.component';
import { Md2htmlComponent } from './md2html/md2html.component';
import { SerializedToolComponent } from './serialized-tool/serialized-tool.component';

export const routes: Routes = [
    { path: '', title: "CodeChef", component: HomeComponent },
    { path: 'cs2ts', title: "C# to TS • CodeChef", component: Cs2tsComponent },
    { path: 'md2html', title: "MD to HTML • CodeChef", component: Md2htmlComponent },
    { path: 'serialized', title: "Serialized Tool • CodeChef", component: SerializedToolComponent },

    { path: '**', title: "Not Found • CodeChef", component: NotFoundComponent },
];
