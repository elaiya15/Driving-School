import CourseAssigned from '../models/CourseAssigned.models.js';

// Create Course Assigned
export const createCourseAssigned = async (req, res) => {
  try {
    const courseAssigned = new CourseAssigned(req.body);
    await courseAssigned.save();
    res.status(201).json(courseAssigned);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Course Assignments
export const getCourseAssigned = async (req, res) => {
  try {
    const courseAssigned = await CourseAssigned.find().populate('learner').populate('course');
    res.status(200).json(courseAssigned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Course Assignment by _id
export const getCourseAssignedById = async (req, res) => {
  try {
    const courseAssigned = await CourseAssigned.findById(req.params._id).populate('learner').populate('course');
    if (!courseAssigned) return res.status(404).json({ message: 'Course Assignment not found' });
    res.status(200).json(courseAssigned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Course Assignment
export const updateCourseAssigned = async (req, res) => {
  try {
    const courseAssigned = await CourseAssigned.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!courseAssigned) return res.status(404).json({ message: 'Course Assignment not found' });
    res.status(200).json(courseAssigned);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Course Assignment
export const deleteCourseAssigned = async (req, res) => {
  try {
    const courseAssigned = await CourseAssigned.findByIdAndDelete(req.params._id);
    if (!courseAssigned) return res.status(404).json({ message: 'Course Assignment not found' });
    res.status(200).json({ message: 'Course Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
