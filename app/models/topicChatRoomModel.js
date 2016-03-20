var TopicChatRoom = require('../schemas/topicChatRoomSchema');
var CONSTANT = require('../constants/constant');
var Config = require('../../config/config');
var ConfigError = Config.error;
var ValidationErrorsResponse = require('../../config/error');
var TopicChatRoomModel = function() {};

TopicChatRoomModel.prototype.createTopicChatRoom = function(req, res, next) {
	var body = req.body;
	
	req.checkBody('title', 'Title is required.').notEmpty();
	req.checkBody('access', 'Access status should be specified.').notEmpty();

	req.sanitizeBody('title').trim();
	req.sanitizeBody('description').trim();

	req.asyncValidationErrors()
		.then(function() {

			var memberIdList = body.memberIdList;
			var members = [];

			for (var index in memberIdList) {
				
				var status = (memberIdList[index].memberId == req.user._id) ? CONSTANT.JOINED : CONSTANT.PENDING;
				
				members.push({
					user_id: memberIdList[index].memberId,
					inviter: req.user._id,
					status: status
				});
			}

			var topicChatRoom = new TopicChatRoom();
			topicChatRoom.title = body.title;
			topicChatRoom.description = body.description;
			topicChatRoom.creator = req.user.name;
			topicChatRoom.access = body.access;
			topicChatRoom.members = members;
			topicChatRoom.save(function(err) {
				if (err) return res.json(ConfigError);
				req.topicChatRoom = topicChatRoom;
				return next();
			});
		})
		.catch(function(err) {
			return res.json(ValidationErrorsResponse(err, {
				title: null,
				access: null
			}));
		});

};

TopicChatRoomModel.prototype.getTopicChatRooms = function(req, res, next) {
	TopicChatRoom.find({}, function(err, topicChatRooms) {
		if (err) return res.json(err);
		req.topicChatRooms = topicChatRooms;

		return next();
	});
};



module.exports = new TopicChatRoomModel();