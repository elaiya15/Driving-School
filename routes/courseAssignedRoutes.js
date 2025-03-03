import express from 'express';
import {
  createCourseAssigned,
  getCourseAssigned,
  getCourseAssignedById,
  updateCourseAssigned,
  deleteCourseAssigned,
} from '../controllers/courseAssignedController.js';

const router = express.Router();

router.post('/', createCourseAssigned);
router.get('/', getCourseAssigned);
router.get('/:_id', getCourseAssignedById);
router.put('/:_id', updateCourseAssigned);
router.delete('/:_id', deleteCourseAssigned);

export default router;
