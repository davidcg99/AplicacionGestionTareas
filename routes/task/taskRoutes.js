const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const taskController = require("../../controllers/task/taskController");
const validateRequest = require('../../middlewares/validation/validationMiddleware');
const schema = require('../../schema/taskSchema');


router.get('/',authMiddleware.getAuthApi, validateRequest({ body: schema.schemaEmpty, query:  schema.taskQuerySchema, params: schema.schemaEmpty  }), taskController.getTasks, (req, res) => {    
});

router.post('/',authMiddleware.getAuthApi, validateRequest({ body: schema.createTaskSchema, query: schema.schemaEmpty, params: schema.schemaEmpty  }), taskController.insertTask, (req, res) => {    
});

router.put('/:id',authMiddleware.getAuthApi, validateRequest({ body: schema.updateTaskSchema, query: schema.schemaEmpty, params: schema.taskParamSchema  }), taskController.updateTask, (req, res) => {    
});

router.delete('/:id',authMiddleware.getAuthApi, validateRequest({ body: schema.schemaEmpty, query: schema.schemaEmpty, params: schema.taskParamSchema  }), taskController.deleteTask, (req, res) => {    
});



 
module.exports = router;