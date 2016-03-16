var TopicChatRoom = require('./topicChatRoomSchema');
var Config = require('../../config/config');
var ConfigError = Config.error;
var TopicChatRoomModel = function() {};

TopicChatRoomModel.prototype.createTopicChatRoom = function(req, res, next) {
	var body = req.body;
	
	var memberIdList = body.memberIdList;
	// console.log("memberIdList::" + JSON.stringify(memberIdList));
	var members = [];

	for (var index in memberIdList) {
		
		var status = memberIdList[index].memberId == "Mark" ? 0 : 2;
		
		members.push({
			user_id: memberIdList[index].memberId,
			inviter: "Mark",
			status: status
		});
	}

	var topicChatRoom = new TopicChatRoom();
	topicChatRoom.title = body.title;
	topicChatRoom.description = body.description;
	// topicChatRoom.creator = "mark";
	topicChatRoom.creator = "Mark";
	topicChatRoom.access = body.access;
	topicChatRoom.members = members;
	topicChatRoom.save(function(err) {
		console.error(err);
		if (err) return res.json(ConfigError);
		req.topicChatRoom = topicChatRoom;
		return next();
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