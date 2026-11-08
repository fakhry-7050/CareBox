import {CONFIG} from '../core/config.js';
/** REST boundary for a future ESP32 gateway. UI code never reads hardware directly. */
export class ESP32Adapter{
 constructor(baseUrl=CONFIG.apiBaseUrl){this.baseUrl=baseUrl.replace(/\/$/,'');this.kind='esp32'}
 async request(path,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{const r=await fetch(`${this.baseUrl}${path}`,{...options,signal:controller.signal,headers:{'Content-Type':'application/json',...options.headers}});if(!r.ok)throw new Error(`ESP32 HTTP ${r.status}`);return r.status===204?null:r.json()}finally{clearTimeout(timer)}}
 connect(){return this.getDeviceStatus()} getDeviceStatus(){return this.request('/api/device/status')} getSensors(){return this.request('/api/sensors')} getAlerts(){return this.request('/api/alerts')} postEvent(event){return this.request('/api/events',{method:'POST',body:JSON.stringify(event)})} heartbeat(payload){return this.request('/api/device/heartbeat',{method:'POST',body:JSON.stringify(payload)})}
}
