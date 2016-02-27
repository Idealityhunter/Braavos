/**
 * 和login页面相关的action
 *
 * Created by zephyre on 1/31/16.
 */

/**
 * 设置用户名输入框
 * @param value
 * @returns {{type: string, value: *}}
 */
export const setUserNameInput = (value) => {
  return {
    type: 'SET_USER_NAME_INPUT',
    value: value
  };
};

/**
 * 设置密码输入框
 * @param value
 * @returns {{type: string, value: *}}
 */
export const setPasswordInput = (value) => {
  return {
    type: 'SET_PASSWORD_INPUT',
    value: value
  }
};

/**
 * 是否显示登录失败的提示
 * @param value true / false
 * @returns {{type: string, value: *}}
 */
export const setLoginFailedAlert = (value) => {
  return {
    type: 'SET_LOGIN_FAILED_ALERT',
    value: value
  }
};

/**
 * 更改一个TextField的值. 通常发生在用户输入的时候.
 *
 * @param fieldRef 内容发生变化的text field的ref
 * @param newValue text field的新内容
 * @returns {{type: string, fieldRef: *, newValue: *}}
 */
export const changeTextField = (fieldRef, newValue) => {
  return {
    type: 'CHANGE_TEXT_FIELD',
    fieldRef: fieldRef,
    newValue: newValue
  }
};

/**
 * 请求登录
 *
 * @param user
 * @param password
 * @returns {{type: string, user: *, password: *}}
 */
export const requestLogin = (user, password) => {
  return {
    type: 'REQUEST_LOGIN',
    user: user,
    password: password
  };
};

/**
 * 登录成功
 *
 * @returns {{type: string}}
 */
export const finishLogin = () => {
  return {
    type: 'FINISH_LOGIN'
  };
};

/**
 * 登录失败
 *
 * @param user
 * @param password
 * @returns {{type: string, user: *, password: *}}
 */
export const loginFailed = (user, password) => {
  return {
    type: 'LOGIN_FAILED',
    user: user,
    password: password
  };
};

/**
 * Asynchronous action: 尝试登陆
 *
 * @param user 用户名
 * @param password 密码
 * @returns {Function}
 */
export const login = (user, password) => {
  return dispatch => {
    dispatch(requestLogin(user, password));

    // 尝试登录
    //create a login request with admin: true, so our loginHandler can handle this request
    const loginRequest = {user: user, password: password};

    //send the login request
    Accounts.callLoginMethod({
      methodArguments: [loginRequest],
      userCallback: (ret) => {
        if (ret && ret.error) {
          // 登录失败
          dispatch(loginFailed(user, password));
        } else {
          // 登录成功
          dispatch(finishLogin());
        }
      }
    });
  }
};

