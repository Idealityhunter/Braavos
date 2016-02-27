/**
 * 登录页面
 *
 * Created by zephyre on 1/31/16.
 */

import {
  connect, applyMiddleware, thunkMiddleware, createLogger
} from '/lib/redux'
import { Input, Button, Alert } from '/lib/react-bootstrap'

import {Immutable} from '/lib/immutable'
import {TextField} from './login-field'
import {store} from '/client/redux/store'
import {Provider} from '/lib/redux'

import {setUserNameInput, setPasswordInput, setLoginFailedAlert} from '/client/redux/components/login/action'

const mapStateToProps = (state) => {
  return {
    redux: state.getIn(['components', 'login'], Immutable.fromJS({}))
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // 输入用户名
    handleUseNameChange: (value) => dispatch(setUserNameInput(value)),
    // 输入密码
    handlePasswordChange: (value) => {
      dispatch(setPasswordInput(value));
      // 清除登录失败的提示
      dispatch(setLoginFailedAlert(false));
    },
    // 用户点击了"登录"按钮
    handleLogin: (user, password) => {
      BraavosCore.logger.debug(`Trying to login with user: ${user}, password: ${password}`);

      // 尝试登录
      //create a login request with admin: true, so our loginHandler can handle this request
      const loginRequest = {user, password};

      //send the login request
      Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: (ret) => {
          if (ret && ret.error) {
            // 登录失败
            dispatch(setLoginFailedAlert(true));
          } else {
            // 登录成功
            FlowRouter.go('home')
          }
        }
      });
    }
  };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(
  (props) => {
    // 是否显示登录失败的提示
    const alertStatus = props.redux.get('loginFailed', false);
    const alertMessage = alertStatus ? <Alert bsStyle="danger" style={{padding: "8px"}}>登录失败 ;-(</Alert> :
      <div></div>;
    const name = props.redux.get('userName', '');
    const password = props.redux.get('password', '');

    return (
      <div className="gray-bg">
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <h2>欢迎来到商家管理系统</h2>
          <p><br /></p>
          {alertMessage}
          <form className="m-t" role="form">
            <TextField value={name}
                       handleChange={props.handleUseNameChange}
                       placeholder="Email/手机号码"/>
            <TextField value={password} inputType="password"
                       handleChange={props.handlePasswordChange}
                       placeholder="密码"/>
            <Button bsStyle="primary" block onClick={() => {
              const user = props.redux.get('userName', '');
              const password = props.redux.get('password', '');
              props.handleLogin(user, password);
            }}>登录</Button>
          </form>
        </div>
      </div>
    );
    //}
  });

export const Login = () => <Provider store={store}><Container /></Provider>;
