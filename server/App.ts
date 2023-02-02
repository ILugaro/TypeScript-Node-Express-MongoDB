import express from 'express';
import api from './api/index';
import * as errorHandler from "./middleware/errorMiddleware";

class App {
    public express: express.Application;
  
    constructor() {
      this.express = express();
      this.setMiddlewares(); 
      this.setRoutes(); 
      this.catchErrors();
    }
  
    private setMiddlewares(): void {
      this.express.use(express.json());
      this.express.use(express.urlencoded({ extended: false }));  
    }
  
    private setRoutes(): void {
      this.express.use('/api', api);
    }

    private catchErrors(): void {
      this.express.use(errorHandler.notFound);
      this.express.use(errorHandler.internalServerError);
    }
  }
  
  export default new App().express;








 


