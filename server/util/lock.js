const SerialPort = require('serialport');
const pretty = require('pretty-logger')();

const BAUD_RATE = 115200;
const CODES = {//ASCII char code to 
    open: 0x31,
    closed: 0x30,
}

class Lock{
    constructor(){
        this.state = false;

        this.path = undefined;
        this.port = null;
        SerialPort.list()
        .then((ports)=>{this.initSerialPort(ports)});
    }

    initSerialPort(ports){
        try{
            ports.forEach((elem) => {
                if(elem.vendorId && elem.vendorId.toUpperCase() === "1A86")
                    this.path = elem.path;
            });
            if(!this.path){
                throw(new Error("01: Serial Bridge to Lock not attached!"));
                return;
            }   
    
            pretty.info("Found Serial Lock Bridge on " + this.path);
                
            
            this.port = new SerialPort(this.path, {
                baudRate: BAUD_RATE,
                databits: 8,
                parity: 'none'
            });
    
            this.port.on('data', (msg) => this.onSerialInput(msg));
            this.port.on('error', (error) => pretty.error("Serial Port onError: ",error));
        }catch(error){
            pretty.error("Serial bridge to lock not available", error);
        }
        
    }

    onSerialInput(msg){
        try{
            pretty.info("msg:", msg)
            if(!msg)
                return;
            switch(msg[0]){
                case CODES.open:
                    this.setState(true);
                    break;
                case CODES.closed:
                    this.setState(false);
                    break;
                default:
                    throw("Serial response not in code list!");
            }
        }catch(error){
            pretty.error("Error: onSerialInput", error);
        }
    }

    serialPrint(msg){
        try{
            if(!this.port){
                throw(new Error("02: Serial Bridge to Lock not attached!"));
                return;
            }  
            this.port.write(msg);
        }catch(error){
            pretty.error("Error in serialPrint: ", error);
        }
        
    }

    setState(state){
        this.state = state;
        pretty.info("Lock status: ", state);
    }

    open(){
        this.serialPrint("open");
    }

    close(){
        this.serialPrint("close");
    }

    toggle(){
        this.serialPrint("toggle");
    }
}

// var lock = new Lock();
// setTimeout(() => lock.open(), 1000);

module.exports = new Lock();