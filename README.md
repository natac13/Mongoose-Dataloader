# Mongoose-Dataloader

A way to use Dataloader with Mongoose for MongoDB

### Install

```
npm install -S @natac13/mongoose-dataloader
```

### Usage

```
import createOneToOneMongooseLoader from '@natac13/mongoose-dataloader/createOneToOneMongooseLoader';
import createOneToManyMongooseLoader from '@natac13/mongoose-dataloader/createOneToManyMongooseLoader';

const modelLoader = createOneToOneMongooseLoader(Model, '_id');
const doc = modelLoader.load(id);

const arrayOfModelsLoader = createOneToManyMongooseLoader(Model2, 'modelOneID');
const arrayOfDocs = arrayOfModelsLoader.load(id);
```

## Example

Using Apollo Server, GraphQL and MongoDB.
This example uses `Courses` that have associated `Classes`. But similary it could be thought of as `Publishers`(Courses) that have assciated `Books`(Classes); like the linked MongoDB Doc below.

Say we have a Training Center that offers different `Courses`. To train someone in a `Course`, a `Class` is put on with on a certain date, and will reference the `Course`. Therefore the list of `Classes` will be a growing array without a limit. From the [MongoDB docs](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/)

> When using references, the growth of the relationships determine where to store the reference. If the number of books per publisher is small with limited growth, storing the book reference inside the publisher document may sometimes be useful. Otherwise, if the number of books per publisher is unbounded, this data model would lead to mutable, growing arrays.

Therefore a `Class` will have a _reference_ to the `Course` Document.

Now given a query for a list of `Classes` the GraphQL resolver will first find all the `Classes` then (without [Dataloader](https://github.com/graphql/dataloader)) there will be `n` calls to the DB to fetch the respective `Course` document. Which is the `1 + n` problem that Dataloader addresses. Not only are there `n` calls, which can be _batched_, most of the returned `Courses` will be duplicates. Say the query was for all `Classes` with a specific `courseId`

```
query GetClasses($courseId: ID!){
  getClasses(courseId: $courseId) {
    id
    dateOf
    course {
      id
      name
    }
  }
}
```

Since we are only querying for `Classes` for the same `Course` all the `n` calls will be redundant!
This is where [**Dataloader**](https://github.com/graphql/dataloader) shines! It will batch up the `n` calls and query the DB once as well as 'cache' the response for the duration of the single `request`.

Apollo Server setup.

```
// dataSources will will called on each request and put on the context
const dataSources = () => ({
  Course: CourseModel,
  Class: ClassModel,
  CourseLoader: createOneToOneMongooseLoader(Course, '_id'), // One id to One Document
  ClassLoader: ... // see below One-To-Many Loader case
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  ...
});
```

**One-To-One Loader Case**

The resolver to query for a list of `Classes` would be as follows:

```
// resolvers/Class.js
{
  Query: {
    getClasses: async (root, { courseId }, { dataSources }) => {
      // find all Classes with the given courseId
      const classes = await dataSources.Class.find({ courseId });
      return classes;
    },
  },
  Class: {
    course: async (root, _, { dataSources }) => {
      // returns a single doc for the given key
      const courseDoc = await dataSources.CourseLoader.load(root.course);
      return courseDoc;
    }
  }
}
```

Now the query will only make 2 calls to the DB 👏
Therefore avoiding duplicates documents as well.

**One-To-Many Loader Case**

However in my application I wanted to be able to run this query as well, **without embedding** a list of `Class` ids on the `Course` Document:

```
query {
  getCourses() {
    id
    name
    upcomingClasses {
      id
      dateOf
      course {
        id
        name
      }
    }
  }
}
```

Since there is no embedded list of `ids` to just feed to `ClassLoader.loadMany()` I had to adjust my [`batch`](https://github.com/natac13/Mongoose-Dataloader/blob/67cc82288695307091ec3a622be165704087842f/src/createOneToManyMongooseLoader.js#L15) function passed to Dataloader; hence the reason for me making this project as the other solutions only dealt with the **OneToOneLoader** situation. By using the `createOneToManyMongooseLoader`:

```
const dataSources = () => ({
  ...
  ClassLoader: createOneToManyMongooseLoader(Class, 'courseId') // One id to One Array of Documents.
});
```

```
// resolvers/Course.js

{
  Query: {
    getCourses: async (root, _, { dataSources }) => {
      return dataSources.Course.find();
    }
  },
  Course: {
    upcomingClasses: async (root, _, { dataSources }) => {
      // returns an array of Class docs that reference the courseId
      const classes = await dataSources.ClassLoader.load(root.id);
      // simulate filtering to only future classes
      return R.filter((class) => dateOf > new Date())(classes);
    }
  }
}
```

## For Reference of the above example

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

License MIT
