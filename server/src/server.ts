import express from 'express';

const app = express();
app.use(express.json());

const users = ['Diego', 'Wagner', 'Fager'];

app.get('/users', (request, response) => {
  // console.log('Listagem de usuáarios');
  response.json(users);
});

app.get('/users/:id', (request, response) => {
  // console.log('Listagem de usuáarios');
  const id = Number(request.params.id)

  response.json(users[id]);
});

app.get('/users-search', (request, response) => {
  // console.log('Listagem de usuáarios');
  const search = String(request.query.search);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

  response.json(filteredUsers);
});


app.post('/users', (request, response) => {
  // console.log('Listagem de usuáarios');
  const user = request.body;
   console.log(user);
  response.json(user);
});

app.post('/users', (request, response) => {
  // console.log('Listagem de usuáarios');

  const user = {
    name: 'Wagner',
    email: 'wagner@gmail.com'
  }

  return response.json(user);
});

app.listen(3334);
