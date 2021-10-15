import { Component, OnInit, NgZone, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {Router} from "@angular/router";
import { firestore } from "nativescript-plugin-firebase";
import { Observable } from "rxjs";
import { Client } from '../../interfaces/client.model';
import {AuthService} from '../../services/auth.service';
import { WebView } from "tns-core-modules/ui/web-view";
import {LoadEventData,WebViewExt,} from "@nota/nativescript-webview-ext";

const firebase = require("nativescript-plugin-firebase");


@Component({
	selector: 'ns-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
	code: any;
	show_webView: boolean = true;
	client_id = '7b03654c7a99440cb09d913136a1e264';
	client_secret = 'mVyyXilP0dCohsLMrF4OIQFWgXp8UCzX';
	url = 'https://eu.battle.net/oauth/authorize?client_id='+this.client_id+'&redirect_uri=http://elitecms.hu/rest/modules/login/auth/callback&response_type=code&scope=openid'
	webview: WebViewExt;
	
	constructor(private auth: AuthService, private router: Router, private zone: NgZone) { }
	
	ngOnInit() {
		firebase.init({
			onAuthStateChanged: function(data) {
				if (data.loggedIn) {
					
				}
			}
		}).then((instance) => {
			console.log("[*] Firebase was successfully initialised");
		}, (error) => {
			console.log("[*] Huston we've an initialization error: " + error);
		});
	}

	onLoadStarted(args: LoadEventData) {
        const webView = args.object as WebView;

        if (!args.error) {
            /*console.log("Load Start");
            console.log(`EventName: ${args.eventName}`);
            console.log(`NavigationType: ${args.navigationType}`);
            console.log(`Url: ${args.url}`);*/
        } else {
            console.log(`EventName: ${args.eventName}`);
            console.log(`Error: ${args.error}`);
        }
	}

    onLoadFinished(args: LoadEventData) {
		//webView1: WebView = this.webView.nativeElement;
		this.webview = args.object as WebViewExt
		console.log("finished");
        if (!args.error) {
			if(args.url.indexOf("callback?code=") !== -1){
				this.code = args.url.replace("http://elitecms.hu/rest/modules/login/auth/callback?code=","");
				this.show_webView = false;
			}
			let self = this;
			let viewContent = this.webview.executeJavaScript<JSON>("JSON.parse(document.getElementsByTagName('pre')[0].textContent);")
			viewContent.then(function(value) {
				console.log(value['token']);
				firebase.firestore.collection("wowmplus_users").where("btag", "==", value['btag']).get()
				.then(querySnapshot => {
					if(querySnapshot._docSnapshots != ''){
						querySnapshot.forEach(doc => {
							console.log("doc");
							firestore.collection('wowmplus_users').doc(doc.id).get().then((docData) => {
								console.log("exists");
								if (docData.exists) {
									console.log(docData.id);
									let auth = docData.id;
									console.log(auth);
									console.log("exists: "+auth);
									firebase.firestore.collection("wowmplus_users").doc(docData.id).set({
										btag: value['btag'],
										token: value['token']
									});
									self.auth.btag = value['btag'];
									self.router.navigate(["home"]);
								} else {
									console.log("not exits");
									firebase.firestore.collection("wowmplus_users").add({btag: value['btag'], token: value['token']})
									.then((docRef: firestore.DocumentReference) => {
										console.log("added");
										let auth = docRef.id;
										console.log("created: "+auth);
										firebase.firestore.collection("wowmplus_users").doc(docRef.id).set({
											btag: value['btag'],
											token: value['token']
										});
										self.auth.btag = value['btag'];
										self.router.navigate(["home"]);
									})
									.catch(err => console.log("Adding Fido failed, error: " + err));
								}
							}).catch((fail) => {
								console.log('lekerdezes fail: '+fail);
							});
						});
					}
					else{
						firebase.firestore.collection("wowmplus_users").add({btag: value['btag'], token: value['token']})
						.then((docRef: firestore.DocumentReference) => {
							console.log("added");
							let auth = docRef.id;
							console.log("created: "+auth);
							firebase.firestore.collection("wowmplus_users").doc(docRef.id).set({
								btag: value['btag'],
								token: value['token']
							});
							self.router.navigate(["home"]);
						})
						.catch(err => console.log("Adding Fido failed, error: " + err));
					}
				});
			});
        } else {
            console.log(`EventName: ${args.eventName}`);
            console.log(`Error: ${args.error}`);
		}
	}

}
