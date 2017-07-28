import {
Component, NgModule,TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl }   from '@angular/forms';
import { Response, Http, HttpModule, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";

export declare var document: any;
export interface Scripts {
   name: string;
   src: string;
}
export const ScriptStore: Scripts[] = [
   {name: 'webrtcadapter', src: 'https://webrtc.github.io/adapter/adapter-latest.js'},
   {name: 'mediarecorder', src: 'js/main.js'}
];

@Injectable()
export class ScriptService {

public scripts: any = {};

constructor() {
    ScriptStore.forEach((script: any) => {
        this.scripts[script.name] = {
            loaded: false,
            src: script.src
        };
    });
}

 load(...scripts: string[]) {
    var index = 0;
    var promises: any[] = [];
    scripts.forEach((script) => {index++,promises.push(this.loadScript(script,true,index))});
    return Promise.all(promises);
}

loadScript(name: string, attempt: boolean, index: number) {

    return new Promise((resolve, reject) => {
        //resolve if already loaded
        if (this.scripts[name].loaded) {
            resolve({script: name, loaded: true, status: 'Already Loaded'});
            var scriptelement = document.getElementById('mainjs'+index);
            scriptelement.parentNode.removeChild(scriptelement);
            console.log('script removed for ' + index);
            var attempt = false;
        }
            //load script
            console.log('adding script for ' + index);
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].src;
            script.id = "mainjs"+index;
            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true, status: 'Loaded'});
                        attempt = false;
                    }
                };
            } else {  //Others
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                };
            }
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);

    });
}

}

@Component({
  providers: [ScriptService],
 selector: 'record',
 template: `
 <template #record>
 <div id = "dashboard" *ngIf = 'refresh_switch'>
 <button id='exit' (click)="toHome()" >Exit</button>
  <div id='main' align='center' >
  <div id='container'>
    <h1>powered by fidiyo</h1>
    <video muted id='gum' autoplay hidden></video>
    <video  id='recorded' autoplay loop hidden></video>
    <canvas id='canvas' style='display:none;'></canvas>
    <img id = 'captured' src =''>
    <div>
      <button id='record' disabled>Start Recording</button>
      <button id='capture' disabled>Take a Picture</button>
      <button id='play' disabled>Review</button>
      <button id='download' disabled>Save file</button>
      <button id='saveimg' disabled>Save Image</button>
      <button id='send' disabled>Send file</button>
    </div>
  </div>
  </div>
  </div>
 </template>

 <template #send>
 </template>
`
})
export class record {
  @ViewChild('record') displayRecord: TemplateRef<any>;
  @ViewChild('send') displaySend: TemplateRef<any>;
  refresh_switch: boolean;
  status: string;
  constructor( public http: Http, public script: ScriptService, private vcRef: ViewContainerRef) {
    this.refresh_switch = true;
    this.status = 'record';
  }
  ngOnInit(){
   this.vcRef.clear();
   this.vcRef.createEmbeddedView(this.displayRecord);
   this.script.load('mediarecorder', 'webrtcadapter').then(data => {console.log('script loaded ', data);}).catch(error => console.log(error));
  }
  display() {
    if (this.status === "record"){
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.displayRecord);
      this.refresh_switch = false;
      console.log(this.refresh_switch);
      this.refresh_switch = true;
      console.log(this.refresh_switch);
    }
    else if (this.status === "send"){
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.displaySend);
    }
  }
  toRecord(){
    this.status = "record";
    this.display();
    this.script.load('mediarecorder', 'webrtcadapter').then(data => {console.log('script loaded ', data);}).catch(error => console.log(error));
  }
  logout() { //PLUG:: resets session information
    console.log('logging out');
    this.http.get('server/reset.php').map((res: Response) => res.text()).subscribe(data => {
      console.log(data)
      window.location.href = "login.html";
    });
  }
}
