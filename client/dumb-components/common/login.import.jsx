let login = React.createClass({
  getInitialState() {
    return {
      email: '',
      password: ''
    }
  },
  changeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  },
  changePassword(e) {
    this.setState({
      password: e.target.value,
    });
  },
  handleLogin(e) {
    e.preventDefault();
    console.log(this.state);
  },
  render() {
    return (
      <div className="gray-bg">
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <div>
              <h2>旅行派商城</h2>
            </div>
            <p>登录</p>
            <form className="m-t" role="form">
              <div className="form-group">
                <input type="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.changeEmail} required="" />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.changePassword} required="" />
              </div>
              <button className="btn btn-primary block full-width m-b" onClick={this.handleLogin}>登录</button>

              <a href="#"><small>忘记密码?</small></a>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export const Login = login;