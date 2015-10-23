var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let login = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return {
      userName: '',
      password: ''
    }
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
    login(user, password, () => {
      FlowRouter.go('home')
    });
  },
  render() {
    return (
      <div className="gray-bg">
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <div>
              <h2>
                <FormattedMessage message={this.getIntlMessage('welcome')}/>
              </h2>
            </div>
            <p>
              <FormattedMessage message={this.getIntlMessage('login.login')}/>
            </p>
            <form className="m-t" role="form">
              <div className="form-group">
                <input type="text" className="form-control" placeholder={this.getIntlMessage('login.userName')}
                       value={this.state.userName} onChange={this.changeUserName} required=""/>
              </div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder={this.getIntlMessage('login.password')}
                       value={this.state.password} onChange={this.changePassword} required=""/>
              </div>
              <button className="btn btn-primary block full-width m-b" onClick={this.handleLogin}>
                <FormattedMessage message={this.getIntlMessage('login.login')}/>
              </button>

              <a href="#">
                <small>
                  <FormattedMessage message={this.getIntlMessage('login.forgetPassword')}/>
                </small>
              </a>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export const Login = login;