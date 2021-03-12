const SerialPort = require('serialport');

class Lock{
    constructor(){
        this.path = undefined;
        this.port = null;
        SerialPort.list()
        .then((obj)=>{
            obj.forEach((e) => {
                if(e.serialNumber === "5&7993a9c&0&2")
                    this.path = e.path;
            });
            if(!this.path)
                return;
            
            this.port = new SerialPort(this.path, {
                baudRate: 9600,
                databits: 8,
                parity: 'none'
            });
        });
    }

    open(){
        if(!this.port)
            return;
        this.port.write("open");
    }

    close(){
        if(!this.port)
            return;
        this.port.write("open");
    }
}

var lock = new Lock();
setTimeout(lock.open, 1000);

// module.exports = new Lock();