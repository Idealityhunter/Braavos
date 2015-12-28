/**
 * 和即时通讯相关的model
 *
 * Created by zephyre on 12/26/15.
 */

const Talk = CoreModel.Talk = {};

/**
 * 消息数据结构
 */
Talk.Message = new SimpleSchema({
  /**
   * 表示该信息所属的会话(conversation ID), 类型为ObjectId
   */
  conversation: {
    type: Object
  },

  /**
   * 表示该信息在会话中的自增ID
   */
  msgId: {
    type: Number,
    min: 1
  },

  /**
   * 发送者的ID
   */
  senderId: {
    type: Number,
    min: 1
  },

  /**
   * 接收者的ID. 如果是单聊, 为接收者的用户ID; 如果是群聊, 为群的ID
   */
  receiverId: {
    type: Number,
    min: 1
  },

  /**
   * 能够接收到该消息的用户的ID
   */
  targets: {
    type: [Number],
    min: 1
  },

  /**
   * 消息的类型
   */
  msgType: {
    type: Number,
    min: 0
  },

  /**
   * 消息正文
   */
  contents: {
    type: String
  },

  /**
   * 消息的发送时间戳
   */
  timestamp: {
    type: Number,
    min: 0
  }
});

