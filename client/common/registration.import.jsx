/**
 * Braavos注册页面
 * Created by zephyre on 11/12/15.
 */

import {Tab, Tabs, Input, Button, Modal, Tooltip, Overlay, Label} from "/lib/react-bootstrap"
import {Avatar} from "/client/common/avatar";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;
const intlData = BraavosCore.IntlData.zh;

// 已有旅行派账号
const SignupWithLxp = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      name: "",
      password: "",
      loginFailed: false
    }
  },

  propTypes: {
    onBindAccount: React.PropTypes.func
  },

  onInputChange(source, evt) {
    // 取消可能的login错误
    this.setState({loginFailed: false});
    if (source == "name") {
      this.setState({name: evt.target.value});
    } else if (source == "password") {
      this.setState({password: evt.target.value});
    }
  },

  onBindAccount(evt) {
    // 验证密码是否正确
    Meteor.call("account.login", this.state.name, this.state.password, (err, ret) => {
      if (err || !ret) {
        // 验证未通过
        this.setState({loginFailed: true});
        // 重新输入
        setTimeout(() => {
          const inputNode = ReactDOM.findDOMNode(this.refs.passwordInput);
          const len = this.state.password.length * 2;
          const input = $(inputNode).find("input[type=password]")[0];
          input.setSelectionRange(0, len);
          input.focus();
        }, 10);
      } else if (this.props.onBindAccount) {
        // 返回的结果: {user: ..., seller: ..., username: ..., password: ...}
        // user是用户信息, seller是商户信息. 如果seller不为null, 说明已经绑定过了.
        this.props.onBindAccount(_.extend(ret, {username: this.state.name, password: this.state.password}));
      }
    });
  },

  render() {
    // 密码错误
    const passwordInput =
      <div>
        <Input type="password" label="密码" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
               value={this.state.password} onChange={this.onInputChange.bind(this, "password")}
               placeholder="密码" ref="passwordInput"/>
        <Overlay show={this.state.loginFailed} placement="right"
                 target={() => ReactDOM.findDOMNode(this.refs.passwordInput)}>
          <Tooltip id={Meteor.uuid()}>
            <FormattedMessage message={this.getIntlMessage("login.loginFailure")}/>
          </Tooltip>
        </Overlay>
      </div>;

    return (
      <div style={{padding: "20px"}}>
        <form className="form-horizontal">
          <Input type="text" label="账户名" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
                 value={this.state.name} onChange={this.onInputChange.bind(this, "name")}
                 placeholder="手机号码或email"/>
          {passwordInput}
          <div style={{margin: "20px 20px 20px"}}>
            <Button bsStyle="primary" block onClick={this.onBindAccount}>绑定</Button>
          </div>
        </form>
      </div>
    );
  }
});

const SignupWoLxp = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      name: "",
      password: "",
      password2: "",
      passwordNotAgree: false,
      agreePolicy: true
    };
  },

  onInputChange(source, evt) {
    this.setState({passwordNotAgree: false});
    if (source == "name") {
      this.setState({name: evt.target.value});
    } else if (source == "password") {
      this.setState({password: evt.target.value});
    } else if (source == "password2") {
      this.setState({password2: evt.target.value});
    }
  },

  onOK(evt) {
    // 验证密码是否一致
    if (this.state.password != this.state.password2) {
      this.setState({passwordNotAgree: true});
      // 重新输入
      setTimeout(() => {
        const inputNode = ReactDOM.findDOMNode(this.refs.passwordInput2);
        const len = this.state.password.length * 2;
        const input = $(inputNode).find("input[type=password]")[0];
        input.setSelectionRange(0, len);
        input.focus();
      }, 10);
    } else if (this.props.onOK) {
      this.props.onOK(evt);
    }
  },

  render() {
    const passwordInput =
      <div>
        <Input type="password" label="重复密码" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
               value={this.state.password2} onChange={this.onInputChange.bind(this, "password2")}
               placeholder="密码" ref="passwordInput2"
          />
        <Overlay show={this.state.passwordNotAgree} placement="right"
                 target={() => ReactDOM.findDOMNode(this.refs.passwordInput2)}>
          <Tooltip id={Meteor.uuid()}>
            密码不一致
          </Tooltip>
        </Overlay>
      </div>;

    return (
      <div style={{padding: "20px"}}>
        <form className="form-horizontal">
          <Input type="text" label="账户名" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
                 value={this.state.name} onChange={this.onInputChange.bind(this, "name")}
                 placeholder="手机号码或email"
            />
          <Input type="password" label="密码" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
                 value={this.state.password} onChange={this.onInputChange.bind(this, "password")}
                 placeholder="密码"
            />
          {passwordInput}

          <div style={{margin: "20px 20px 20px"}}>
            <Button bsStyle="primary" block onClick={this.onOK}>注册</Button>
          </div>
        </form>
      </div>
    );
  }
});

