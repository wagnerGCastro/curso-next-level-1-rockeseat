import { Router } from 'express';

const userRoutes = Router();

// userRoutes.get('/', UserController.index);
// userRoutes.get('/:id', UserController.show);
// userRoutes.post('/', UserController.store);
// userRoutes.put('/:id', UserController.update);


const users = ['DiegoS', 'Wagner', 'Fager' , 'PAULO'];

userRoutes.get('/', (request, response) => {
  // console.log('Listagem de usuáarios');
  response.json(users);
});


userRoutes.get('/search', (request, response) => {
  // console.log('Listagem de usuáarios');
  const search = String(request.query.s);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

  response.json(filteredUsers);
});

userRoutes.get('/:id', (request, response) => {
  // console.log('Listagem de usuáarios');
  const id = Number(request.params.id)
  response.json(users[id]);
});


export default userRoutes;
