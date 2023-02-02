import axios from 'axios';
import CONFIG from './config';

const url:string = CONFIG.URL;
const MAX_YEAR:number = CONFIG.MAX_YEAR; //максимальный год выпуска автомобиля
const MIN_YEAR:number = CONFIG.MIN_YEAR; //минимальный год выпуска автомобиля
const MIN_PRICE:number = CONFIG.MIN_PRICE; //минимальная цена автомобиля

//формат получения данный о автомобиле
interface Cars {
  __id: string;
  brand: string;
  name: string;
  year: number;
  price:number;
}

//формат получения данных со списком автомобилей
interface Data {
    data: Cars[],
    err: string,
  }

switch (process.argv[2]){ //первый параметр консоли
  case 'help':
    console.log('Для добавления: "add" + 4 обязательных параметра (бренд, имя, год, цена).');
    console.log('Для удаления: "del" + __id автомобиля.');
    console.log('Просмотр списка: "show" + 2 необязательных параметра. Параметр сортировки и "least_in_first"/"biggest_in_first"(подробнее в readme.txt).');
    break;
  case 'add':
    {add(process.argv[3], process.argv[4], process.argv[5], process.argv[6])}
    break;
  case 'del':
    {del(process.argv[3])}
    break;
  case 'show':
    {show(process.argv[3], process.argv[4])}
    break;
  default:
    {console.log('Неверный ввод. Используйте команду "help" что бы увидеть доступные параметры!');}
}

//Добавление автомобиля
function add(brand:string, name:string,strYear:string, strPrice:string ):void{
  if (!brand || !name || !strYear || !strPrice) {
    console.log('После "add" должны следовать 4 параметра - бренд, имя, год цена. ');
    return
  } 
  if (!("year".length == 4 && isNumber(strYear))){ 
    console.log('3-им параметром после "add" должен следовать год в 4-ех значном формате');
    return
  }
  
  if (!isNumber(strPrice)){ 
    console.log('3-им параметром после "add" должен следовать год в 4-ех значном формате');
    return
  }

  const year:number = parseInt(strYear, 10);
  const price:number = parseInt(strPrice, 10);

  if (year < MIN_YEAR || year > MAX_YEAR){
    console.log(`Указанный год ${year} - является аномальным значением! Автомобиль не будет добавлен.`);
    return
  }

  if (price < MIN_PRICE){
    console.log(`Указанная цена ${price} - является аномальным значением! Автомобиль не будет добавлен.`);
    return
  }

  axios.post(url,{brand, name,  year,price})
    .then((res) => {
      if (res.status === 201){
        console.log(`Автомобиль добавлен с __id ${res.data}`);
        return
      };
    })
    .catch((err) => {
      if ('response' in err && err.response.data){
        console.log(err.response.data);
        return
      }
      else{
        console.log('Возникла непредвиденная ошибка!');
        console.log(err);
        return
      }
    });
}

//удаление автомобиля
function del(id:string):void{
  if (!id) {
    console.log("Необходимо указать id удаляемого автомобиля!");
    return
  }
  axios.delete<string>(url + '/' + id)
  .then((res) => {
    if (res.status === 204){
      console.log('Автомобиль удален.');
      return
    };
  })
  .catch((err) => {
    if ('response' in err && err.response.data){
      console.log(err.response.data);
      return
    }
    else{
      console.log('Возникла непредвиденная ошибка!');
      console.log(err);
      return
    }
    
  });
}

//получить список автомобилей
function show(sort:string, typeSort:string):void{
  //значения сортировки по умолчанию. Будут изменены если в функцию переданы аргументы.
  let defaultSort:string = 'price'; 
  let defaultTypeSort:string = 'least_in_first';

  const keysBase: string[] = ['brand', 'name', 'year', 'price']; //параметры по которым возможна сортировка 
  const valuesTypeOfSort: string[] = ['least_in_first','biggest_in_first']; //возможные значения для параметра typeOfSort

  if(sort){
    if (!keysBase.includes(sort)){
      console.log('Неверный второй параметр. Ожидается "brand", "name", "year", "price" или другой параметр сортировки.');
      return 
    }
    if (!typeSort) {
      console.log('При указании параметра сортировки необходимо указать тип сортировки. "least_in_first" или "biggest_in_first" следующим параметром.');
      return
    }
    defaultSort = sort;
  }
  if (typeSort){
    if (!valuesTypeOfSort.includes(typeSort)){
      console.log('3-им параметром может быть только "least_in_first" или "biggest_in_first"!');
      return
    }
    defaultTypeSort = typeSort;
  }

  axios.get<Data>(url, {params:{"sort": defaultSort, "typeSort": defaultTypeSort}})
    .then((res) => {console.log(res.data.data);})
    .catch((err) => {
      if ('response' in err && err.response.data){
        console.log(err.response.data);
        return
      }
      else{
        console.log('Возникла непредвиденная ошибка!');
        console.log(err);
        return
      }
    });
}

//проверка можно ли строку перевести в число
function isNumber(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  if (str.trim() === '') {
    return false;
  }
  return !Number.isNaN(Number(str));
}