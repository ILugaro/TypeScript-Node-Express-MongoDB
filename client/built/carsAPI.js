"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const url = config_1.default.URL;
const MAX_YEAR = config_1.default.MAX_YEAR; //максимальный год выпуска автомобиля
const MIN_YEAR = config_1.default.MIN_YEAR; //минимальный год выпуска автомобиля
const MIN_PRICE = config_1.default.MIN_PRICE; //минимальная цена автомобиля
switch (process.argv[2]) { //первый параметр консоли
    case 'help':
        console.log('Для добавления: "add" + 4 обязательных параметра (бренд, имя, год, цена).');
        console.log('Для удаления: "del" + __id автомобиля.');
        console.log('Просмотр списка: "show" + 2 необязательных параметра. Параметр сортировки и "least_in_first"/"biggest_in_first"(подробнее в readme.txt).');
        break;
    case 'add':
        {
            add(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
        }
        break;
    case 'del':
        {
            del(process.argv[3]);
        }
        break;
    case 'show':
        {
            show(process.argv[3], process.argv[4]);
        }
        break;
    default:
        {
            console.log('Неверный ввод. Используйте команду "help" что бы увидеть доступные параметры!');
        }
}
//Добавление автомобиля
function add(brand, name, strYear, strPrice) {
    if (!brand || !name || !strYear || !strPrice) {
        console.log('После "add" должны следовать 4 параметра - бренд, имя, год цена. ');
        return;
    }
    if (!("year".length == 4 && isNumber(strYear))) {
        console.log('3-им параметром после "add" должен следовать год в 4-ех значном формате');
        return;
    }
    if (!isNumber(strPrice)) {
        console.log('3-им параметром после "add" должен следовать год в 4-ех значном формате');
        return;
    }
    const year = parseInt(strYear, 10);
    const price = parseInt(strPrice, 10);
    if (year < MIN_YEAR || year > MAX_YEAR) {
        console.log(`Указанный год ${year} - является аномальным значением! Автомобиль не будет добавлен.`);
        return;
    }
    if (price < MIN_PRICE) {
        console.log(`Указанная цена ${price} - является аномальным значением! Автомобиль не будет добавлен.`);
        return;
    }
    axios_1.default.post(url, { brand, name, year, price })
        .then((res) => {
        if (res.status === 201) {
            console.log(`Автомобиль добавлен с __id ${res.data}`);
            return;
        }
        ;
    })
        .catch((err) => {
        if ('response' in err && err.response.data) {
            console.log(err.response.data);
            return;
        }
        else {
            console.log('Возникла непредвиденная ошибка!');
            console.log(err);
            return;
        }
    });
}
//удаление автомобиля
function del(id) {
    if (!id) {
        console.log("Необходимо указать id удаляемого автомобиля!");
        return;
    }
    axios_1.default.delete(url + '/' + id)
        .then((res) => {
        if (res.status === 204) {
            console.log('Автомобиль удален.');
            return;
        }
        ;
    })
        .catch((err) => {
        if ('response' in err && err.response.data) {
            console.log(err.response.data);
            return;
        }
        else {
            console.log('Возникла непредвиденная ошибка!');
            console.log(err);
            return;
        }
    });
}
//получить список автомобилей
function show(sort, typeSort) {
    //значения сортировки по умолчанию. Будут изменены если в функцию переданы аргументы.
    let defaultSort = 'price';
    let defaultTypeSort = 'least_in_first';
    const keysBase = ['brand', 'name', 'year', 'price']; //параметры по которым возможна сортировка 
    const valuesTypeOfSort = ['least_in_first', 'biggest_in_first']; //возможные значения для параметра typeOfSort
    if (sort) {
        if (!keysBase.includes(sort)) {
            console.log('Неверный второй параметр. Ожидается "brand", "name", "year", "price" или другой параметр сортировки.');
            return;
        }
        if (!typeSort) {
            console.log('При указании параметра сортировки необходимо указать тип сортировки. "least_in_first" или "biggest_in_first" следующим параметром.');
            return;
        }
        defaultSort = sort;
    }
    if (typeSort) {
        if (!valuesTypeOfSort.includes(typeSort)) {
            console.log('3-им параметром может быть только "least_in_first" или "biggest_in_first"!');
            return;
        }
        defaultTypeSort = typeSort;
    }
    axios_1.default.get(url, { params: { "sort": defaultSort, "typeSort": defaultTypeSort } })
        .then((res) => { console.log(res.data.data); })
        .catch((err) => {
        if ('response' in err && err.response.data) {
            console.log(err.response.data);
            return;
        }
        else {
            console.log('Возникла непредвиденная ошибка!');
            console.log(err);
            return;
        }
    });
}
//проверка можно ли строку перевести в число
function isNumber(str) {
    if (typeof str !== 'string') {
        return false;
    }
    if (str.trim() === '') {
        return false;
    }
    return !Number.isNaN(Number(str));
}
