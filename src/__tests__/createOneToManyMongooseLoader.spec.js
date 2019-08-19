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
    connection = await connectMongooseAndPopulate();
    classLoader = createOneToManyMongooseLoader(ClassModel, 'courseId');
    courseLoader = createOneToOneMongooseLoader(CourseModel, 'id');
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
    const courseIds = ['a', 'b']; // notice the ordering
    const classesArrayOfArray = await classLoader.loadMany(courseIds);
    expect(classesArrayOfArray).toHaveLength(courseIds.length);
    expect(classesArrayOfArray[0]).toEqual(
      expect.arrayContaining([expect.objectContaining({ courseId: 'a' })])
    );
    expect(classesArrayOfArray[1]).toEqual(
      expect.arrayContaining([expect.objectContaining({ courseId: 'b' })])
    );
  });

  test('Return an Array of docs that for the passed in key; 1 Key for many doc(or an array of)', async () => {
    const courseId = 'b';
    const result = await classLoader.load(courseId);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ courseId }));
  });

  test('OneToMany Projection test', async () => {
    const clsLoader = createOneToManyMongooseLoader(ClassModel, 'courseId', {
      projection: { _id: 0, courseId: 1 },
    });
    const courseId = 'b';
    const result = await clsLoader.load(courseId);
    expect(result).toHaveLength(2);
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "courseId": "b",
        },
        Object {
          "courseId": "b",
        },
      ]
    `);
  });

  test('Throw error when no model supplied.', () => {
    const wrapperFn = () => createOneToManyMongooseLoader();

    expect(wrapperFn).toThrow();
    expect(wrapperFn).toThrowError(/model/i);
  });
});
