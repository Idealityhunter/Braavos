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
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });
  },
  render() {
    return (
      <div className="gray-bg">
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <h2>旅行派商城</h2>
          </div>

          <p>创建账户</p>

          <form className="m-t" role="form" action="#">
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Name" required="" value={this.state.name}/>
            </div>
            <div className="form-group">
              <input type="email" className="form-control" placeholder="Email" required="" value={this.state.email}/>
            </div>
            <div className="form-group">
              <input type="password" className="form-control" placeholder="Password" required="" value={this.state.password}/>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Code" required="" value={this.state.code}/>
            </div>
            <div className="form-group">
              <input type="checkbox" className="i-checks" checked={this.state.agreePolicy}/><i>&nbsp;</i> 同意政策条款
            </div>
            <button type="submit" className="btn btn-primary block full-width m-b">注册</button>

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