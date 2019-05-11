# Mongoose-Dataloader

A way to use Dataloader with Mongoose for MongoDB

### Install

```
npm install -S @natac13/mongoose-dataloader
```

### Usage

```
import {
  createOneToOneMongooseLoader,
  createOneToManyMongooseLoader,
} from '@natac13/mongoose-dataloader';

const modelLoader = createOneToOneMongooseLoader(Model, '_id');
const doc = modelLoader.load(id);

const arrayOfModelsLoader = createOneToManyMongooseLoader(Model2, 'modelOneID');
const arrayOfDocs = arrayOfModelsLoader.load(id);
```

## Example

Please see the [`src/__tests__`]('./src/__tests__') folder.

#### Models

```
import mongoose, { Schema } from 'mongoose';

const ClassSchema = new Schema({
  id: String,
  date: String,
  courseId: String,
});

const ClassModel = mongoose.model('Class', ClassSchema);


const CourseSchema = new Schema({
  id: String,
  name: String,
});

const CourseModel = mongoose.model('Course', CourseSchema);
```

### Mock Data

```
export const classes = [
  {
    id: '1',
    date: '20117-10-01',
    courseId: 'a',
  },
  {
    id: '2',
    date: '2017-01-01',
    courseId: 'a',
  },
  {
    id: '3',
    date: '2017-05-01',
    courseId: 'a',
  },
  {
    id: '4',
    date: '2019-08-01',
    courseId: 'b',
  },
  {
    id: '5',
    date: '2018-08-01',
    courseId: 'b',
  },
  {
    id: '6',
    date: '2018-10-01',
    courseId: 'c',
  },
];

export const courses = [
  {
    id: 'a',
    name: 'Course A',
  },
  {
    id: 'b',
    name: 'Course B',
  },
  {
    id: 'c',
    name: 'Course C',
  },
];

```
