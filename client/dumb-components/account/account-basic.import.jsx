import {TextEditor} from '/client/dumb-components/common/text-editor';
import {GoogleMapComponent} from '/client/dumb-components/common/googlemaps';
import {Avatar} from "/client/common/avatar";
import {ImageCropper} from "/client/common/image-cropper"
import {Chosen} from "/client/common/chosen";
import {Label, Input, Overlay, Tooltip} from "/lib/react-bootstrap"

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

export const AccountBasic = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState() {
    return {
      // 是否显示上传头像的modal
      showAvatarModal: false,
      // 上传头像的modal中, 需要显示的image
      avatarModalImageSrc: "",
      // 头像是否处于preloading状态
      avatarPreloading: false
    }
  },

  componentDidUpdate() {
    const um = UM.getEditor('ueContainer');
    const desc = this.data.sellerInfo.desc || {};
    um.setContent(desc.body || "");
  },

  componentDidMount() {
    // 初始化desc页面的um插件
    UM.delEditor('ueContainer');
    const um = UM.getEditor('ueContainer');
    $("#ueContainer").blur(function (evt) {
      const desc = um.getContent();
      const doc = {"desc.body": desc};
      Meteor.call("marketplace.seller.update", Meteor.userId(), doc);
    });
  },

  // TextEditor中用户按下Esc, 取消编辑操作的事件
  handleCanceled(event) {
    const key = event.key;
    const state = _.pick(this.state, key);
    state[key].text = state[key].original;
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

  // 更新商户的语言选项
  handleUpdateLang(evt) {
    const selected = evt.selected;
    const deselected = evt.deselected;

    if (selected) {
      Meteor.call("marketplace.seller.updateLang", Meteor.userId(), "add", selected);
    }
    if (deselected) {
      Meteor.call("marketplace.seller.updateLang", Meteor.userId(), "remove", deselected);
    }
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

  // 生成一个text field
  _buildTextField({message, placeholder, onSubmit, validator, label, overlayMessage}) {
    return (
      <div className="form-group">
        <label className="col-xs-4 col-sm-3 col-md-2 control-label">
          <FormattedMessage message={message}/>
        </label>
        <TextEditor placeholder={placeholder} label={label} onSubmit={onSubmit} validator={validator}
                    overlayMessage={overlayMessage}/>
      </div>
    );
  },

  // text field相关的设置
  _buildTextFieldsConfig() {
    const prefix = 'accountInfo.basicTab';
    return {
      nickname: {
        message: this.getIntlMessage(`${prefix}.nickname`),
        placeholder: this.getIntlMessage(`${prefix}.input.nickname`),
        onSubmit: event => Meteor.call("account.basicInfo.update", Meteor.userId(), {nickName: event.value}),
        validator: value => {
          const ctx = CoreModel.Account.UserInfo.newContext();
          return ctx.validateOne({nickName: value}, "nickName")
        },
        label: this.data.userInfo.nickName,
        overlayMessage: "请输入正确的用户昵称"
      },
      sellerName: {
        message: this.getIntlMessage(`${prefix}.sellerName`),
        placeholder: this.getIntlMessage(`${prefix}.input.sellerName`),
        onSubmit: event => Meteor.call("marketplace.seller.update", Meteor.userId(), {name: event.value}),
        validator: value => {
          const ctx = CoreModel.Marketplace.Seller.newContext();
          return ctx.validateOne({name: value}, "name")
        },
        label: this.data.sellerInfo.name,
        overlayMessage: "请输入正确的商户名称"
      },
      email: {
        message: this.getIntlMessage(`${prefix}.email`),
        placeholder: this.getIntlMessage(`${prefix}.input.email`),
        onSubmit: event => {
          Meteor.call("marketplace.seller.update", Meteor.userId(), {email: [event.value]})
        },
        validator: value => {
          const ctx = CoreModel.Marketplace.Seller.newContext();
          return ctx.validateOne({email: [value]}, "email")
        },
        label: _.first(this.data.sellerInfo.email || []),
        overlayMessage: "请输入正确的email地址"
      }
    }
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


    const textFields = this._buildTextFieldsConfig();

    return (
      <div className="account-basic-wrap row">
        <div className="form-horizontal">
          {this._buildTextField(textFields.nickname)}
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
          {this._buildTextField(textFields.sellerName)}
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              商户语言
            </label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <Chosen multiSelect={true} style={{width: 240}} selected={this.data.sellerInfo.lang}
                      onChange={this.handleUpdateLang} placeholder={"请选择服务语言"}
                      options={[{value: "zh", text: "中文"}, {value: "en", text: "英文"}, {value: "local", text: "当地语言"}]}/>
            </div>
          </div>
          <hr />
          {this._buildTextField(textFields.email)}
          <hr />
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              <FormattedMessage message={this.getIntlMessage(`${prefix}.sellerDesc`)}/>
            </label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <script id="ueContainer" name="content" type="text/plain" style={{width: "auto", height: 300}}></script>
            </div>
            <div><p style={{display: "none"}}>{(this.data.sellerInfo.sellerDesc||{}).body}</p></div>
          </div>
        </div>
      </div>
    );
  }
});
