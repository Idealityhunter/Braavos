/**
 * 和消息页相关的action
 *
 * Created by lyn on 2/15/16.
 */

/**
 * 输入发送框内容
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
 * 清除发送框内容
 * @returns {{type: string}}
 */
export const resetInputValue = () => {
  return {
    type: 'RESET_INPUT_VALUE'
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
 * 重置会话列表的数目限制
 * @returns {{type: string}}
 */
export const resetConversationLimit = () => {
  return {
    type: 'RESET_CONVERSATION_LIMIT'
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
 * 重置当前会话
 * @returns {{type: string}}
 */
export const resetActiveConversation = () => {
  return {
    type: 'RESET_ACTIVE_CONVERSATION'
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
 * 重置会话的消息的数目限制
 * @param conversationId
 * @returns {{type: string, conversationId: *}}
 */
export const resetMessageLimit = (conversationId) => {
  return {
    type: 'RESET_MESSAGE_LIMIT',
    conversationId: conversationId
  }
};

/**
 * 添加pendingMessage
 * @param conversationId
 * @param msg
 * @returns {{type: string, conversationId: *, msg: *}}
 */
export const postMessage = (conversationId, msg) => {
  return {
    type: 'POST_MESSAGE',
    conversationId: conversationId,
    msg: msg
  }
};

/**
 * 修改pendingMessage的状态 :
 *    success => 从队列中删除
 *    fail => 移到failMessage队列
 * @param conversationId
 * @param msg
 * @param status
 * @returns {{type: string, conversationId: *, msg: *, status: *}}
 */
export const setMessageStatus = (conversationId, msg, status) => {
  return {
    type: 'SET_MESSAGE_STATUS',
    conversationId: conversationId,
    msg: msg,
    status: status
  }
};
