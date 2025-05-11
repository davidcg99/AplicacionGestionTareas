const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const chatController = require("../../controllers/chat/chatController");
const validateRequest = require('../../middlewares/validation/validationMiddleware');
const { messageSchema, schemaEmpty, guidSchema, ConversationHistoryQuerySchema } = require('../../schema/chatSchema');


router.post('/conversation',authMiddleware.getAuth, validateRequest({ body: messageSchema, query:  schemaEmpty  }), chatController.generateConversationChatbot, (req, res) => {    
});

router.get('/conversation/:id',authMiddleware.getAuth, validateRequest({ body: schemaEmpty, query:  ConversationHistoryQuerySchema, params: guidSchema }), chatController.getConversationHistoryById,  (req, res) => {
});

 
module.exports = router;