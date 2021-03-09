const { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B} = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const prettyLogger = require('pretty-logger');
const pretty = new prettyLogger();
const { randomBuffer } = require('./util');

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

		pretty.info(`card detected`, card);
        const key = 'FFFFFFFFFFFF'; 
		const keyType = KEY_TYPE_A;
		try {

            for(var sektor = 1; sektor < 16; sektor++){
                await reader.authenticate(sektor * 4, keyType, key);
			    pretty.info(`sector ${sektor} successfully authenticated`);

                for(var b = 0; b < 3; b++){
                    var block = sektor * 4 + b;
                    const data = await reader.read(block, 16, 16); // blockSize=16 must specified for MIFARE Classic cards
                    pretty.info(`data read`, data);
                    const payload = data.readInt32BE(0);
                    pretty.info(`data converted`, payload);

                    var random = randomBuffer(16);
                    await reader.write(block, random, 16); // blockSize=16 must specified for MIFARE Classic cards
                    pretty.info(`data written`,  random);
                }
            }

		} catch (err) {
			pretty.error(`error`, reader, err);
		}


	});


});

nfc.on('error', err => {
	console.log('an error occurred', err);
});