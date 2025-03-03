import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();


// READ
router.get("/instructors",jwtAuth(["Admin"]), userController.getAllInstructors);
router.get("/learners",jwtAuth(["Admin"]), userController.getAllLearners);

// UPDATE
router.put("/instructor/:_id",jwtAuth(["Admin"]), userController.updateInstructor);
router.put("/learner/:_id",jwtAuth(["Admin"]), userController.updateLearner);

// DELETE
router.delete("/instructor/:_id",jwtAuth(["Admin"]), userController.deleteInstructor);
router.delete("/learner/:_id",jwtAuth(["Admin"]), userController.deleteLearner);

export default router;
