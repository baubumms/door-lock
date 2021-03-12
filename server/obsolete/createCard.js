const { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B} = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const pretty = require('pretty-logger')();
const generateCard = require('./util/generateCard');
const db = require('./util/db');

const ownerId = process.argv[2];
pretty.info("Creating Card for OwnerId: ", ownerId);

async function onCardHandler(reader, card){
    // MIFARE Classic is ISO/IEC 14443-3 tag
		// skip other standards

		if (card.type !== TAG_ISO_14443_3) {
			return;
		}

		pretty.info(`ISO_14443_3 card detected`, card);

        var data = generateCard({ownerId});
        data.cardUid = card.uid;
        pretty.info("Card UID: " + card.uid);

        const factoryKey = 'FFFFFFFFFFFF'; 
		const keyType = KEY_TYPE_A;
		try {

            //auth
            await reader.authenticate(0, keyType, factoryKey);
            pretty.info("Sector 0 authenticated");

            //fetching manufacturer block and adding it to the db
            const manufacturerBlock = await reader.read(0, 16, 16);
            data.sectors[0].blocks[0] = [...manufacturerBlock];

            //write all the other sectors according to db model
            for(var sector = 1; sector < 16; sector++){
                await reader.authenticate(sector * 4, keyType, factoryKey);

                for(var b = 0; b < 4; b++){
                    var block = sector * 4 + b;

                    await reader.write(block, data.sectors[sector].blocks[b], 16);
                }

                pretty.info(`Sector ${sector} successfully written`);
            }

            db.get('cards')
            .push(data)
            .write();

		} catch (err) {
			pretty.error(`error`, err);
		}
}

nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

    reader.on('card', (card) => onCardHandler(reader, card));


});

nfc.on('error', err => {
	console.log('an error occurred', err);
});