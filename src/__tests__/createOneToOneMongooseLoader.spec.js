import createOneToOneMongooseLoader from '../createOneToOneMongooseLoader';
import CourseModel from '../../models/Course';

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
    expect(course).toEqual(
      expect.objectContaining({
        name: 'Course B',
        id: 'b',
      })
    );
  });
  
  test('Throw error when no model supplied.', () => {
    const wrapperFn = () => createOneToOneMongooseLoader();

    expect(wrapperFn).toThrow();
    expect(wrapperFn).toThrowError(/model/i);
  });
});
