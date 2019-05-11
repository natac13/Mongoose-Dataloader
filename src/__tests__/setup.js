import {
  connectMongooseAndPopulate,
  clearDB,
  disconnectMongoose,
} from '../../utils';

import {
  classes as mockClasses,
  courses as mockCourses,
} from '../../utils/mockData';

import ClassModel from '../../models/Class';
import CourseModel from '../../models/Course';
let connection;

describe('Connection', () => {
  beforeAll(async () => {
    connection = await connectMongooseAndPopulate();
  });

  afterAll(async () => {
    await clearDB();
    return disconnectMongoose();
  });

  describe('DB populating', () => {
    test('Should return Classes using the Class Model.', async () => {
      const classes = await ClassModel.find();
      // console.log(classes);
      expect(classes).toBeDefined();
      expect(classes).toHaveLength(mockClasses.length);
    });

    test('Should return Courses using the Course Model.', async () => {
      const courses = await CourseModel.find();
      // console.log(courses);
      expect(courses).toBeDefined();
      expect(courses).toHaveLength(mockCourses.length);
    });
  });
});
