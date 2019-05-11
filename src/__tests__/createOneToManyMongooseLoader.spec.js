import createOneToOneMongooseLoader from '../createOneToOneMongooseLoader';
import createOneToManyMongooseLoader from '../createOneToManyMongooseLoader';
import CourseModel from '../../models/Course';
import ClassModel from '../../models/Class';
import {
  connectMongooseAndPopulate,
  clearDB,
  disconnectMongoose,
} from '../../utils';

describe('One to Many Loader Function', () => {
  let courseLoader;
  let classLoader;
  let connection;

  beforeAll(async () => {
    const projection = { __v: false, _id: false };
    connection = await connectMongooseAndPopulate();
    classLoader = createOneToManyMongooseLoader(
      ClassModel,
      'courseId',
      projection
    );
    courseLoader = createOneToOneMongooseLoader(CourseModel, 'id', projection);
  });

  afterAll(async () => {
    await clearDB();
    return disconnectMongoose();
  });

  beforeEach(() => {
    classLoader.clearAll();
    courseLoader.clearAll();
  });

  test('Returns an array of arrays, in the correct order.', async () => {
    const keys = ['a', 'b']; // notice the ordering
    const classesArrayOfArray = await classLoader.loadMany(keys);
    expect(classesArrayOfArray).toHaveLength(keys.length);
    expect(classesArrayOfArray[0]).toEqual(
      expect.arrayContaining([expect.objectContaining({ courseId: 'a' })])
    );
    expect(classesArrayOfArray[1]).toEqual(
      expect.arrayContaining([expect.objectContaining({ courseId: 'b' })])
    );
  });

  test('Return an Array of docs that for the passed in key; 1 Key for many doc(or an array of)', async () => {
    const key = 'b';
    const result = await classLoader.load(key);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ courseId: key }));
  });
});
