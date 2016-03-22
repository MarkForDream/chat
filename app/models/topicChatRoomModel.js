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

			members.push({
				user_id: req.user._id,
				inviter: req.user._id,
				status: CONSTANT.JOINED
			});

			for (var index in memberIdList) {
				
				members.push({
					user_id: memberIdList[index].memberId,
					inviter: req.user._id,
					status: CONSTANT.PENDING
				});
			}

			var topicChatRoom = new TopicChatRoom();
			topicChatRoom.title = body.title;
			topicChatRoom.description = body.description;
			topicChatRoom.creator = req.user._id;
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

TopicChatRoomModel.prototype.getMyTopicChatRooms = function(req, res, next) {
	TopicChatRoom.find({'creator': req.user._id})
			 .select({updated_at: false, __v: false})
	 		 .exec(function(err, topicChatRooms) {
					if (err) return res.json(ConfigError + ':' + err);
					req.topicChatRooms = topicChatRooms;

					return next();
				});
};

TopicChatRoomModel.prototype.getPublicChatRooms = function(req, res, next) {
	TopicChatRoom.find({'access': 1})
			 .select({updated_at: false, __v: false})
			 .exec(function(err, publicChatRooms) {
			 	if (err) return res.json(ConfigError + ':' + err);
			 	req.publicChatRooms = publicChatRooms;
			 	return next();
			 });
};

TopicChatRoomModel.prototype.getRelevantChatRooms = function(req, res, next) {
	TopicChatRoom.find({'members.user_id': req.user._id})
			 .select({updated_at: false, __v: false})
			 .exec(function(err, relevantChatRooms) {
			 	if (err) return res.json(ConfigError + ':' + err);
			 	req.relevantChatRooms = relevantChatRooms;
			 	return next();
			 });
};

TopicChatRoomModel.prototype.respondChatRoom = function(req, res, next) {
	
	req.checkBody('roomId', 'RoomId is required').notEmpty();
	req.checkBody('roomId', 'The format of roomId is invalid').validateMongoID();

	req.checkBody('roomStatus', 'Room status should be specified').notEmpty();
	req.asyncValidationErrors()
		.then(function() {
			TopicChatRoom.update({'_id': req.body.roomId, 'members.user_id': req.user._id}, {
				'$set': {'members.$.status': req.body.roomStatus}
			 })
			 .exec(function(err) {
			 	if(err) return res.json(ConfigError);

			 	return next();
			 });
		})
		.catch(function(err) {
			return res.json(ValidationErrorsResponse(err, {
				roomId: null,
				roomStatus: null
			}));
		});
	
};

TopicChatRoomModel.prototype.inviteIntoChatRoom = function(req, res, next) {
	req.checkBody('roomId', 'RoomId is required').notEmpty();
	req.checkBody('roomId', 'The format of roomId is invalid').validateMongoID();

	req.checkBody('inviteeId', 'InviteeId is required').notEmpty();
	req.checkBody('inviteeId', 'The format of inviteeId is invalid').validateMongoID();

	req.asyncValidationErrors()
		.then(function() {
			TopicChatRoom.findByIdAndUpdate(
				req.body.roomId,
				{
					$push: {
						"members": {
							user_id: req.body.inviteeId,
							inviter: req.user._id,
							status: CONSTANT.PENDING
						}
					}
				},
				{
					new : true
				},
				function(err, topicChatRoom) {
					if (err) return res.json(ConfigError);

					return next();
				}
			);
		})
		.catch(function(err) {
			return res.json(ValidationErrorsResponse(err, {
				roomId: null,
				inviteeId: null
			}));
		});
}

module.exports = new TopicChatRoomModel();