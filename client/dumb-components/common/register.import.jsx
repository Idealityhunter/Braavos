let register = React.createClass({
  getInitialState() {
    return {
      name: '',
      email: '',
      password: '',
      agreePolicy: false,
      code: ''
    }
  },
  componentDidMount() {
    // Initialize i-check plugin
    let self = this;
    $('.agree-policy').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    }).on('ifToggled', function(event) {
      self.setState({
        agreePolicy: !self.state.agreePolicy
      });
    });
  },
  componentWillUnmount() {
    $('.agree-policy').iCheck('destroy');
  },
  changeName(e) {
    this.setState({
      name: e.target.value,
    });
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
  handleRegister(e) {
    e.preventDefault();
    console.log(this.state);
  },
  render() {
    console.log('re render');
    return (
      <div className="gray-bg">
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <h2>旅行派商城</h2>
          </div>

          <p>创建账户</p>

          <form className="m-t" role="form" action="#">
            <div className="form-group" ref='xxx'>
              <input type="text" className="form-control" placeholder="Name" required="" onChange={this.changeName} value={this.state.name}/>
            </div>
            <div className="form-group">
              <input type="email" className="form-control" placeholder="Email" required="" onChange={this.changeEmail} value={this.state.email}/>
            </div>
            <div className="form-group">
              <input type="password" className="form-control" placeholder="Password" required="" onChange={this.changePassword}value={this.state.password}/>
            </div>
            <div className="form-group">
              <input type="checkbox"
                     className="agree-policy"
                     defaultChecked={this.state.agreePolicy} /><i>&nbsp;</i> 同意政策条款
            </div>
            <button type="btn"
                    className="btn btn-primary block full-width m-b"
                    onClick={this.handleRegister}>注册</button>

            <p className="text-muted text-center">
              <small>已经有帐号?</small>
            </p>
            <a className="btn btn-sm btn-white btn-block" href="/login">登录</a>
          </form>
        </div>
      </div>
    );
  }
});

export const Register = register;