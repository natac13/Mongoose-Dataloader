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
    courseLoader = createOneToOneMongooseLoader(CourseModel, 'id');
  });

  afterAll(async () => {
    await clearDB();
    return disconnectMongoose();
  });

  beforeEach(() => {
    courseLoader.clearAll();
  });

  test('Should return a Promise, that resovles to a list of courses', async () => {
    const courseIds = ['a', 'c', 'b']; // notice the ordering
    const courses = await courseLoader.loadMany(courseIds);
    expect(courses).toHaveLength(courseIds.length);
    expect(courses[1].id).toEqual(courseIds[1]);
  });

  test('Return single Document for a given key', async () => {
    const courseId = 'b';
    const course = await courseLoader.load(courseId);
    expect(course.name).toBeDefined();
    expect(course.id).toBeDefined();
    expect(course.name).toEqual('Course B');
  });

  test('Throw error when no model supplied.', () => {
    const wrapperFn = () => createOneToOneMongooseLoader();

    expect(wrapperFn).toThrow();
    expect(wrapperFn).toThrowError(/model/i);
  });

  test('Projection option set for Class loader', async () => {
    const classLoader = createOneToOneMongooseLoader(ClassModel, 'id', {
      projection: { id: 1, date: 1, _id: 0 },
      lean: true,
    });
    const classId = '1';
    const result = await classLoader.load(classId);
    expect(result.courseId).toBeUndefined();
    expect(result).toMatchInlineSnapshot(`
      Object {
        "date": "2017-10-01",
        "id": "1",
      }
    `);
  });
});
