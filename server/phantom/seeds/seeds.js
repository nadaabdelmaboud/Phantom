const Mongonaut = require('mongonaut');
const db="phantom"  //change this if you want to your local db name
let mongonaut = new Mongonaut({
  db: db
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
];
let count=0;
console.log('Please Wait this might take few minutes');
for (let i = 0; i < data.length; i++) {
  mongonaut
    .set('collection', data[i].collection)
    .import(data[i].path)
    .then(success => {
      console.log(`${data[i].collection} Succeeded`);
      count++;
      if(count==data.length){
        console.log("data is imported succissfully to 'mongodb://localhost:27017/"+db+"'");
      }
    })
    .catch(err => {
      console.log('Error : ', err);
    });
}
