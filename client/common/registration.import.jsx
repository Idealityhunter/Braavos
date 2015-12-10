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
      // 输入的用户名
      name: "",
      // 输入的密码
      password: "",
      // 登录失败
      loginFailed: false
    }
  },

  propTypes: {
    // 通过旅行派账号的登录验证, 绑定商户账号
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
        // 返回的结果: {user: ..., username: ..., password: ...}
        // user是用户信息, seller是商户信息. 如果seller不为null, 说明已经绑定过了.
        this.props.onBindAccount({
          user: {userId: ret.user.userId}, seller: ret.seller, username: this.state.name,
          password: this.state.password
        });
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
      // 登录用户名(目前仅支持email)
      name: "",
      // 用户昵称
      nickname: "",
      // 密码
      password1: "",
      // 密码确认
      password2: "",
      // 店铺名称
      sellerName: "",
      // 两次输入的密码不匹配
      passwordNotAgree: false,
      // 哪一次输入的密码不符合, password1还是password2?
      passwordNotAgreeIndex: null,
      // email地址是否可用
      emailAvailable: true,
      // 登录名不符合要求
      invalidName: false,
      // 昵称不符合要求
      invalidNickname: false,
      // 密码不符合要求
      invalidPassword: false,
      // 哪一次输入的密码不正确, password1还是password2?
      invalidPasswordIndex: null,
      // 用户名已存在
      nameExists: false
    };
  },

  propTypes: {
    onCreateUser: React.PropTypes.func
  },

  _schema: (function () {
    return new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      nickname: {
        type: String,
        regEx: /^[\x21-\x7e\u4e00-\u9fa5]{2,32}$/
      }
    });
  })(),

  // 初始化overlay
  // * state: 使用哪个state来控制状态
  // * targetRef: 对应哪个component ref
  _overlayBuilder(state, targetRef, messageKey) {
    return <Overlay show={state} placement="right" target={() => ReactDOM.findDOMNode(this.refs[targetRef])}>
      <Tooltip id={Meteor.uuid()}>
        <FormattedMessage message={this.getIntlMessage("login.loginFailure")}/>
      </Tooltip>
    </Overlay>;
  },

  // 检查密码的有效性
  _checkPassword(source, password) {
    const state = {};
    let result = false;

    // 清除原有的overlay
    ["invalidPassword", "passwordNotAgree"].forEach(key => {
      state[key] = false;
      state[`${key}Index`] = null;
    });

    // 检查密码的有效性
    const re = /^[\x21-\x7e]{6,16}$/;
    if (!re.test(password)) {
      state.invalidPassword = true;
      state.invalidPasswordIndex = source;
    } else {
      const passwords = _.pick(this.state, "password1", "password2");
      passwords[source] = password;
      const {password1: p1, password2: p2} = passwords;
      if (p1 && p2 && p1 != p2) {
        // 当两个password都非空且不等的时候, 报告错误
        state.passwordNotAgree = true;
        state.passwordNotAgreeIndex = source;
      } else {
        result = true;
      }
    }

    return {result: result, state: state};
  },

  // 聚焦到某个input输入框
  _focusInput(refName) {
    setTimeout(() => {
      const inputNode = ReactDOM.findDOMNode(this.refs[refName]);
      const len = 1000;
      const input = $(inputNode).find("input")[0];
      //const input = $(inputNode).find("input[type=password]")[0];
      input.setSelectionRange(0, len);
      input.focus();
    }, 10);
  },

  onInputPassword(source, evt) {
    // 只处理密码
    if (!_.contains(["password1", "password2"], source)) {
      return;
    }
    const state = this._checkPassword(source, evt.target.value).state;
    state[source] = evt.target.value;
    this.setState(state);
  },

  onInputChange(source, evt) {
    const sourceList = ["name", "nickname"];
    if (!_.contains(sourceList, source)) {
      return;
    }

    // 清除overlay状态
    const state = {
      invalidName: false,
      invalidNickname: false,
      emailAvailable: true
    };
    const value = evt.target.value.trim();
    state[source] = value;

    // 有效性检查
    if (source === "name") {
      const ret = this._checkEmailInput(value);
      if (!ret) {
        state.invalidName = true
      }
    } else if (source === "nickname") {
      const ret = this._checkNickname(value);
      if (!ret) {
        state.invalidNickname = true
      }
    }

    this.setState(state);
  },

  onCreateUser(evt) {
    const email = this.state.name.trim();
    const nickname = this.state.nickname.trim();

    // 输入有效性检查
    // 检查密码
    for (const val of ["password1", "password2"]) {
      const state = this._checkPassword(val, this.state[val]).state;
      if (state.invalidPassword || state.passwordNotAgree) {
        this.setState(state);
        return;
      }
    }
    // 检查其它输入
    if (!this._checkEmailInput(email)) {
      this.setState({invalidName: true});
      this._focusInput("emailInput");
      return;
    }
    if (!this._checkNickname(nickname)) {
      this.setState({invalidNickname: true});
      this._focusInput("nicknameInput");
      return;
    }

    this._checkEmailAvailability(email, (err, ret) => {
      if (err || !ret) {
        this.setState({emailAvailable: false});
        this._focusInput("emailInput");
      } else {
        // 通过有效性检查, 开始创建用户
        if (this.props.onCreateUser) {
          this.props.onCreateUser({
            email: email,
            nickname: nickname,
            password: this.state.password1.trim()
          });
        }
      }
    })
  },

  // 检查email输入
  _checkEmailInput(email) {
    const objToValidate = {email: email};
    const ctx = this._schema.newContext();
    return ctx.validateOne(objToValidate, "email")
  },

  // 检查email是否有效
  _checkEmailAvailability(email, callback) {
    Meteor.call("account.checkEmailAvailability", email, callback);
  },

  // 检查昵称输入
  _checkNickname(nickname) {
    const objToValidate = {nickname: nickname};
    const ctx = this._schema.newContext();
    return ctx.validateOne(objToValidate, "nickname");
  },

  render() {
    // 密码输入控件
    const opts = {
      password1: {
        label: "密码",
        placeholder: "请输入密码"
      },
      password2: {
        label: "重复密码",
        placeholder: "请重新输入密码"
      }
    };
    const passwordInputs = _.keys(opts).map(key => {
      const value = opts[key];
      let overlay = null;
      let overlayMessage = null;
      if (this.state.invalidPassword && this.state.invalidPasswordIndex == key) {
        // 密码不合法
        overlayMessage = "密码必须是6~16位的字母, 数字或者英文符号";
      } else if (this.state.passwordNotAgree && this.state.passwordNotAgreeIndex == key) {
        // 密码不一致
        overlayMessage = "密码输入不一致";
      }
      if (!!overlayMessage) {
        overlay = (
          <Overlay show={true} placement="right" target={() => ReactDOM.findDOMNode(this.refs[key])}>
            <Tooltip id={Meteor.uuid()}>
              {overlayMessage}
            </Tooltip>
          </Overlay>
        );
      } else {
        overlay = <div/>;
      }
      return (
        <div>
          <Input type="password" label={value.label} labelClassName="col-xs-3" wrapperClassName="col-xs-9"
                 value={this.state[key]} onChange={this.onInputPassword.bind(this, key)}
                 placeholder={value.placeholder} ref={key}
          />
          {overlay}
        </div>
      )
    });

    return (
      <div style={{padding: "20px"}}>
        <form className="form-horizontal">
          <div>
            <Input type="text" label="Email" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
                   value={this.state.name} onChange={this.onInputChange.bind(this, "name")} ref="emailInput"
                   placeholder="请输入email地址"
            />
            {this.state.invalidName || !this.state.emailAvailable ?
            <Overlay show={true} placement="right" target={() => ReactDOM.findDOMNode(this.refs["emailInput"])}>
              <Tooltip id={Meteor.uuid()}>
                {this.state.invalidName ? "请输入正确的email地址" : "该email地址已经被注册"}
              </Tooltip>
            </Overlay> :
            <div></div>}
          </div>
          <div>
            <Input type="text" label="昵称" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
                   value={this.state.nickname} onChange={this.onInputChange.bind(this, "nickname")}
                   ref="nicknameInput" placeholder="请输入昵称"
            />
            {this.state.invalidNickname ?
            <Overlay show={true} placement="right" target={() => ReactDOM.findDOMNode(this.refs["nicknameInput"])}>
              <Tooltip id={Meteor.uuid()}>
                请输入正确的用户昵称
              </Tooltip>
            </Overlay> :
            <div></div>}
          </div>
          {passwordInputs[0]}
          {passwordInputs[1]}
          <div style={{margin: "20px 20px 20px"}}>
            <Button bsStyle="primary" block onClick={this.onCreateUser}>注册</Button>
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

  handleKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.onCreateSeller();
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
                 placeholder="" onKeyDown={this.handleKeyDown}/>

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
      userId: null,
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
    this.setState({userId: user.userId, username: username, password: password});
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

  // 创建旅行派账户和卖家账户
  handleCreateUser(user) {
    // 创建用户
    const {email, password, nickname} = user;
    Meteor.call("account.createUser", email, password, {nickname: nickname}, (err, ret) => {
      if (err) {
        console.log(`Failed to create user: ${err}`);
      } else {
        console.log(`Created new user`);
        const {userId, nickName: nickname} = ret;

        Meteor.call("marketplace.createSeller", {
          sellerId: userId,
          name: nickname
        }, (err, ret) => {
          if (!err && ret) {
            login(email, password);
          }
        });
      }
    })
  },

  // 创建卖家信息, 然后登录
  handleCreateSeller(info) {
    Meteor.call("marketplace.createSeller", {
      sellerId: this.state.userId,
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
            <h2>
              <FormattedMessage message={this.getIntlMessage('welcome')}/>
            </h2>
          </div>
          <Tabs defaultActiveKey={1}>
            <Tab eventKey={1} title="注册旅行派账号">
              <SignupWoLxp onCreateUser={this.handleCreateUser}/>
            </Tab>
            <Tab eventKey={2} title="已有旅行派账号">
              <SignupWithLxp onBindAccount={this.onBindAccount}/>
            </Tab>
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
