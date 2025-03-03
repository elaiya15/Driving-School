import User from "../models/userModel.js";
import Instructor from "../models/InstructorSchema.models.js";
import Learner from "../models/LearnerSchema.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fast2sms from "fast-two-sms"; // Install using `npm install fast-two-sms`
import fs from "fs";


// <<<<<<<<<<<<< Instructor >>>>>>>>>>>>>>>
// 📌 createInstructor
 const createInstructor = async (req, res) => {
  const {  username, mobileNumber, password, role } = req.body;

  try {
      if (role === 'Admin') return res.status(403).json({ message: 'Cannot create admin' });

      // Create a new user
      const newUser = new User({username, mobileNumber, password, role });

      // Delete sensitive fields (name, username, mobileNumber, password) from the request body
      delete req.body.username;
      delete req.body.password;

      let newRoleData; // This will hold the new Instructor or Learner data

      // Save based on role (Instructor or Learner)
      if (role === 'Instructor') {
          // After checking the role, delete 'role' from req.body, as it's not needed in Instructor
          delete req.body.role;
          newRoleData = new Instructor({...req.body });
          newUser.refId = newRoleData._id; // Link the User to the Instructor
          newRoleData.userId = newUser._id; // Link the Instructor to the User

          await newRoleData.save(); // Save the Instructor
          await newUser.save(); // Save the User
      } 

      res.status(201).json({ message: `${newUser.role} created successfully ${newRoleData}` });
  } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
  }
 }; 

// 📌 READ ALLInstructors
 const getAllInstructors = async (req, res) => {
    try {
      const instructors = await Instructor.find().populate("userId", "username mobileNumber role");
      res.status(200).json(instructors);
    } catch (err) {
      res.status(500).json({ message: "Error fetching instructors", error: err.message });
    }
 };
  // 📌 UPDATE Instructor
 const updateInstructor = async (req, res) => {
    try {
      const { _id } = req.params;
      const updatedInstructor = await Instructor.findByIdAndUpdate(_id, req.body, { new: true });
  
      if (!updatedInstructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
  
      res.status(200).json({ message: "Instructor updated successfully", instructor: updatedInstructor });
    } catch (err) {
      res.status(500).json({ message: "Error updating instructor", error: err.message });
    }
 };

  // 📌 DELETE Instructor
  const deleteInstructor = async (req, res) => {
    try {
      const { _id } = req.params;
  
      const instructor = await Instructor.findById(_id);
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
  
      await User.findByIdAndDelete(instructor.userId); // Delete linked user
      await Instructor.findByIdAndDelete(_id);
  
      res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting instructor", error: err.message });
    }
  };
 
 
      // ✨ <<<<<<<<<<<<< Learner >>>>>>>>>>>>>>> ✨  
 
  // 📌 createLearner
  const createLearner = async (req, res) => {
    // const data={...req.body}
    // console.log(data);
    console.log("body",req.body);
    
  const {  username, mobileNumber, password, role } = req.body;

   try {
    if (role === 'Admin') return res.status(403).json({ message: 'Cannot create admin' });

    // Create a new user
    const newUser = new User({username, mobileNumber, password, role });

    // Delete sensitive fields (name, username, mobileNumber, password) from the request body
    delete req.body.username;
    delete req.body.password;

    let newRoleData; // This will hold the new Instructor or Learner data

    // Save based on role (Instructor or Learner)
   if (role === 'Learner') {
console.log("enter learner");

    // After checking the role, delete 'role' from req.body, as it's not needed in Learner
    delete req.body.role;
    newRoleData = new Learner({...req.body });
    
    newUser.refId = newRoleData._id; // Link the User to the Learner
    newRoleData.userId = newUser._id; // Link the Learner to the User
    
    await newRoleData.save(); // Save the Learner
    await newUser.save(); // Save the User
  return  res.status(201).json({ message: `${newUser.role} created successfully ${newRoleData}` });
    }else{

      return res.status(500).json({ message: 'Error creating user role undefine' });
    }

   return res.status(500).json({ message: 'Error creating user' });
        
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  };

 // 📌 READ ALL Learners
  const getAllLearners = async (req, res) => {
    try {
      const learners = await Learner.find().populate("userId", "username mobileNumber role");
      res.status(200).json(learners);
    } catch (err) {
      res.status(500).json({ message: "Error fetching learners", error: err.message });
    }
  };
  
  // 📌 UPDATE Learner
  const updateLearner = async (req, res) => {
    try {
      const { _id } = req.params;
      const updatedLearner = await Learner.findByIdAndUpdate(_id, req.body, { new: true });
  
      if (!updatedLearner) {
        return res.status(404).json({ message: "Learner not found" });
      }
  
      res.status(200).json({ message: "Learner updated successfully", learner: updatedLearner });
    } catch (err) {
      res.status(500).json({ message: "Error updating learner", error: err.message });
    }
  };
  // 📌 DELETE Learner
  const deleteLearner = async (req, res) => {
    try {
      const { _id } = req.params;
  
      const learner = await Learner.findById(_id);
      if (!learner) {
        return res.status(404).json({ message: "Learner not found" });
      }
  
      await User.findByIdAndDelete(learner.userId); // Delete linked user
      await Learner.findByIdAndDelete(_id);
  
      res.status(200).json({ message: "Learner deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting learner", error: err.message });
    }
  };

 export default {
  createInstructor,
  createLearner,
  getAllInstructors,
  getAllLearners,
  updateInstructor,
  updateLearner,
  deleteInstructor,
  deleteLearner,
};
// export default { createUser };
