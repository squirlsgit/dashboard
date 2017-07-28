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
    var core_1, http_1, core_2;
    var ScriptStore, ScriptService, record;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
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
                function record(http, script, vcRef) {
                    this.http = http;
                    this.script = script;
                    this.vcRef = vcRef;
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
                        template: "\n <template #record>\n <div id = \"dashboard\" *ngIf = 'refresh_switch'>\n <button id='exit' (click)=\"toHome()\" >Exit</button>\n  <div id='main' align='center' >\n  <div id='container'>\n    <h1>powered by fidiyo</h1>\n    <video muted id='gum' autoplay hidden></video>\n    <video  id='recorded' autoplay loop hidden></video>\n    <canvas id='canvas' style='display:none;'></canvas>\n    <img id = 'captured' src =''>\n    <div>\n      <button id='record' disabled>Start Recording</button>\n      <button id='capture' disabled>Take a Picture</button>\n      <button id='play' disabled>Review</button>\n      <button id='download' disabled>Save file</button>\n      <button id='saveimg' disabled>Save Image</button>\n      <button id='send' disabled>Send file</button>\n    </div>\n  </div>\n  </div>\n  </div>\n </template>\n\n <template #send>\n </template>\n"
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, ScriptService, core_1.ViewContainerRef])
                ], record);
                return record;
            }());
            exports_1("record", record);
        }
    }
});
//# sourceMappingURL=record.js.map