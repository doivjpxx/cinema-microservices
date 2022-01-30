import 'dotenv/config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { Controller } from 'core/interface';
import { errorMiddleware } from 'core/middlewares';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));
    this.app.use(helmet());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToTheDatabase() {
    // verbose logging when we are starting the server
    console.log('--- Movies Service ---')
    console.log('Connecting to movies repository...')

    // log unhandled execpetions
    process.on('uncaughtException', (err) => {
      console.error('Unhandled Exception', err)
    })
    process.on('uncaughtRejection', (err, promise) => {
      console.error('Unhandled Rejection', err)
    })

    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
