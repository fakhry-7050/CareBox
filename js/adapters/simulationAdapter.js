import {CONFIG} from '../core/config.js';
export class SimulationAdapter{
 constructor(){this.kind='simulation'} async connect(){return {connected:true,deviceId:CONFIG.deviceId}} async getSnapshot(){return {device:this.state.device,sensors:this.state.sensors,timestamp:new Date().toISOString()}} setState(state){this.state=state}
 async command(key,value){return {key,value,timestamp:new Date().toISOString()}}
}
