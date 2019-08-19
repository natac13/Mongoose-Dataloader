import mongoose, { Schema } from 'mongoose';

const ClassSchema = new Schema(
  {
    id: String,
    date: String,
    courseId: String,
  },
  { _id: false }
);

export default mongoose.model('Class', ClassSchema);
