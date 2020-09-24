const Mongonaut = require('mongonaut');
let mongonaut = new Mongonaut({
  db: 'test',
});
mongonaut.set('jsonArray', false);
const data = [
  {
    path: './boards.json',
    collection: 'boards',
  },
  {
    path: './pins.json',
    collection: 'pins',
  },
  {
    path: './users.json',
    collection: 'users',
  },
  {
    path: './topics.json',
    collection: 'topics',
  },
  {
    path: './chats.json',
    collection: 'chats',
  },
  {
    path: './messages.json',
    collection: 'messages',
  },
  {
    path: './images.files.json',
    collection: 'images.files',
  },
  {
    path: './images.chunks.json',
    collection: 'images.chunks',
  },
];

console.log('Please Wait this might take few minutes');
for (let i = 0; i < data.length; i++) {
  mongonaut
    .set('collection', data[i].collection)
    .import(data[i].path)
    .then(success => {
      console.log(`${data[i].collection} Succeeded`);
    })
    .catch(err => {
      console.log('Error : ', err);
    });
}
