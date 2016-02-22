/**
 * 和消息页相关的action
 *
 * Created by lyn on 2/15/16.
 */

/**
 * 设置发送框内容
 * @param content
 * @returns {{type: string, content: *}}
 */
export const setInputValue = (content) => {
  return {
    type: 'SET_INPUT_VALUE',
    content: content
  }
};

/**
 * 设置会话列表的数目限制
 * @param limit
 * @returns {{type: string, limit: *}}
 */
export const setConversationLimit = (limit) => {
  return {
    type: 'SET_CONVERSATION_LIMIT',
    limit: limit
  }
};

/**
 * 设置当前会话
 * @param conversationId
 * @returns {{type: string, conversationId: *}}
 */
export const setActiveConversation = (conversationId) => {
  return {
    type: 'SET_ACTIVE_CONVERSATION',
    conversationId: conversationId
  }
};

/**
 * 设置会话的消息的数目限制
 * @param conversationId
 * @param limit
 * @returns {{type: string, conversationId: *, limit: *}}
 */
export const setMessageLimit = (conversationId, limit) => {
  return {
    type: 'SET_MESSAGE_LIMIT',
    conversationId: conversationId,
    limit: limit
  }
};


/**
 * 添加pendingMessage
 * @param msg
 * @returns {{type: string, msg: *, conversationId: *}}
 */
export const postMessage = (msg, conversationId) => {
  return {
    type: 'POST_MESSAGE',
    msg: msg,
    conversationId: conversationId
  }
};

/**
 * 修改pendingMessage的状态 :
 *    success => 从队列中删除
 *    fail => 移到failMessage队列
 * @param msg
 * @param status
 * @returns {{type: string, conversationId: *, msg: *, status: *}}
 */
export const setMessageStatus = (msgId, conversationId, status) => {
  return {
    type: 'SET_MESSAGE_STATUS',
    msgId: msgId,
    conversationId: conversationId,
    status: status
  }
};


export const addConversationList = () => {
  return {
    type: ''
  }
}