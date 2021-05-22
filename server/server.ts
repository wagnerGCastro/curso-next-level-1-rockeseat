import path from 'path';
import express from 'express';
import cors from 'cors';
import routes from './src/routes';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
});

/**
 * http://expressjs.com/pt-br/api.html#express.static
 */
// const options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['svg', 'png', 'gif', 'jpeg', 'jpg'],
//   index: false,
//   maxAge: '1d',
//   redirect: false,
//   setHeaders: function (res, path, stat) {
//     res.set('x-timestamp', Date.now())
//   }
// }

const app = express();

// app.use('/teste', (request, response) => {
//   response.json('terste');
// });

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.resolve(__dirname, 'public')));
app.use(routes);

app.listen(process.env.PORT || 3334, () => {
  console.log(
    `Listening on port : ${process.env.PORT || 3334}`,
  );
});
