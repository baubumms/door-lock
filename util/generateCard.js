const { randomBuffer } = require('./util');

const nSectors = 16;
const nBlocks = 4;

exports = function generateCard ({ ownerId }){
    

    var card = {
        ownerId,

    }
}

function generateCardContent(){
    var sectors = new Array(nSectors);
    var blocks = new Array(nBlocks);
    sectors[1] = blocks;
    for(var b = 1; b < nBlocks - 1; b++){//not including manufacturer and trailer block
        blocks[b] = randomBuffer(16);
    }

    for(var s = 1; s < nSectors; s++){
        var blocks = new Array(nBlocks);
        sectors[s] = blocks;
        for(var b = 0; b < nBlocks - 1; b++)//not including the trailer block
            blocks[b] = randomBuffer(16);
    } 
}

function generateTrailer(){

}