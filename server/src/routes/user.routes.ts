import { Router } from 'express';

const route = Router();

// route.get('/', UserController.index);
// route.get('/:id', UserController.show);
// route.post('/', UserController.store);
// route.put('/:id', UserController.update);


const users = ['Diego', 'Wagner', 'Fager'];

route.get('/users', (request, response) => {
  // console.log('Listagem de usuáarios');
  response.json(users);
});

route.get('/users/:id', (request, response) => {
  // console.log('Listagem de usuáarios');
  const id = Number(request.params.id)

  response.json(users[id]);
});

route.get('/users-search', (request, response) => {
  // console.log('Listagem de usuáarios');
  const search = String(request.query.search);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

  response.json(filteredUsers);
});


route.post('/users', (request, response) => {
  // console.log('Listagem de usuáarios');
  const user = request.body;
   console.log(user);
  response.json(user);
});

route.post('/users', (request, response) => {
  // console.log('Listagem de usuáarios');

  const user = {
    name: 'Wagner',
    email: 'wagner@gmail.com'
  }

  return response.json(user);
});


export default route;
