var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
import {TextEditor} from 'client/dumb-components/common/text-editor';

let accountBasic = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getMeteorData() {
    Meteor.subscribe('basicUserInfo');
    const userInfo = BraavosCore.Database['Yunkai']['UserInfo'].findOne() || {};

    //// TODO 需要更细致的处理图像的方法. 考虑各种情况, 比如avatar是一个key等.
    //if (userInfo && userInfo.avatar) {
    //  userInfo.avatar += '?imageView2/2/w/48/h/48';
    //} else {
    //  userInfo.avatar = "http://www.lvxingpai.com/app/download/images/appdownload/logo.png"
    //}
    return {
      userInfo: userInfo
    };
  },

  componentDidMount() {
    $('.modify-text').on('click', function (e) {
      const thisElem = e.target;
      const text = (thisElem.tagName == 'A') ? thisElem.previousElementSibling : thisElem.parentNode;
      const $textDiv = $(text).children('div');
      const $textInput = $(text).children('input, textarea');
      $textDiv.addClass('hide');
      $textInput.removeClass('hide').focus();

      // 光标置于末尾
      const strLen = $textInput.val().length * 2;
      $textInput[0].setSelectionRange(0, strLen);

      $textInput.off('blur');
      $textInput.on('blur', function (e) {
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
    const prefix = 'accountInfo.basicTab';
    return (
      <div className="account-basic-wrap row">
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.realName`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.realName`)}/>
          </div>
          <hr />
          <div className="form-group avatar">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.avatar`)}/>
            </label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <img
                src="https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/super/whfpf%3D425%2C260%2C50/sign=03ade0c33f12b31bc7399e69e0250248/7e3e6709c93d70cf4be7d689fedcd100baa12b10.jpg"/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.changeAvatar}>修改</a>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.tel`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.tel`)}/>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.email`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.email`)}/>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.lang`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.lang`)}/>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.shop`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.shop`)}/>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.zone`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.shop`)}/>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.address`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.address`)}/>
          </div>
        </div>
      </div>
    );
  }
});

export const AccountBasic = accountBasic;
