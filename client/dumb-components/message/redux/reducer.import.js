/**
 * 和消息页相关的reducer
 *
 * 有下列remote states需要保存(这部分状态, 使用Meteor本身的机制来管理):
 * - conversationList 当前会话列表
 * - [msgList] 会话的消息列表
 *
 * 有下列local states需要保存(使用redux来管理):
 * - activeConversation 当前会话ID
 * - conversationLimit 会话列表的Limit
 * - messageLimits: {conversationId: msgLimit} 会话的消息列表的Limit
 * - postedMessages: {msgId: msgContent} 发送的消息
 * - pendingMessages: {cId: [msgId]} Pending消息
 * - failedMessages: {cId: [msgId]} Failed消息
 * - inputValue 用户输入的消息
 *
 * Created by lyn on 2/15/16.
 */

import { fromJS, Map, List, Set } from '/lib/immutable'

/**
 * 和文本框相关的reducer
 */
export const inputReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      // 输入框内容改动
      return action.content ? fromJS({}).set('inputValue', action.content) : fromJS({});
    case 'RESET_INPUT_VALUE':
      return fromJS({});
    default:
      return state;
  }
};

/**
 * 和会话相关的reducer
 */
const defaultConversationLimit = 10;
export const conversationReducer = (state = fromJS({conversationLimit: defaultConversationLimit}), action) => {
  switch (action.type) {
    // 设置会话的数目限制
    case 'SET_CONVERSATION_LIMIT':
      return action.limit ? state.set('conversationLimit', action.limit) : state.set('conversationLimit', defaultConversationLimit);

    // 设置当前回话
    case 'SET_ACTIVE_CONVERSATION':
      return action.conversationId ? state.set('activeConversationId', action.conversationId) : state.set('conversationId', null);

    default:
      return state;
  }
};

/**
 * 和消息相关的reducer
 */

//TODO 初始值应该在模板里有吧? 是根据当前conversationLimit得到的MsgLimit的key

const defaultMessageLimit = 10;
export const messageReducer = (state = fromJS({messageLimits:{}, postedMessages: {}, pendingMessages: {}, failedMessages: {}}), action) => {
  switch (action.type) {
    // 设置会话的消息的数目限制
    case 'SET_MESSAGE_LIMIT':
      return action.limit && action.conversationId ? state.set('messageLimits', state.get('messageLimits').set(action.conversationId, action.limit)) : state;

    // 发送消息: 添加新消息,并加入pending集合
    case 'POST_MESSAGE':
      const msgId = action.msg._id._str;

      // 插入 postedMessage
      const tempState = state.set('postedMessages', state.get('postedMessages').set(msgId, fromJS(action.msg)));

      // 插入 pendingMessage
      const pendingMessages = tempState.getIn(['pendingMessages', action.conversationId], Set);
      return tempState.setIn(['pendingMessages', action.conversationId], pendingMessages.add(msgId));

    // 改变发送消息的状态
    case 'SET_MESSAGE_STATUS':
      switch (action.status) {
        case 'success':
          // 删除 pendingMessage
          const tempState = state.setIn(['pendingMessages', action.conversationId], state.getIn(['pendingMessages', action.conversationId]).delete(action.msgId));

          // 删除 postedMessage
          return tempState.set('postedMessages', tempState.get('postedMessages').delete(action.msgId));

        case 'fail':
          // 插入 failedMessage
          const failedMessages = state.getIn(['failedMessages', action.conversationId], Set);
          const tempState = state.setIn(['failedMessages', action.conversationId], failedMessages.add(action.msgId));

          // 删除 pendingMessage
          return tempState.setIn(['pendingMessages', action.conversationId], tempState.getIn(['pendingMessages', action.conversationId]).delete(action.msgId));

        default:
          return state;
      }
    default:
      return state;
  }
};