import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import {AuthService} from './services/auth.service';

import { WebViewExtModule } from "@nota/nativescript-webview-ext/angular";
import { HttpClientModule } from '@angular/common/http';
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
		AppRoutingModule,
		HttpClientModule,
		WebViewExtModule,
		NativeScriptUISideDrawerModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
		HomeComponent
    ],
    providers: [AuthService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
