import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
  id: String,
  name: String,
});

export default mongoose.model('Course', CourseSchema);
