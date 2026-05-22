import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000'],
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      const arkaxisRegex = /^https?:\/\/([a-zA-Z0-9-]+\.)*arkaxis\.net$/;
      if (
        arkaxisRegex.test(origin) ||
        origin === 'http://localhost:3000' ||
        origin === 'http://localhost:5173'
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Bismillahir Rahmanir Rahim!');
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
