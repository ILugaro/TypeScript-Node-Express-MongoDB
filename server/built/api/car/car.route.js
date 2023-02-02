"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const car_controller_1 = __importDefault(require("./car.controller"));
const car = (0, express_1.Router)();
const controller = new car_controller_1.default();
car.get('/', controller.findAll); //вывод списка всех автомобилей
car.post('/', controller.add); //добавление нового автомобиля
car.delete('/:id', controller.delete); //удаления автомобиля по __id
exports.default = car;
