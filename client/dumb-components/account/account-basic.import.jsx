import {TextEditor} from '/client/dumb-components/common/text-editor';
import {GoogleMapComponent} from '/client/dumb-components/common/googlemaps';
import {Avatar} from "/client/common/avatar";
import {ImageCropper} from "/client/common/image-cropper"

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
      this.original = "";
      // 上一次更新的值. 每次blur的时候, 将检查这一数值.
      // 只有当二者不一致的时候, 才会真正执行提交的操作
      this.lastSubmit = undefined;
    };

    return {
      nickname: new TextEditorState(),
      tel: new TextEditorState(),
      email: new TextEditorState(),
      address: new TextEditorState(),

      // 是否显示上传头像的modal
      showAvatarModal: false,
      // 上传头像的modal中, 需要显示的image
      avatarModalImageSrc: "",
      // 头像是否处于preloading状态
      avatarPreloading: false
    }
  },

  componentDidMount() {
    //// 初始化avatar对象
    //const avatar = ReactDOM.findDOMNode(this.refs["avatar"]);
    //$(avatar).find("label").attr("for", "file-input");
  },

  // TextEditor中用户按下Esc, 取消编辑操作的事件
  handleCanceled(event) {
    const key = event.key;
    const state = _.pick(this.state, key);
    state[key].text = state[key].original;
    this.setState(state);
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
    this.setState(state);
  },

  handleSubmit(event, submitFunc) {
    const key = event.key;
    const state = _.pick(this.state, key);
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
      // 假如是新的avtar结构,要做特殊处理
      userInfo.avatar.url && (userInfo.avatar = userInfo.avatar.url);
      userInfo.avatar = userInfo.avatar.indexOf("qiniudn") ? `${userInfo.avatar}?imageView2/2/w/128/h/128` : userInfo.avatar;
    } else {
      userInfo.avatar = "http://www.lvxingpai.com/app/download/images/appdownload/logo.png"
    }

    const sellerInfo = BraavosCore.Database.Braavos.Seller.findOne({sellerId: userId}) || {};
    if (!sellerInfo.contact) {
      sellerInfo.contact = {number: ""};
    }

    return {
      userInfo: userInfo,
      sellerInfo: sellerInfo
    };
  },

  // 上传头像
  changeAvatar(evt) {
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        //const imgNode = ReactDOM.findDOMNode(this.refs["avatar-img"]);
        this.setState({showAvatarModal: true, avatarModalImageSrc: reader.result});
      };
      reader.readAsDataURL(file);
    }
  },

  // 关闭上传头像的modal
  handleCloseAvatarModal(evt) {
    this.setState({showAvatarModal: false});
  },

  // 修改头像
  handleModifyAvatar(evt) {
    const self = this;
    this.setState({showAvatarModal: false, avatarPreloading: true});
    const imageSrc = evt.croppedImage;

    //deprecated 利用图像的内容, 做MD5, 得到key
    const imageData = atob(imageSrc.replace(/^data:image\/[a-z]+;base64,/, ""));
    const key = `avatar/${CryptoJS.MD5(imageData).toString()}`;
    const bucketKey = "avatar";

    Meteor.call("qiniu.getUploadToken", bucketKey, key, {}, (err, ret) => {
      if (!err && ret) {
        // 组建form
        const form = new FormData();
        form.append("key", ret.key);
        form.append("token", ret.token);

        // 添加文件
        const writer = new Uint8Array(imageData.length);
        for (let i = 0; i < writer.length; i++) {
          writer[i] = imageData.charCodeAt(i);
        }
        const blob = new Blob([writer], {type: "application/octet-stream"});
        form.append("file", blob);

        // 发送post请求
        $.ajax({
          url: 'http://upload.qiniu.com',
          //url : 'https://up.qbox.me/',
          data: form,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function (data, textStatus, jqXHR) {
            Meteor.call("account.basicInfo.update", Meteor.userId(), {avatar: {url: ret.url}});
            self.setState({avatarPreloading: false});
          },
          error(jqXHR, textStatus, errorThrown){
            // TODO 修改失败的状态转换
            self.setState({avatarPreloading: false});
          }
        })
      } else {
        // TODO 错误处理
        self.setState({avatarPreloading: false});
      }
    })
  },

  render() {
    const prefix = 'accountInfo.basicTab';

    const avatarModal = this.state.showAvatarModal ?
      <ImageCropper title={this.getIntlMessage(`${prefix}.changeAvatar`)}
                    okTitle={this.getIntlMessage("dialog.ok")} cancelTitle={this.getIntlMessage("dialog.cancel")}
                    imageSrc={this.state.avatarModalImageSrc} showModal={true} aspectRatio={1}
                    imageMaxWidth={500}
                    onOk={this.handleModifyAvatar}
                    onClose={this.handleCloseAvatarModal}/>
      :
      <div />;

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
                        onSubmit={event=>{
                           Meteor.call("account.basicInfo.update", Meteor.userId(), {nickName: event.value});
                         }}
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
              <Avatar imageUrl={this.data.userInfo.avatar} borderRadius={8} onChange={this.changeAvatar}
                      stripLabel={this.getIntlMessage(`${prefix}.changeAvatar`)}
                      preloading={this.state.avatarPreloading}/>
              {avatarModal}
            </div>
          </div>
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.tel`)}/>
            </label>
            <TextEditor placeholder={this.getIntlMessage(`${prefix}.input.tel`)}
                        id="tel"
                        label={this.data.sellerInfo.contact.number}
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.sellerInfo.update", Meteor.userId(), {contact: {number: event.value}});
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
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.sellerInfo.update", Meteor.userId(), {email: event.value});
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
                        onSubmit={event=>this.handleSubmit(event, ()=>{
                          Meteor.call("account.sellerInfo.update", Meteor.userId(), {address: event.value});
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
