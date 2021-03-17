const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync(__dirname + '/../db/db.json');
const db = low(adapter);

db.defaults({ cards: [] })
  .write();

module.exports = db;
 
// // Set some defaults
// db.defaults({ posts: [], user: {} })
//   .write();
 
// // Add a post
// db.get('posts')
//   .push({ id: 1, title: 'lowdb is awesome'})
//   .write();
 
// // Set a user using Lodash shorthand syntax
// db.set('user.name', 'typicode')
//   .write();

