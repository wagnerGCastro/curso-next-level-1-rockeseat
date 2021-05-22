import { Router } from 'express';
import PointController from '../app/controllers/PointController';

const pointRoutes = Router();

pointRoutes.get('/', PointController.index);
pointRoutes.post('/', PointController.store);

export default pointRoutes;
