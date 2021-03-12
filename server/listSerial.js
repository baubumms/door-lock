const SerialPort = require('serialport');

SerialPort.list()
.then((obj)=>{
    var path = undefined;
    obj.forEach((e) => {
        if(e.serialNumber === "5&7993a9c&0&2")
            path = e.path;
    })
    console.log(path);
});