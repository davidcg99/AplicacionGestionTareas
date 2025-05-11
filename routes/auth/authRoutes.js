const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const validateRequest = require('../../middlewares/validation/validationMiddleware');
const schema = require('../../schema/authSchema');

router.get('/',authMiddleware.getAuth,(req, res) => {
  });

  router.get('/logout',authMiddleware.logout,(req, res) => {
  });

  router.post('/api/v1/generateToken', validateRequest({ body: schema.AuthSchema, query:  schema.schemaEmpty, params: schema.schemaEmpty  }) , authMiddleware.generateToken,(req, res) => {
  });
  
module.exports = router;