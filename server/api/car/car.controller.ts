import { Request, Response } from 'express';
import car from './car.model';
import { SortOrder } from 'mongoose';

export default class CarsController {

  //GET запрос, отправка всех данных с сортировкой
  public findAll = async (req: Request, res: Response): Promise<any> => {
    
    //значения сортировки по умолчанию
    let sort:string = 'price'; 
    let typeSort:string = 'least_in_first';
  
    //данные для проверки параметров запроса
    const keysBase: string[] = ['brand', 'name', 'year', 'price']; //параметры по которым возможна сортировка 
    const keysCar: string[] = ['sort', 'typeSort'];  //возможные ключи в параметрах
    const valuestypeSort: string[] = ['least_in_first','biggest_in_first']; //возможные значения для параметра typeSort

    try {
      for (const key in req.query){ 
        if (!(keysCar.includes(key))){ 
          return res.status(400).json({'data':[], 'err': `Недопустимый параметр в запросе! (поле ${key})`})
        }  
      }
      if ("sort" in req.query){
        sort = req.query.sort as string;
        if (!(keysBase.includes(sort))){
          return res.json({'data':[], 'err': 'Недопустимый параметр сортировки! (поле "sort")'})
        }
        
        if (req.query.typeSort){
          typeSort = req.query.typeSort as string;;
          if (!valuestypeSort.includes(typeSort)){
            return res.status(400).json({'data':[], 'err': 'Поле "typeSort" может быть только "least_in_first" или "biggest_in_first"!' })
          }
        }
        else{
          return res.status(400).json({'data':[], 'err': 'Нет поля "typeSort"! Укажите "least_in_first" или "biggest_in_first"!' })
        } 
      }
      else{
        if ("typeSort" in req.query) {
          return res.status(400).json({'data':[], 'err': 'Указан тип сортировки, но не указан параметр сортировки! (пустое поле "sort")' })
        }
      }

      interface StringArray {
        [index: string]: SortOrder
      }
      let obj_sort:StringArray = {};
      obj_sort[sort] = typeSort==='least_in_first'?1:-1;

      const data = await car.find().sort(obj_sort).select('-__v');
      return res.status(200).json({'data':data, 'err':''})

    } catch (err) {
        console.log(err);
        res.status(500).send({'data':[], 'err':'Произошла ошибка на стороне сервера.'})
    }
  }

  //DELETE запрос удаления машины
  public delete = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await car.findByIdAndRemove(req.params.id);
      if (!user) {
        return res.status(404).send(`Автомобиль с id ${req.params.id} не обнаружен!`);
      }
       return res.status(204).send(); //статус 204 не имеет сообщения
    } catch (err) {
        console.log(err);
        return res.status(500).send('Произошла ошибка на стороне сервера.')
    }
  }

  //POST запрос добаление новой машины
  public add = async (req: Request, res: Response): Promise<any> => {
    interface reqBody {
      brand: string;
      name: string;
      year: number;
      price: number;
    }

    const keysBase: string[] = ['brand', 'name', 'year', 'price']; //параметры которые должны быть в запросе
    try{
      for (const key in req.body){ 
        if (!(keysBase.includes(key))){ 
          return res.status(400).json({'data':[], 'err': `Недопустимый параметр в запросе! (поле ${key})`})
        }  
      }
      for (const key of keysBase){
        if (!(key in req.body)){
          return res.status(400).json({'data':[], 'err': `Отсутствует обязательный параметр "${key}"!`})
        }
      }

      const { brand, name, year, price}:reqBody = req.body;
      const newCar = new car({
        brand,
        name,
        year,
        price
        });
      
      const newUser = await newCar.save();
      res.status(201).send(newUser._id);
    }
    catch(err){
      console.log(err);
      res.status(500).send('Произошла ошибка на стороне сервера.')
    }
  }
}