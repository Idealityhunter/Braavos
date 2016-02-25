/**
 * 和消息相关的发布
 * Created by lyn on 2/1/16.
 */

/**
 * 发布指定的会话
 * conversationIds: [conversationId] conversationId是conversation的ObjectId
 */
Meteor.publish("conversations", function (conversationIds) {
  console.log(conversationIds);
  const coll = BraavosCore.Database.Hedy.Conversation;
  const allowedFields = ['fingerprint'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  return coll.find({_id: {$in: conversationIds}}, {fields: fields});
});

/**
 * 发布个人的会话信息
 */
Meteor.publish("conversationViews", function (limit = 10) {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Hedy.ConversationView;
  const allowedFields = ['userId', 'conversationId', 'updateTime', 'notifyFlag', 'lastMessage', 'metadata'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  // 只看自己的会话
  return coll.find({userId: userId}, {fields: fields, limit: limit, sort: {updateTime: -1}});
  //return coll.find({}, {fields: fields, limit: limit});
});


/**
 * 发布对话相关的信息
 *
 * conversationId: ObjectId(...)
 * sort: 默认为发送时间的逆序
 */
Meteor.publish("messages", function (conversationId, limit = 10) {
  const conversation = new Mongo.ObjectID(conversationId);

  const coll = BraavosCore.Database.Hedy.Message;
  const allowedFields = ['msgId', 'conversation', 'senderId', 'receiverId', 'targets', 'msgType', 'contents', 'timestamp', 'read'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  // 只订阅相应conversation的信息
  return coll.find({conversation: conversation}, {fields: fields, limit: limit, sort:{timestamp: -1}});
  //return coll.find({}, {fields: fields, limit: limit, sort:{timestamp: -1}});
});

/**
 * TODO 发布所有系统通知类的消息
 * 发布交易信息
 *
 * conversationId: ObjectId(...)
 * sort: 默认为发送时间的逆序
 */
Meteor.publish("orderMsgs", function (limit = 10) {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Hedy.Message;
  const allowedFields = ['msgId', 'conversation', 'senderId', 'receiverId', 'targets', 'msgType', 'contents', 'timestamp', 'read'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  // 只订阅本人的消息
  return coll.find({receiverId: userId, msgType: 20}, {fields: fields, limit: limit, sort:{timestamp: -1}});
});