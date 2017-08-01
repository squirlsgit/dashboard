System.register(['@angular/core', '@angular/platform-browser', "@angular/platform-browser-dynamic", '@angular/forms', '@angular/http', 'rxjs/add/operator/map', '@angular/router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, platform_browser_1, platform_browser_dynamic_1, forms_1, http_1, core_2, router_1;
    var ScriptStore, ScriptService, record, dashboard, PageNotFoundComponent, appRoutes, hub, ViewAppModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            exports_1("ScriptStore", ScriptStore = [
                { name: 'webrtcadapter', src: 'https://webrtc.github.io/adapter/adapter-latest.js' },
                { name: 'mediarecorder', src: 'js/main.js' }
            ]);
            ScriptService = (function () {
                function ScriptService() {
                    var _this = this;
                    this.scripts = {};
                    ScriptStore.forEach(function (script) {
                        _this.scripts[script.name] = {
                            loaded: false,
                            src: script.src
                        };
                    });
                }
                ScriptService.prototype.load = function () {
                    var _this = this;
                    var scripts = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        scripts[_i - 0] = arguments[_i];
                    }
                    var index = 0;
                    var promises = [];
                    scripts.forEach(function (script) { index++, promises.push(_this.loadScript(script, true, index)); });
                    return Promise.all(promises);
                };
                ScriptService.prototype.loadScript = function (name, attempt, index) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        //resolve if already loaded
                        if (_this.scripts[name].loaded) {
                            resolve({ script: name, loaded: true, status: 'Already Loaded' });
                            var scriptelement = document.getElementById('mainjs' + index);
                            scriptelement.parentNode.removeChild(scriptelement);
                            console.log('script removed for ' + index);
                            var attempt = false;
                        }
                        //load script
                        console.log('adding script for ' + index);
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = _this.scripts[name].src;
                        script.id = "mainjs" + index;
                        if (script.readyState) {
                            script.onreadystatechange = function () {
                                if (script.readyState === "loaded" || script.readyState === "complete") {
                                    script.onreadystatechange = null;
                                    _this.scripts[name].loaded = true;
                                    resolve({ script: name, loaded: true, status: 'Loaded' });
                                    attempt = false;
                                }
                            };
                        }
                        else {
                            script.onload = function () {
                                _this.scripts[name].loaded = true;
                                resolve({ script: name, loaded: true, status: 'Loaded' });
                            };
                        }
                        script.onerror = function (error) { return resolve({ script: name, loaded: false, status: 'Loaded' }); };
                        document.getElementsByTagName('head')[0].appendChild(script);
                    });
                };
                ScriptService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ScriptService);
                return ScriptService;
            }());
            exports_1("ScriptService", ScriptService);
            record = (function () {
                function record(http, script, vcRef, router) {
                    this.http = http;
                    this.script = script;
                    this.vcRef = vcRef;
                    this.router = router;
                    this.refresh_switch = true;
                    this.status = 'record';
                }
                record.prototype.ngOnInit = function () {
                    this.vcRef.clear();
                    this.vcRef.createEmbeddedView(this.displayRecord);
                    this.script.load('mediarecorder', 'webrtcadapter').then(function (data) { console.log('script loaded ', data); }).catch(function (error) { return console.log(error); });
                };
                record.prototype.display = function () {
                    if (this.status === "record") {
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayRecord);
                        this.refresh_switch = false;
                        console.log(this.refresh_switch);
                        this.refresh_switch = true;
                        console.log(this.refresh_switch);
                    }
                    else if (this.status === "send") {
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displaySend);
                    }
                };
                record.prototype.toRecord = function () {
                    this.status = "record";
                    this.display();
                    this.script.load('mediarecorder', 'webrtcadapter').then(function (data) { console.log('script loaded ', data); }).catch(function (error) { return console.log(error); });
                };
                record.prototype.logout = function () {
                    console.log('logging out');
                    this.http.get('server/reset.php').map(function (res) { return res.text(); }).subscribe(function (data) {
                        console.log(data);
                        window.location.href = "login.html";
                    });
                };
                record.prototype.toHome = function () {
                    this.router.navigate(['/dashboard']);
                };
                record.prototype.toggleselect = function (domElement) {
                    if (domElement.classList.contains('btn-primary')) {
                        domElement.classList.remove('btn-primary');
                        domElement.classList.add('btn-danger');
                    }
                    else if (domElement.classList.contains('btn-danger')) {
                        domElement.classList.remove('btn-danger');
                        domElement.classList.add('btn-primary');
                    }
                };
                __decorate([
                    core_1.ViewChild('record'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], record.prototype, "displayRecord", void 0);
                __decorate([
                    core_1.ViewChild('send'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], record.prototype, "displaySend", void 0);
                record = __decorate([
                    core_1.Component({
                        providers: [ScriptService],
                        selector: 'record',
                        template: "\n <template #record>\n  <div class = \"container\" id='container'>\n <button class = \"btn btn-primary\" id='exit' (click)=\"toHome()\" >Exit</button>\n    <h1 class = \"text-center\">powered by fidiyo</h1>\n    <video class = \"center-block\"   id='gum' autoplay ></video>\n    <video class = \"center-block\" style=\"display:none;\" id='recorded'   ></video>\n    <canvas class = \"center-block\"  style=\"display:none;\" id='canvas'></canvas>\n    <img class = \"center-block\"  style=\"display:none;\" id = 'captured' src ='' >\n    <progress id=\"videostream\" hidden></progress>\n<div style=\"margin-top:1%; min-margin-top:10px;\">\n<div class = \"nav navbar-inverse\" style=\"border-radius:3px; postion: relative;\">\n\n  <div class=\"btn-group \" style=\"max-margin-left:5px; margin-left:1em;\">\n      <button #recordButton (click) = \"toggleselect(recordButton)\" class = \"btn btn-primary navbar-btn\" id='record' disabled><span class=\"glyphicon glyphicon-facetime-video\"></span> Start Recording</button>\n      <button class = \"btn btn-primary navbar-btn\" id='capture' disabled><span class=\"glyphicon glyphicon-camera\"></span> Take a Picture</button>\n  </div>\n  <div class=\"btn-group mx-auto\" style=\"position:absolute;\n    left: 50%;\n    transform: translateX(-50%);\">\n  <button #playButton class = \"btn btn-primary navbar-btn\" id='play' disabled><span class=\"glyphicon glyphicon-play-circle\"></span> Play</button>\n  <button #flipButton class = \"btn btn-primary navbar-btn\" id='flip'> <span class=\"glyphicon glyphicon-refresh\"></span> </button>\n  <button #pauseButton class = \"btn btn-primary navbar-btn\" id='pause' disabled><span class=\"glyphicon glyphicon-pause\"></span> Pause</button>\n</div>\n      <div class = \"btn-group pull-right\"  style=\"max-margin-right:5px; margin-right:1em;\">\n      <button  class = \"btn btn-primary navbar-btn\" id='download' disabled><span class=\"glyphicon glyphicon-download-alt\"></span> Save Video</button>\n      <button  class = \"btn btn-primary navbar-btn \" id='saveimg' disabled><span class=\"glyphicon glyphicon-download-alt\"></span> Save Image</button>\n      <button  class = \"btn btn-primary navbar-btn\" id='send' disabled><span class=\"glyphicon glyphicon-upload\"></span> Send file</button>\n      </div>\n      </div>\n    </div>\n    </div>\n </template>\n\n <template #send>\n </template>\n"
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, ScriptService, core_1.ViewContainerRef, router_1.Router])
                ], record);
                return record;
            }());
            exports_1("record", record);
            dashboard = (function () {
                function dashboard(http, vcRef, router) {
                    this.http = http;
                    this.vcRef = vcRef;
                    this.router = router;
                    this.hassubmitted = false;
                    this.refresh_switch = true;
                    this.videos = [];
                    this.videostoSend = [];
                    this.profilepic = document.querySelector('view').getAttribute('profilepic'); //will not take information from the templated page unless forced.
                }
                dashboard.prototype.ngOnInit = function () {
                    this.vcRef.clear();
                    this.vcRef.createEmbeddedView(this.displayHome);
                };
                dashboard.prototype.startRecording = function () {
                    this.router.navigate(['/record']);
                };
                dashboard.prototype.sendVideos = function () {
                    var _this = this;
                    this.videos.forEach(function (video) {
                        if (video.isSelect) {
                            console.log(video);
                            _this.videostoSend.push(video);
                        }
                    });
                    //httprequest with json, that sends the video_toSend array of videos to a dynamic page that can handle the information and
                    alert(this.videostoSend[0].path);
                };
                dashboard.prototype.toggleselect = function (video) {
                    //console.log(video);
                    video.isSelect = !video.isSelect;
                    //   console.log(video);
                    video.isSelect ? video.color = "yellow" : video.color = "";
                    //   console.log(video);
                };
                dashboard.prototype.browseLibrary = function () {
                    var _this = this;
                    this.vcRef.clear();
                    this.vcRef.createEmbeddedView(this.displayLibrary);
                    this.http.request('server/videolibrary.json').subscribe(function (res) { _this.videos = res.json().videos; });
                };
                dashboard.prototype.display = function () {
                    if (this.status === "home") {
                        console.log(this.status);
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayHome);
                        this.hassubmitted = false;
                    }
                    else if (this.status === "send") {
                    }
                    else if (this.status === "library") {
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayLibrary);
                    }
                };
                dashboard.prototype.logout = function () {
                    console.log('logging out');
                    this.http.get('server/reset.php').map(function (res) { return res.text(); }).subscribe(function (data) {
                        console.log(data);
                        window.location.href = "login.html";
                    });
                };
                dashboard.prototype.toHome = function () {
                    this.status = "home";
                    this.display();
                };
                __decorate([
                    core_1.ViewChild('home'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], dashboard.prototype, "displayHome", void 0);
                __decorate([
                    core_1.ViewChild('send'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], dashboard.prototype, "displayRecord", void 0);
                __decorate([
                    core_1.ViewChild('library'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], dashboard.prototype, "displayLibrary", void 0);
                dashboard = __decorate([
                    core_1.Component({
                        selector: 'dashboard',
                        template: "\n<template #library>\n<button (click)=\"toHome()\"> back </button>\n<table>\n  <tr *ngFor=\"let video of videos\"  >\n    <button (click)=\"toggleselect(video)\" [style.background-color] = \"video.color\" ><td >Video: {{ video.url }}</td> <td> {{ video.path }} </td> <td> {{video.time}}</td></button>\n  </tr>\n</table>\n<button (click)=\"sendVideos()\">send</button>\n</template>\n<!-- Home Screen Record Browse Admin -->\n<template #home>\n<img [src] = \"profilepic\" height = \"190\" width = \"250\" class = \"center-block img-rounded\">\n<p class = \"  text-center\"><span class=\"glyphicon glyphicon-envelope\"></span> Send an existing file. </p>\n<p class = \" text-center\"><span class=\" \tglyphicon glyphicon-camera\"></span> Take a video/picture</p>\n<div class = \"fluid-container\" style = \" position: absolute; bottom:0px; width: 100%;\">\n<div class = \"nav navbar-inverse container\">\n<ul class = \"nav navbar-nav\"><li><a id = \"Browse\" (click) = \"browseLibrary()\" style=\"cursor: pointer;\">\n<span class=\"glyphicon glyphicon-envelope\"></span> Send Video</a></li></ul> <!--Browse Video Library -->\n<ul class = \"nav navbar-nav pull-right\"><li><a id = \"Record\" (click) = \"startRecording()\" style=\"cursor: pointer;\"> <span class=\" \tglyphicon glyphicon-camera\"></span> Record</a></li>\n</ul>\n</div>\n</div>\n</template>\n\n<template #send>\n</template>\n "
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, core_1.ViewContainerRef, router_1.Router])
                ], dashboard);
                return dashboard;
            }());
            exports_1("dashboard", dashboard);
            PageNotFoundComponent = (function () {
                function PageNotFoundComponent() {
                }
                PageNotFoundComponent = __decorate([
                    core_1.Component({
                        template: '<h2>Page not found</h2>'
                    }), 
                    __metadata('design:paramtypes', [])
                ], PageNotFoundComponent);
                return PageNotFoundComponent;
            }());
            exports_1("PageNotFoundComponent", PageNotFoundComponent);
            appRoutes = [
                { path: 'dashboard', component: dashboard },
                { path: 'record', component: record },
                { path: '**', component: PageNotFoundComponent }
            ];
            hub = (function () {
                function hub() {
                }
                hub.prototype.ngOnInit = function () {
                };
                hub = __decorate([
                    core_1.Component({
                        selector: 'view',
                        template: "<!--<dashboard></dashboard>\n <record></record>-->\n\n <router-outlet ></router-outlet>\n "
                    }), 
                    __metadata('design:paramtypes', [])
                ], hub);
                return hub;
            }());
            exports_1("hub", hub);
            ViewAppModule = (function () {
                function ViewAppModule() {
                }
                ViewAppModule = __decorate([
                    core_1.NgModule({
                        declarations: [hub, dashboard, record, PageNotFoundComponent,
                        ],
                        imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, http_1.HttpModule, router_1.RouterModule.forRoot(appRoutes, { enableTracing: true } // <-- debugging purposes only
                            )],
                        bootstrap: [hub,],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ViewAppModule);
                return ViewAppModule;
            }());
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ViewAppModule);
        }
    }
});
//# sourceMappingURL=main.js.map