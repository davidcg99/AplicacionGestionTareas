const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const authController = require("../../controllers/auth/authController");


  router.get('/moduleTask',authMiddleware.getAuth,(req, res) => {   
  });
  router.post('/moduleTask',authController.getUser, (req, res) => {
  });
  
module.exports = router;