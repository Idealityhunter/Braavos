var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let accountBasic = React.createClass({
  mixins: [IntlMixin],
  componentDidMount() {
    $('.modify-text').on('click', function(e){
      let text = e.target.previousElementSibling;
      let $textDiv = $(text).children('div');
      let $textInput = $(text).children('input, textarea');
      $textDiv.addClass('hide');
      $textInput.removeClass('hide').focus();
      $textInput.off('blur');
      $textInput.on('blur', function(e){
        $textDiv.text(e.target.value).removeClass('hide');
        $textInput.addClass('hide');
      });
    });
  },
  changeAvatar (e){
    console.log(e);
    // TODO 上传图片
  },
  render() {
    return (
      <div className="account-basic-wrap row">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">真实姓名</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border height-auto">王老五</div>
              <input className="form-control hide" placeholder="请输入您的姓名" defaultValue="王老五"/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.handleClick}>修改</a>
          </div>
          <hr />
          <div className="form-group avatar">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">照片</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <img src="https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/super/whfpf%3D425%2C260%2C50/sign=03ade0c33f12b31bc7399e69e0250248/7e3e6709c93d70cf4be7d689fedcd100baa12b10.jpg" />
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.changeAvatar}>修改</a>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">联系方式</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border height-auto">13612345678</div>
              <input className="form-control hide" placeholder="请输入您的手机号" defaultValue="13612345678"/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.handleClick}>修改</a>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">Email</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border height-auto">2123456789@qq.com</div>
              <input type="email" className="form-control hide" id="inputEmail3" placeholder="请输入您的Email" defaultValue="2123456789@qq.com"/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.handleClick}>修改</a>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">服务语言</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border height-auto">英语</div>
              <input className="form-control hide" placeholder="请选择您的服务语言" defaultValue="英语"/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.handleClick}>修改</a>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">店名</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border">
              无敌淘宝店
              </div>
            </div>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">所在地</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border">
              爪哇理想国
              </div>
            </div>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">详细地址</label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <div className="form-control no-border height-auto">石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方</div>
              <textarea className="form-control hide" placeholder="请输入您的联系地址" defaultValue="石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方石板桥老城角回忆的老地方"/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.handleClick}>修改</a>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">保存</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export const AccountBasic = accountBasic;
