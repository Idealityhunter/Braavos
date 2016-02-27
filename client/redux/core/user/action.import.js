/**
 * 和用户数据相关的action
 *
 * Created by zephyre on 2/27/16.
 */


/**
 * 设置当前用户
 *
 * @param userId
 * @returns {{type: string, value: *}}
 */
export const setCurrentUserId = (userId) => {
  return {
    type: 'SET_CURRENT_USER_ID',
    userId: userId
  };
};

/**
 * 订阅用户
 *
 * @returns {{type: string, value: *}}
 * @param userIds
 */
export const subscribeUserIds = (userIds) => {
  return {
    type: 'SUBSCRIBE_USERS',
    userIds: userIds
  };
};

/**
 * 取消订阅用户
 *
 * @returns {{type: string, value: *}}
 * @param userIds
 */
export const unsubscribeUserIds = (userIds) => {
  return {
    type: 'UNSUBSCRIBE_USERS',
    userIds: userIds
  };
};

/**
 * 订阅商家
 *
 * @returns {{type: string, value: *}}
 * @param userIds
 */
export const subscribeSellerIds = (userIds) => {
  return {
    type: 'SUBSCRIBE_SELLERS',
    userIds: userIds
  };
};

/**
 * 取消订阅商家
 *
 * @returns {{type: string, value: *}}
 * @param userIds
 */
export const unsubscribeSellerIds = (userIds) => {
  return {
    type: 'UNSUBSCRIBE_SELLERS',
    userIds: userIds
  };
};