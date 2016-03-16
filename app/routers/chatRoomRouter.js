var TopicChatRoomModel = require('../models/topicChatRoomModel');
var middleware = require('../../config/middleware');

module.exports = function(express) {
	var router = express.Router();
	router.post('/createTopicChatRoom', middleware.authentication, TopicChatRoomModel.createTopicChatRoom, function(req, res) {
		console.log(req.topicChatRoom);
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

	router.post('/getMyTopicChatRooms', function(req, res) {
		console.log(res.topicChatRooms);
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	router.post('/getPublicChatRooms', function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	router.post('/getRelevantChatRooms', function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	router.post('/joinChatRoom', function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});
	router.post('/declineChatRoom', function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	router.post('/inviteIntoChatRoom', function(req, res) {
		res.json({
			status: true,
			result: {
				"msg": "Successfully Created Chat Room"
			}
		});
	});

	return router;
};