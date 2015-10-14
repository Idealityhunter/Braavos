BaiscForm = React.createClass({
  componentDidMount() {
    // Initialize i-check plugin
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });
  },
  submit(e) {
    e.preventDefault();
    console.log(BusinessSchema);
    console.log('clicked');
  },
  render() {
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-lg-7">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>商家注册
                  <small>商家信息</small>
                </h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <form role="form">
                    <div className="form-group">
                      <label>名称</label>
                      <input type="email" placeholder="商家名称" className="form-control"/>
                    </div>
                    <div className="form-group">
                      <label>地址</label>
                      <input type="password" placeholder="商家地址" className="form-control"/>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit"
                              onClick={this.submit}>
                        <strong>提交信息</strong>
                      </button>
                      <label>
                        <input type="checkbox" className="i-checks" checked/> 同意XXX规定
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});