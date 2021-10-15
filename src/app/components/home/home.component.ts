import { Component, OnInit, NgZone, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { firestore } from "nativescript-plugin-firebase";
import {Router} from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import { Page } from "tns-core-modules/ui/page";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

const firebase = require("nativescript-plugin-firebase");

@Component({
	selector: 'ns-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

	constructor(private _changeDetectionRef: ChangeDetectorRef, private page:Page,private auth: AuthService,private router: Router, private routerExtensions: RouterExtensions, private zone: NgZone) {
		page.backgroundImage = '~/app/images/bg3.jpg';
		page.addCss("page{background-size: cover;background-repeat: no-repeat;background-position: center top;}");
	}

	@ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
	private drawer: RadSideDrawer;
	
	ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
	}
	
	public MenuOpen() {
		this.drawer.showDrawer();
	}

	ngOnInit() {
		
	}
}
