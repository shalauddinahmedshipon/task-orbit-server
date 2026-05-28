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

app.use(
  cors({
    origin: ['http://localhost:3000','https://task-orbit-client.vercel.app'],
    credentials: true,
  }),
);

app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Bismillahir Rahmanir Rahim!');
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
