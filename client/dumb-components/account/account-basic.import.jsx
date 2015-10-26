import {TextEditor} from 'client/dumb-components/common/text-editor';
import {GoogleMapComponent} from 'client/dumb-components/common/googlemaps';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

export const AccountBasic = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState() {
    // 每个TextEditor, 都需要维护这些状态
    const TextEditorState = function () {
      // 文本框处于编辑状态时的值
      this.text = "";
      // 原始数据
      this.original = false;
      // 上一次更新的值. 每次blur的时候, 将检查这一数值.
      // 只有当二者不一致的时候, 才会真正执行提交的操作
      this.lastSubmit = undefined;
    };

    return {
      nickname: new TextEditorState(),
      tel: new TextEditorState(),
      email: new TextEditorState(),
      address: new TextEditorState()
    }
  },

  // TextEditor中文本发生变化的事件
  handleChange(event) {
    const key = event.key;
    const state = _.pick(this.state, key);
    state[key].text = event.newText;
    this.setState(state);
  },

  // TextEditor接收到焦点, 需要将原始的数据保存下来, 以备将来esc的时候使用
  handleFocus(event, dataFunc) {
    const key = event.key;
    const state = _.pick(this.state, key);
    state[key].original = dataFunc();
  },

  handleSubmit(event, submitFunc) {
    const key = event.key;
    const state = _.pick(this.state, key);
    //state[key].editing = false;
    if (state[key].lastSubmit != state[key].text) {
      submitFunc(state[key].text);
      state[key].lastSubmit = state[key].text;
    }
    this.setState(state);
  },

  // TextEditor被点击, 进入编辑状态
  handleClick(event, datafunc) {
    const key = event.key;
    const state = _.pick(this.state, key);
    state[key].text = datafunc();
    //state[key].editing = true;
    this.setState(state);
  },

  getMeteorData() {
    Meteor.subscribe('basicUserInfo');
    Meteor.subscribe('sellerInfo');

    const userId = parseInt(Meteor.userId());
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: userId}) || {};

    // TODO 需要更细致的处理图像的方法. 考虑各种情况, 比如avatar是一个key等.
    if (userInfo && userInfo.avatar) {
      userInfo.avatar = userInfo.avatar.indexOf("qiniudn") ? `${userInfo.avatar}?imageView2/2/w/128/h/128` : userInfo.avatar;
    } else {
      userInfo.avatar = "http://www.lvxingpai.com/app/download/images/appdownload/logo.png"
    }

    const sellerInfo = BraavosCore.Database.Braavos.SellerInfo.findOne({userId: userId}) || {};
    if (!sellerInfo.contact) {
      sellerInfo.contact = {number: ""};
    }

    return {
      userInfo: userInfo,
      sellerInfo: sellerInfo
    };
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
              <FormattedMessage message={this.getIntlMessage(`${prefix}.nickname`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.nickname`)}
                        id="nickname"
                        label={this.data.userInfo.nickName}
                        text={this.state.nickname.text}
                        onClick={event=>this.handleClick(event, ()=>this.data.userInfo.nickName)}
                        onChange={this.handleChange}
                        onFocus={event=>this.handleFocus(event, ()=>this.data.userInfo.nickName)}
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.basicInfo.update", Meteor.userId(), {nickName: this.state.nickname.text});
                        })}
              />
          </div>
          <hr />
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
                src={this.data.userInfo.avatar}/>
            </div>
            <a href="javascript:void(0)" className="modify-text col-xs-2" onClick={this.changeAvatar}>修改</a>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.tel`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.tel`)}
                        id="tel"
                        label={this.data.sellerInfo.contact.number}
                        text={this.state.tel.text}
                        onClick={event=>this.handleClick(event, ()=>this.data.sellerInfo.contact.number)}
                        onChange={this.handleChange}
                        onFocus={event=>this.handleFocus(event, ()=>this.data.sellerInfo.contact.number)}
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.sellerInfo.update", Meteor.userId(), {contact: {number: this.state.tel.text}});
                        })}
              />
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.email`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.email`)}
                        id="email"
                        label={this.data.sellerInfo.email}
                        text={this.state.email.text}
                        onClick={event=>this.handleClick(event, ()=>this.data.sellerInfo.email)}
                        onChange={this.handleChange}
                        onFocus={event=>this.handleFocus(event, ()=>this.data.sellerInfo.email)}
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.sellerInfo.update", Meteor.userId(), {email: this.state.email.text});
                        })}
              />
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.address`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.address`)}
                        id="address"
                        label={this.data.sellerInfo.address}
                        text={this.state.address.text}
                        onClick={event=>this.handleClick(event, ()=>this.data.sellerInfo.address)}
                        onChange={this.handleChange}
                        onFocus={event=>this.handleFocus(event, ()=>this.data.sellerInfo.address)}
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.sellerInfo.update", Meteor.userId(), {address: this.state.address.text});
                        })}
              />
          </div>
          {/*
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

           <div className="form-group" style={{margin: '40px auto 40px 120px', width: '75%', height: '500px'}}>
           <GoogleMapComponent lat={40} lng={116.33}/>
           </div>
           */}
        </div>
      </div>
    );
  }
});
