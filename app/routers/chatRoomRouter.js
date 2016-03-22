var TopicChatRoomModel = require('../models/topicChatRoomModel');
var middleware = require('../../config/middleware');

module.exports = function(express) {
	var router = express.Router();
	router.post('/createTopicChatRoom', middleware.authentication, TopicChatRoomModel.createTopicChatRoom, function(req, res) {
		
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	router.post('/updateTopicChatRoomInfo', function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	router.post('/getMyTopicChatRooms', middleware.authentication, TopicChatRoomModel.getMyTopicChatRooms, function(req, res) {
		console.log(res.topicChatRooms);
		res.json({
			status: true,
			result: {
				"msg": "Successfully get topic chatrooms",
				"topicChatRoomList":  req.topicChatRooms
			}
		});
	});

	router.post('/getPublicChatRooms', middleware.authentication, TopicChatRoomModel.getPublicChatRooms, function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully get public chatrooms",
				"publicRoomList": req.publicChatRooms
			}
		});
	});

	router.post('/getRelevantChatRooms', middleware.authentication, TopicChatRoomModel.getRelevantChatRooms, function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully get relevant chatrooms",
				"relevantChatRoomList": req.relevantChatRooms
			}
		});
	});

	router.post('/respondChatRoom', middleware.authentication, TopicChatRoomModel.respondChatRoom, function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully respond to the chatroom"
			}
		});
	});

	router.post('/inviteIntoChatRoom', middleware.authentication, TopicChatRoomModel.inviteIntoChatRoom, function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully invite into the chatroom"
			}
		});
	});

	return router;
};