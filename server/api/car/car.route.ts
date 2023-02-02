import { Router } from 'express';
import Controller from './car.controller';

const car: Router = Router();
const controller = new Controller();

car.get('/', controller.findAll); //вывод списка всех автомобилей
car.post('/', controller.add); //добавление нового автомобиля
car.delete('/:id', controller.delete); //удаления автомобиля по __id

export default car;