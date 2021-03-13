const { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B} = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const pretty = require('pretty-logger')();
const db = require('./util/db');
const lock = require('./util/lock');
//const util = require('util'); npm module util

async function onCardHandler(reader, card){
    // MIFARE Classic is ISO/IEC 14443-3 tag
		// skip other standards

		if (card.type !== TAG_ISO_14443_3) {
			return;
		}

		pretty.info(`UID: `, card.uid);
		
		var dbCard = db.get("cards")
		.find({cardUid: card.uid})
		.value();

		if(dbCard == undefined){
			pretty.error("card not in db");
			return;
		}

		pretty.info("card owner: ", dbCard.ownerId);

		const keyType = KEY_TYPE_A;
		
		// pretty.info(util.inspect(dbCard.sectors[5], false, null, true /* enable colors */));
		try {
            await reader.authenticate(20, keyType,  dbCard.sectors[5].keyA);
            pretty.info("Sector 5 authenticated");

            var cardBlock21 = await reader.read(21, 16, 16);
			var dbBlock21 = Buffer.from(dbCard.sectors[5].blocks[1])

            if(cardBlock21.compare(dbBlock21) === 0){
				pretty.info("access granted");
				lock.toggle();
			}else{
				pretty.error("access denied");
			}
		} catch (err) {
			pretty.error(`error`, err);
		}
}

nfc.on('reader', reader => {
	pretty.info(`${reader.reader.name}  device attached`);

	reader.on('card.off', card => {
		pretty.info(`${reader.reader.name}  card removed`);
	});

	reader.on('error', err => {
		pretty.info(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		pretty.info(`${reader.reader.name}  device removed`);
	});

    reader.on('card', (card) => onCardHandler(reader, card));
});

nfc.on('error', err => {
	pretty.info('an error occurred', err);
});