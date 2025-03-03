import mongoose from 'mongoose';

const CourseAssignedSchema = new mongoose.Schema({
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Learner', // Reference to Learner model
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to Course model
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('CourseAssigned', CourseAssignedSchema);
