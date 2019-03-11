import { NgModule } from '@angular/core';



import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
    // return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
    ],
    exports: [
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class TranslaterModule { }