const ProfileEditor = React.createClass({
  getInitialState() {
    return {
      sellerName: this.props.sellerName || ""
    }
  },

  onInputChange(source, evt) {
    const state = {};
    state[source] = evt.target.value;
    this.setState(state);
  },

  onCreateSeller() {
    if (this.props.onCreateSeller) {
      this.props.onCreateSeller({sellerName: this.state.sellerName});
    }
  },

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onHide} bsSize="medium" ref="modal">
        <Modal.Header>
          <Modal.Title>完善商户信息</Modal.Title>
        </Modal.Header>

        <form className="form-horizontal" style={{padding: "20px"}}>

          <Input type="text" label="商户名称" labelClassName="col-xs-2" wrapperClassName="col-xs-8"
                 value={this.state.sellerName} onChange={this.onInputChange.bind(this, "sellerName")}
                 placeholder=""/>

          {/*<div id="avatar-box" className="hidden" style={{position: "relative", minHeight: "140px"}}>
           <Input type="text" label="用户头像" labelClassName="col-xs-2" wrapperClassName="col-xs-8 hidden"
           placeholder=""/>

           <div style={{position:"absolute", left: "16.66667%", top: "0px", padding: "7px 7px"}}>
           <Avatar
           imageUrl={"http://7sbm17.com1.z0.glb.clouddn.com/avatar/5449e679ea8f32eece8aff20290716e0?imageView2/2/w/128/h/128"}
           borderRadius={8} onChange={this.changeAvatar}
           stripLabel={"修改头像"}
           preloading={false}/>
           </div>
           </div>*/}
        </form>

        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onCreateSeller}>完成注册</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/**
 * 进行登录
 * @param user
 * @param password
 * @param callback
 */
const login = function (user, password, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  const loginRequest = {user: user, password: password};

  const cb = callback || function () {
      FlowRouter.go("home");
    };

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: cb
  });
};

// 提示用户已经绑定旅行派账号, 直接登录
const RedirectHome = React.createClass({
  onOK() {
    if (this.props.onOK) {
      this.props.onOK();
    }
  },

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onHide}>
        <Modal.Body>
          <p>已有旅行派账号, 无需绑定, 直接登录即可</p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onOK}>去首页</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

export const RegistrationLayout = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      showModal: false,
      showRedirectHome: false,

      // 绑定或注册得到的用户/商户信息
      user: null,
      seller: null,
      username: "",
      password: ""
    };
  },

  showProfileEditor() {
    this.setState({showModal: true})
  },

  // 绑定了旅行派账号
  onBindAccount(ret) {
    const {user, seller, username, password} = ret;
    this.setState({user: user, seller: seller, username: username, password: password});
    if (seller) {
      // 已有旅行派账号, 直接登录
      this.setState({showRedirectHome: true});
    } else {
      this.showProfileEditor();
    }
  },

  handleLogin() {
    login(this.state.username, this.state.password);
  },

  // 创建卖家信息, 然后登录
  handleCreateSeller(info) {
    Meteor.call("marketplace.createSeller", {
      sellerId: this.state.user.userId,
      name: info.sellerName
    }, err => {
      if (!err) {
        this.handleLogin();
      }
    });
  },

  render() {
    return (
      <div className="gray-bg">
        <div className="middle-box loginscreen text-center animated fadeInDown"
             style={{width: "440px", minWidth: "440px"}}>
          <div style={{marginBottom: "50px"}}>
            <h2>欢迎来到Braavos</h2>
          </div>
          <Tabs defaultActiveKey={1}>
            <Tab eventKey={1} title="已有旅行派账号">
              <SignupWithLxp onBindAccount={this.onBindAccount}/>
            </Tab>
            {/*<Tab eventKey={2} title="没有旅行派账号">
              <SignupWoLxp onOK={this.showProfileEditor}/>
            </Tab>*/}
          </Tabs>
        </div>
        <ProfileEditor showModal={this.state.showModal} onHide={() => this.setState({showModal: false})}
                       onCreateSeller={this.handleCreateSeller}/>
        <RedirectHome showModal={this.state.showRedirectHome}
                      onOK={this.handleLogin}
                      onHide={() => this.setState({showRedirectHome: false})}/>
      </div>
    );
  }
});
