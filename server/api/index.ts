import { Router } from 'express';
import car from './car/car.route';

const router: Router = Router();

router.use('/', car);

export default router;