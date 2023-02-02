"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const car_model_1 = __importDefault(require("./car.model"));
class CarsController {
    constructor() {
        //GET запрос, отправка всех данных с сортировкой
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //значения сортировки по умолчанию
            let sort = 'price';
            let typeSort = 'least_in_first';
            //данные для проверки параметров запроса
            const keysBase = ['brand', 'name', 'year', 'price']; //параметры по которым возможна сортировка 
            const keysCar = ['sort', 'typeSort']; //возможные ключи в параметрах
            const valuestypeSort = ['least_in_first', 'biggest_in_first']; //возможные значения для параметра typeSort
            try {
                for (const key in req.query) {
                    if (!(keysCar.includes(key))) {
                        return res.status(400).json({ 'data': [], 'err': `Недопустимый параметр в запросе! (поле ${key})` });
                    }
                }
                if ("sort" in req.query) {
                    sort = req.query.sort;
                    if (!(keysBase.includes(sort))) {
                        return res.json({ 'data': [], 'err': 'Недопустимый параметр сортировки! (поле "sort")' });
                    }
                    if (req.query.typeSort) {
                        typeSort = req.query.typeSort;
                        ;
                        if (!valuestypeSort.includes(typeSort)) {
                            return res.status(400).json({ 'data': [], 'err': 'Поле "typeSort" может быть только "least_in_first" или "biggest_in_first"!' });
                        }
                    }
                    else {
                        return res.status(400).json({ 'data': [], 'err': 'Нет поля "typeSort"! Укажите "least_in_first" или "biggest_in_first"!' });
                    }
                }
                else {
                    if ("typeSort" in req.query) {
                        return res.status(400).json({ 'data': [], 'err': 'Указан тип сортировки, но не указан параметр сортировки! (пустое поле "sort")' });
                    }
                }
                let obj_sort = {};
                obj_sort[sort] = typeSort === 'least_in_first' ? 1 : -1;
                const data = yield car_model_1.default.find().sort(obj_sort).select('-__v');
                return res.status(200).json({ 'data': data, 'err': '' });
            }
            catch (err) {
                console.log(err);
                res.status(500).send({ 'data': [], 'err': 'Произошла ошибка на стороне сервера.' });
            }
        });
        //DELETE запрос удаления машины
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield car_model_1.default.findByIdAndRemove(req.params.id);
                if (!user) {
                    return res.status(404).send(`Автомобиль с id ${req.params.id} не обнаружен!`);
                }
                return res.status(204).send(); //статус 204 не имеет сообщения
            }
            catch (err) {
                console.log(err);
                return res.status(500).send('Произошла ошибка на стороне сервера.');
            }
        });
        //POST запрос добаление новой машины
        this.add = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const keysBase = ['brand', 'name', 'year', 'price']; //параметры которые должны быть в запросе
            try {
                for (const key in req.body) {
                    if (!(keysBase.includes(key))) {
                        return res.status(400).json({ 'data': [], 'err': `Недопустимый параметр в запросе! (поле ${key})` });
                    }
                }
                for (const key of keysBase) {
                    if (!(key in req.body)) {
                        return res.status(400).json({ 'data': [], 'err': `Отсутствует обязательный параметр "${key}"!` });
                    }
                }
                const { brand, name, year, price } = req.body;
                const newCar = new car_model_1.default({
                    brand,
                    name,
                    year,
                    price
                });
                const newUser = yield newCar.save();
                res.status(201).send(newUser._id);
            }
            catch (err) {
                console.log(err);
                res.status(500).send('Произошла ошибка на стороне сервера.');
            }
        });
    }
}
exports.default = CarsController;
