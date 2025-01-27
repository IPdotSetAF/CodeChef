import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { Cs2tsComponent } from './cs2ts/cs2ts.component';
import { HomeComponent } from './home/home.component';
import { Md2htmlComponent } from './md2html/md2html.component';
import { SerializedToolComponent } from './serialized-tool/serialized-tool.component';
import { MssqlScaffolderComponent } from './mssql-scaffolder/mssql-scaffolder.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { FontConverterComponent } from './font-converter/font-converter.component';
import { IdGeneratorComponent } from './id-generator/id-generator.component';

export const routes: Routes = [
    { path: '', title: "CodeChef", component: HomeComponent, data: { header: false } },
    { path: 'cs2ts', title: "C# to TS • CodeChef", component: Cs2tsComponent },
    { path: 'md2html', title: "MD to HTML • CodeChef", component: Md2htmlComponent },
    { path: 'serialized', title: "Serialized Tool • CodeChef", component: SerializedToolComponent },
    { path: 'mssqlscaffold', title: "MSSQL Scaffolder • CodeChef", component: MssqlScaffolderComponent },
    { path: 'fonts', title: "Font Converter • CodeChef", component: FontConverterComponent },
    { path: 'id', title: "ID Generator • CodeChef", component: IdGeneratorComponent },
    { path: 'downloads', title: "Downloads • CodeChef", component: DownloadsComponent },

    { path: '**', title: "Not Found • CodeChef", component: NotFoundComponent },
    { path: '404', title: "Not Found • CodeChef", component: NotFoundComponent },
];
