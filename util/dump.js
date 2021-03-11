const { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B} = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const prettyLogger = require('pretty-logger');
const pretty = new prettyLogger();

const nSectors = 16;
const nBlocks = 4;

nfc.on('reader', reader => {
	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', card => {
		console.log(`${reader.reader.name}  card detected`, card);
	});

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

    reader.on('card', async card => {

		// MIFARE Classic is ISO/IEC 14443-3 tag
		// skip other standards

		if (card.type !== TAG_ISO_14443_3) {
			return;
		}

		var dump = new Array(nSectors);

		pretty.info(`card detected`, card);
        const key = 'FFFFFFFFFFFF'; 
		const keyType = KEY_TYPE_A;
		try {

            for(var sector = 0; sector < nSectors; sector++){
                await reader.authenticate(sector * 4, keyType, key);
                // pretty.info(`sector ${sector}`)

				sectorDump = new Array(nBlocks);
				dump[sector] = sectorDump;
                for(var b = 0; b < 4; b++){
                    var block = sector * 4 + b;
                    const data = await reader.read(block, 16, 16); // blockSize=16 must specified for MIFARE Classic cards
					sectorDump[b] = data;
                    // pretty.info(`Block ${block}`, data);
                    const payload = data.readInt32BE(0);
                }
            }

			pretty.info("dump", dump);

		} catch (err) {
			pretty.error(`error`, reader, err);
		}

	});
});

nfc.on('error', err => {
	console.log('an error occurred', err);
});