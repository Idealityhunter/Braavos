var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let login = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      userName: "",
      password: "",
      // 登录是否失败
      loginFailed: false,
      // 当前输入框是否具有焦点
      withFocus: false
    }
  },
  handleBlur(ref, evt) {
    this.setState({withFocus: false});
  },
  handleFocus(ref, evt) {
    if (!this.state.withFocus) {
      const node = ReactDOM.findDOMNode(this.refs[ref]);
      const len = evt.target.value.length * 2;
      setTimeout(()=> {
        node.setSelectionRange(0, len);
      }, 10);
    }
    this.setState({withFocus: true});
  },
  changeUserName(e) {
    this.setState({
      userName: e.target.value,
    });
  },
  changePassword(e) {
    this.setState({
      password: e.target.value,
    });
  },
  handleLogin(e) {
    e.preventDefault();
    console.log(`Trying to log in: ${this.state}`);

    const login = (user, password, callback) => {
      //create a login request with admin: true, so our loginHandler can handle this request
      const loginRequest = {user: user, password: password};

      //send the login request
      Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
      });
    };

    const {userName: user, password} = this.state;
    login(user, password, (ret) => {
      if (ret && ret.error) {
        console.log("login failed");

        // 登录失败
        this.setState({loginFailed: true});

        setTimeout(()=> {
          const passwordInput = ReactDOM.findDOMNode(this.refs['password-input']);
          const len = this.state.password.length * 2;
          passwordInput.setSelectionRange(0, len);
          passwordInput.focus();
        }, 10);
      } else {
        FlowRouter.go('home');
      }
    });
  },
  render() {
    const failureBanner = this.state.loginFailed ?
      <div className="alert alert-danger" style={{padding: "5px"}}>
        <FormattedMessage message={this.getIntlMessage("login.loginFailure")}/>
      </div>
      :
      <div />;

    const passwordStyle = this.state.loginFailed ? {border: "1px solid red"} : {};

    return (
      <div className="gray-bg">
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <div>
              <h2>
                <FormattedMessage message={this.getIntlMessage('welcome')}/>
              </h2>
            </div>
            {/*
             <p>
             <FormattedMessage message={this.getIntlMessage('login.login')}/>
             </p>
            */}
            <p>
              <br/>
            </p>
            {failureBanner}

            <form className="m-t" role="form">
              <div className="form-group">
                <input type="text" className="form-control" placeholder={this.getIntlMessage('login.userName')}
                       ref="user-input" value={this.state.userName} onChange={this.changeUserName} required=""
                       onClick={this.handleFocus.bind(this, "user-input")} onBlur={this.handleBlur}/>
              </div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder={this.getIntlMessage('login.password')}
                       ref="password-input" value={this.state.password} onChange={this.changePassword} required=""
                       style={passwordStyle} onClick={this.handleFocus.bind(this, "password-input")}
                       onBlur={this.handleBlur}/>
              </div>
              <button className="btn btn-primary block full-width m-b" onClick={this.handleLogin}>
                <FormattedMessage message={this.getIntlMessage('login.login')}/>
              </button>

              {/*
               <a href="#">
               <small>
               <FormattedMessage message={this.getIntlMessage('login.forgetPassword')}/>
               </small>
               </a>
              */}
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export const Login = login;