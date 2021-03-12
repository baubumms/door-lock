const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync('./db.json');
const db = low(adapter);
 
db.defaults({ cards: [] })
  .write();
 
// Add a post
var dbCard = db.get("cards")
		.find({ownerId: "Emil"})
		.value();

delete dbCard.manufacturerBlock;

for(var s = 1; s < dbCard.sectors.length; s++){
  for(var b = 0; b < dbCard.sectors[s].blocks.length; b++){
    var cp = cpArray(dbCard.sectors[s].blocks[b].data);
    dbCard.sectors[s].blocks[b] = cp;
  }
  var keyA = cpArray(dbCard.sectors[s].keyA.data);
  var keyB = cpArray(dbCard.sectors[s].keyB.data);
  dbCard.sectors[s].keyA = keyA;
  dbCard.sectors[s].keyB = keyB;
}

console.log(dbCard);

var dbCard = db.get("cards")
		.find({ownerId: "Emil"})
    .set("sectors", dbCard.sectors)
    .write();


function cpArray(a){
  var b = new Array(a.length);
  for(var i = 0; i < a.length; i++)
    b[i] = a[i];
  return b;
}
