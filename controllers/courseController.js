import Course from '../models/CourseSchema.models.js';

// Create Course
export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Course by _id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params._id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Course by _id
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Course by _id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params._id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
