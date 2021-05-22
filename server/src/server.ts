import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  // console.log('Listagem de usuáarios');

  response.json(['Diego', 'Wagner', 'Fager']);
});

app.listen(3334)