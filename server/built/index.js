"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const config_1 = __importDefault(require("./config/config"));
require("./config/db");
const PORT = config_1.default.PORT;
App_1.default.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});
App_1.default.on('error', (e) => {
    console.log('Ошибка', e);
});
