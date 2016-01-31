/**
 * 登录页面
 *
 * Created by zephyre on 1/31/16.
 */

import {
  createStore, combineReducers, Provider, connect, applyMiddleware, thunkMiddleware, createLogger
} from '/lib/redux'
import { Input, Button, Alert } from '/lib/react-bootstrap'

const { Map, fromJS } = Immutable;
import { Immutable } from '/lib/immutable'
import { TextField } from './login-field'

import { changeTextField, toggleAlert, login } from './action'

// 输入框的状态. 举例:
// { fieldName: { value: "this is the value" }}
const textFieldReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'CHANGE_TEXT_FIELD':
      // text field的内容发生了变化
      const {fieldRef, newValue} = action;
      return state.merge((new Map()).set(fieldRef, fromJS({value: newValue})));
    default:
      return state;
  }
};

// 其它状态
const miscReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      // 准备登录
      return state;
    case 'FINISH_LOGIN':
      // 登录成功
      FlowRouter.go('home');
      return state;
    case 'LOGIN_FAILED':
      // 登录失败
      return state.merge(fromJS({alert: true}));
    default:
      return state;
  }
};

const reducer = combineReducers({fields: textFieldReducer, misc: miscReducer});
const store = createStore(reducer, applyMiddleware(thunkMiddleware, createLogger()));

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    // text field中内容发生变化
    handleChange: (fieldRef, evt) => {
      const action = changeTextField(fieldRef, evt.target.value);
      dispatch(action);
    },
    // 用户点击了"登录"按钮
    handleLogin: (user, password) => {
      const action = login(user, password);
      dispatch(action);
    }
  };
};

Container = connect(mapStateToProps, mapDispatchToProps)(
  React.createClass({
    render() {
      // 是否显示登录失败的提示
      const alertStatus = this.props.misc.get('alert', false);
      const alertMessage = alertStatus ? <Alert bsStyle="danger" style={{padding: "8px"}}>登录失败 ;-(</Alert> :
        <div></div>;
      const name = this.props.fields.getIn(['name', 'value']);
      const password = this.props.fields.getIn(['password', 'value']);

      return (
        <div className="gray-bg">
          <div className="middle-box text-center loginscreen animated fadeInDown">
            <h2>欢迎来到商家管理系统</h2>
            <p><br /></p>
            {alertMessage}
            <form className="m-t" role="form">
              <TextField value={name}
                         handleChange={this.props.handleChange.bind(this, 'name')}
                         placeholder="Email/手机号码"/>
              <TextField value={password} inputType="password"
                         handleChange={this.props.handleChange.bind(this, 'password')}
                         placeholder="密码"/>
              <Button bsStyle="primary" block onClick={this.props.handleLogin.bind(this, name, password)}>
                登录</Button>
            </form>
          </div>
        </div>
      )
    }
  }));

export const Login = () => <Provider store={store}><Container /></Provider>;