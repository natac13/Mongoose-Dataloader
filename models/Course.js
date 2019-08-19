import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema(
  {
    id: String,
    name: String,
  },
  { _id: false }
);

export default mongoose.model('Course', CourseSchema);
