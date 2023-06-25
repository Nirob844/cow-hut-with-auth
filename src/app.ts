import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routers from './app/routes';
const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1', routers);

// global error handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api Not found',
      },
    ],
  });
});

//Testing
app.get('/', async (req: Request, res: Response) => {
  res.send('Working Successfully');
  throw new Error('testing');
});

export default app;
