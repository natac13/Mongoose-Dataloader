import mongoose from 'mongoose';

import ClassModel from '../models/Class';
import CourseModel from '../models/Course';
import { classes, courses } from './mockData';

const mongooseOpts = {
  autoIndex: false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
};

export const connectMongoose = async () => {
  jest.setTimeout(20000);
  return mongoose.connect(global.__MONGO_URI__, {
    ...mongooseOpts,
    dbName: global.__MONGO_DB_NAME__,
    useCreateIndex: true,
  });
};

export async function connectMongooseAndPopulate() {
  await connectMongoose();
  const x = await ClassModel.insertMany(classes);
  await CourseModel.insertMany(courses);
}

export async function clearDB() {
  await mongoose.connection.db.dropDatabase();
}

export async function disconnectMongoose() {
  return mongoose.disconnect();
}
