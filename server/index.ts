
import app from './App';
import CONFIG from './config/config';
//import './config/db';

const PORT = CONFIG.PORT;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});

app.on('error', (e) => {
  console.log('Ошибка', e);
});