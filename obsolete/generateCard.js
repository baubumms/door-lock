const { randomBuffer } = require('./util');

const nSectors = 16;
const nBlocks = 4;

const accessBytes = [0xFF, 0x0F, 0x00];

module.exports = function generateCard ({ ownerId }){
    var card = {
        ownerId,
        manufacturerBlock: new Buffer.allocUnsafe(16),
        sectors: generateCardContent(),
    }

    return card;
}

function generateCardContent(){
    var sectors = new Array(nSectors);
    var blocks = new Array(nBlocks);

    //special treatment for the first sector
    sectors[0] = blocks;
    for(var b = 1; b < nBlocks - 1; b++){//not including manufacturer and trailer block
        blocks[b] = randomBuffer(16);
    }

    const trailer = generateTrailer();
    blocks[3] = trailer.data;

    sectors[0] = {
        blocks,
        keyA: trailer.keyA,
        keyB: trailer.keyB,
        accessBytes: trailer.accessBytes,
    };

    //all the other sectors
    for(var s = 1; s < nSectors; s++){
        var blocks = new Array(nBlocks);

        for(var b = 0; b < nBlocks - 1; b++)//not including the trailer block
            blocks[b] = randomBuffer(16);
        
        const trailer = generateTrailer();
        blocks[3] = trailer.data;

        sectors[s] = {
            blocks,
            keyA: trailer.keyA,
            keyB: trailer.keyB,
            accessBytes: trailer.accessBytes,
        };
    } 

    return sectors;
}

function generateTrailer(){
    var trailer = Buffer.allocUnsafe(16);

    const keyA = randomBuffer(6);
    const keyB = randomBuffer(6);
    const unusedByte = 0xAB;

    for(var i = 0; i < 6; i++)
        trailer[i] = keyA[i];

    for(var i = 0; i < 3; i++)
        trailer[i + 6] = accessBytes[i];

    trailer[9] = unusedByte;

    for(var i = 0; i < 6; i++)
        trailer[i + 10] = keyB[i];

    return {
        data: trailer,
        keyA: keyA,
        keyB: keyB,
        accessBytes
    };
}