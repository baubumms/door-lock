const SerialPort = require('serialport');

SerialPort.list()
.then((obj)=>{ 
    console.log(obj);
    var path = undefined;
    obj.forEach((e) => {
        if(e.vendorId.toUpperCase() === "1A86")
            path = e.path;
    })
    console.log("Matching Path: " + path);
});