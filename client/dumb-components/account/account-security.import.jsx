var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

import {TextField} from "/client/components/textfield/textfield"
import {Button, Tabs, Tab} from "/lib/react-bootstrap"

const ChangePassword = React.createClass({
  getInitialState() {
    return {
      oldPassword: "",
      password: "",
      password2: "",
      buttonEnabled: true,
      authFailed: false
    }
  },


  handleChange(source, event) {
    const state = {};
    state[source] = event.value;
    // 清除原始密码输入错误的标识
    if (source == "oldPassword") {
      state.authFailed = false;
    }
    this.setState(state);
  },

  handleChangePassword() {
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.password;
    const newPassword2 = this.state.password2;

    if (newPassword == newPassword2 && this._checkPassword(newPassword)) {
      this.setState({buttonEnabled: false});
      Meteor.call("account.changePassword", oldPassword, newPassword, (err, ret) => {
        if (err) {
          this.setState({authFailed: true});

          const inputNode = ReactDOM.findDOMNode(this.refs["old-password"]);
          const len = oldPassword.length * 2;
          setTimeout(() => {
            const node = $(inputNode).find("input")[0];
            node.setSelectionRange(0, len);
            node.focus();
          }, 10);
        } else {
          swal({
            title: "密码修改成功!",
            timer: 2000,
            showConfirmButton: true,
            confirmButtonText: "关闭",
            type: "success"
          });
          this.setState({oldPassword: "", password: "", password2: ""})
        }
        this.setState({buttonEnabled: true});
      })
    }
  },

  // 检查密码是否有效
  _checkPassword(password) {
    const re = /^[\x21-\x7e]{6,16}$/;
    return re.test(password);
  },

  render (){
    return (
      <form className="form-horizontal">
        <TextField label="原密码" placeholder="请输入原密码" onChange={this.handleChange.bind(this, "oldPassword")}
                   labelClassName="col-xs-3 col-sm-2 col-md-1" wrapperClassName="col-xs-4 col-sm-3 col-md-2"
                   overlayMessage="密码输入有误" showOverlay={this.state.authFailed} ref="old-password"
                   type="password" value={this.state.oldPassword}/>
        <TextField label="新密码" placeholder="请输入新密码" onChange={this.handleChange.bind(this, "password")}
                   labelClassName="col-xs-3 col-sm-2 col-md-1" wrapperClassName="col-xs-4 col-sm-3 col-md-2"
                   overlayMessage="密码为6~16位的字母, 数字或英文字符"
                   showOverlay={!!this.state.password && !this._checkPassword(this.state.password)}
                   type="password" value={this.state.password}/>
        <TextField label=" " placeholder="请再次输入新密码" onChange={this.handleChange.bind(this, "password2")}
                   labelClassName="col-xs-3 col-sm-2 col-md-1" wrapperClassName="col-xs-4 col-sm-3 col-md-2"
                   overlayMessage="两次输入的密码不一致"
                   showOverlay={!!this.state.password && !!this.state.password2 && this.state.password != this.state.password2}
                   type="password" value={this.state.password2}/>
        {
          this.state.buttonEnabled ?
          <Button bsStyle="primary" onClick={this.handleChangePassword}>修改密码</Button> :
          <Button bsStyle="primary" onClick={this.handleChangePassword} disabled>修改密码</Button>
          }
      </form>
    )
  }
});

export const AccountSecurity = React.createClass({
  render() {
    return (
      <Tabs defaultActiveKey="changePassword">
        <Tab eventKey="changePassword" title="修改密码">
          <div className="panel-body">
            <ChangePassword/>
          </div>
        </Tab>
      </Tabs>
    )
  }
});
