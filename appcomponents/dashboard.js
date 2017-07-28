System.register(['@angular/core', '@angular/http', 'rxjs/add/operator/map'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var dashboard;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            dashboard = (function () {
                function dashboard(http, vcRef) {
                    this.http = http;
                    this.vcRef = vcRef;
                    this.hassubmitted = false;
                    this.refresh_switch = true;
                    this.videos = [];
                    this.videostoSend = [];
                }
                dashboard.prototype.ngOnInit = function () {
                    this.vcRef.clear();
                    this.vcRef.createEmbeddedView(this.displayHome);
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
                    else if (this.status === "record") {
                        this.vcRef.clear();
                        this.vcRef.createEmbeddedView(this.displayRecord);
                        this.refresh_switch = false;
                        console.log(this.refresh_switch);
                        this.refresh_switch = true;
                        console.log(this.refresh_switch);
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
                        template: "\n<template #library>\n<button (click)=\"toHome()\"> back </button>\n<table>\n  <tr *ngFor=\"let video of videos\"  >\n    <button (click)=\"toggleselect(video)\" [style.background-color] = \"video.color\" ><td >Video: {{ video.url }}</td> <td> {{ video.path }} </td> <td> {{video.time}}</td></button>\n  </tr>\n</table>\n<button (click)=\"sendVideos()\">send</button>\n</template>\n<!-- Home Screen Record Browse Admin -->\n<template #home>\n<button id = \"Browse\" (click) = \"browseLibrary()\">Browse Video Library</button>\n<button id = \"Record\" (click) = \"startRecording()\">Record</button>\n<button id = \"Reset\" (click)=\"logout()\">Logout</button>\n</template>\n\n<template #send>\n</template>\n "
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, core_1.ViewContainerRef])
                ], dashboard);
                return dashboard;
            }());
            exports_1("dashboard", dashboard);
        }
    }
});
//# sourceMappingURL=dashboard.js.map