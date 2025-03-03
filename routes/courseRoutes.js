import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';

const router = express.Router();

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:_id', getCourseById);
router.put('/:_id', updateCourse);
router.delete('/:_id', deleteCourse);

export default router;
