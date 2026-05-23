import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { seedAdmin } from './app/DB';
import { Server } from 'http';

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    await seedAdmin();
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main().catch((err) => console.log(err));

process.on('unhandledRejection', () => {
  console.log(`unhandledRejection is detected, shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected, shutting down...`);
  process.exit(1);
});
