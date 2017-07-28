import {
Component, NgModule,TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl }   from '@angular/forms';
import { Response, Http, HttpModule, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';



@Component({
 selector: 'dashboard',
 template: `
<template #library>
<button (click)="toHome()"> back </button>
<table>
  <tr *ngFor="let video of videos"  >
    <button (click)="toggleselect(video)" [style.background-color] = "video.color" ><td >Video: {{ video.url }}</td> <td> {{ video.path }} </td> <td> {{video.time}}</td></button>
  </tr>
</table>
<button (click)="sendVideos()">send</button>
</template>
<!-- Home Screen Record Browse Admin -->
<template #home>
<button id = "Browse" (click) = "browseLibrary()">Browse Video Library</button>
<button id = "Record" (click) = "startRecording()">Record</button>
<button id = "Reset" (click)="logout()">Logout</button>
</template>

<template #send>
</template>
 `
 })
 export class dashboard {
   @ViewChild('home') displayHome: TemplateRef<any>;
   @ViewChild('send') displayRecord: TemplateRef<any>;
   @ViewChild('library') displayLibrary: TemplateRef<any>;
   status: string;
   hassubmitted: boolean = false;
   stringResponse: string;
   videos: Array<any>;
   videostoSend: Array<any>;
   refresh_switch: boolean;
   constructor( public http: Http, private vcRef: ViewContainerRef) {
     this.refresh_switch = true;
     this.videos = [];
     this.videostoSend = [];
   }
   ngOnInit(){
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.displayHome);
   }
   sendVideos(){
     this.videos.forEach(video => {
       if(video.isSelect){console.log(video);  this.videostoSend.push(video);}
     });
     //httprequest with json, that sends the video_toSend array of videos to a dynamic page that can handle the information and
     alert(this.videostoSend[0].path);
   }
    toggleselect(video: any){
     //console.log(video);
     video.isSelect = !video.isSelect;
    //   console.log(video);
     video.isSelect? video.color = "yellow": video.color = ""
    //   console.log(video);
   }

browseLibrary(){
  this.vcRef.clear();
  this.vcRef.createEmbeddedView(this.displayLibrary);
  this.http.request('server/videolibrary.json').subscribe((res: Response) => {this.videos = res.json().videos});
}

display() {
    if (this.status === "home" ){console.log(this.status);
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayHome);
       this.hassubmitted = false;
     }
     else if (this.status === "record"){
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayRecord);
       this.refresh_switch = false;
       console.log(this.refresh_switch);
       this.refresh_switch = true;
       console.log(this.refresh_switch);
     }
     else if (this.status === "library"){
       this.vcRef.clear();
       this.vcRef.createEmbeddedView(this.displayLibrary);
     }
   }
   logout() { //PLUG:: resets session information
     console.log('logging out');
     this.http.get('server/reset.php').map((res: Response) => res.text()).subscribe(data => {
       console.log(data)
       window.location.href = "login.html";
     });
   }
  toHome(){
    this.status = "home";
    this.display();
    }
 }
