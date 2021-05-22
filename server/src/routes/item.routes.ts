import { Router } from 'express';
import ItemController from '../app/controllers/ItemController';

const itemRoutes = Router();

itemRoutes.get('/', ItemController.index);

export default itemRoutes;
