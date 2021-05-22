import { Router } from 'express';

import itemRoutes from './item.routes';
import pointRoutes from './point.routes';
import userRoutes from './user.routes';

const routes = Router();

routes.use('/items', itemRoutes);
routes.use('/points', pointRoutes);
routes.use('/users', userRoutes);

export default routes;
