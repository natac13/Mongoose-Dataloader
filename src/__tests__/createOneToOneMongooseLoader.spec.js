import createOneToOneMongooseLoader from '../createOneToOneMongooseLoader';
import CourseModel from '../../models/Course';
import ClassModel from '../../models/Class';
import {
  connectMongooseAndPopulate,
  clearDB,
  disconnectMongoose,
} from '../../utils';

describe('One to One Loader Function', () => {
  let courseLoader;
  let connection;

  beforeAll(async () => {
    connection = await connectMongooseAndPopulate();
    courseLoader = createOneToOneMongooseLoader(CourseModel, 'id', {
      __v: false,
      _id: false,
    });
  });

  afterAll(async () => {
    await clearDB();
    return disconnectMongoose();
  });

  beforeEach(() => {
    courseLoader.clearAll();
  });

  test('Should return a Promise, that resovles to a list of courses', async () => {
    const keys = ['a', 'c', 'b']; // notice the ordering
    const courses = await courseLoader.loadMany(keys);
    expect(courses).toHaveLength(keys.length);
    expect(courses[1].id).toEqual(keys[1]);
  });

  test('Return single Document for a given key', async () => {
    const key = 'b';
    const course = await courseLoader.load(key);
    expect(course.name).toEqual('Course B');
    expect(course).toMatchInlineSnapshot(`
      Object {
        "id": "b",
        "name": "Course B",
      }
    `);
  });
});
