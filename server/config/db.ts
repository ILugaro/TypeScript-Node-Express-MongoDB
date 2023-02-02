import * as mongoose from 'mongoose';
import CONFIG from './config';


// Подключеник к БД
export default (async () => {
  try {
    await mongoose.connect(CONFIG.URI);
    // ожидане запросов
    console.log('Подключение к БД установлено.');
  } catch (err) {
    console.log(`${err} Неудалось подключиться к БД!`);
    process.exit();
  }
})();