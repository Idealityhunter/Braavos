import {TextEditor} from '/client/dumb-components/common/text-editor';
import {GoogleMapComponent} from '/client/dumb-components/common/googlemaps';
import {Avatar} from "/client/common/avatar";
import {ImageCropper} from "/client/common/image-cropper"
import {Chosen} from "/client/common/chosen";
import {Label, Input, Overlay, Tooltip} from "/lib/react-bootstrap"
import {CommentText} from '/client/dumb-components/common/comment-text';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

const PhoneEditor = React.createClass({
  propTypes: {
    // 更新电话号码
    onUpdatePhone: React.PropTypes.func,
    // 国家
    countries: React.PropTypes.array,
    // 选中的国家
    selectedCountry: React.PropTypes.string,
    // 电话号码
    phoneNumber: React.PropTypes.number
  },

  getInitialState() {
    return {
      selectedCountry: this.props.selectedCountry,
      phoneNumber: this.props.phoneNumber
    }
  },

  // 更新电话信息
  onUpdatePhone(countryCode, number) {
    if (this.props.onUpdatePhone) {
      const dialCode = _.find(this.props.countries, item => item.code == countryCode).dialCode;
      this.props.onUpdatePhone({countryCode: countryCode, number: number, dialCode: dialCode});
    }
  },

  // 更新国家
  onUpdateCountry(event) {
    const countryCode = event.selected;
    this.setState({selectedCountry: countryCode});
    // 如果已经输入了电话号码, 则触发更新操作
    const phoneNumber = this.state.phoneNumber;
    if (phoneNumber) {
      this.onUpdatePhone(countryCode, phoneNumber);
    }
  },

  // 更新电话号码
  onUpdateNumber(event) {
    const number = this.formatNumber(event.value);
    if (number) {
      this.setState({phoneNumber: number});
      const countryCode = this.state.selectedCountry;
      if (countryCode) {
        this.onUpdatePhone(countryCode, number);
      }
    }
  },

  // 从text中提出电话号码
  formatNumber(text) {
    // 去除所有的括号, 空格, 句点等符号
    const number = parseInt(text.replace(/[\(\)\s\.\-]+/g, ""));
    if (number && !isNaN(number) && number >= 1000) {
      return number;
    } else {
      return null;
    }
  },

  numberValidator(value) {
    return !!this.formatNumber(value);
  },

  render() {
    const countries = this.props.countries || [];
    const countryOptions = countries.map(item => {
      return {value: item.code, text: `${item.zhName} (+${item.dialCode})`};
    });
    const selected = this.state.selectedCountry;
    const number = this.state.phoneNumber;

    return (
      <div className="form-group">
        <label className="col-xs-4 col-sm-3 col-md-2 control-label">
          联系电话
        </label>
        <div className="col-sm-1 col-md-2">
          <Chosen selected={selected ? [selected] : []} style={{width: "100%"}} placeholder={"国家"}
                  onChange={this.onUpdateCountry} options={countryOptions}/>
        </div>
        <TextEditor placeholder="请输入电话号码" inputClassName="col-xs-6" onSubmit={this.onUpdateNumber}
                    visibleEditAnchor={true} label={number ? number.toString() : ""}
                    validator={this.numberValidator} overlayMessage={"请输入正确格式的电话号码"}/>
      </div>);
  }
});

// umeditor是否初始化
const umeditorFlags = {
  init: false
};

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
    this.refreshEditor();
  },

  refreshEditor() {
    if (!this.data.subsReady) {
      return;
    }

    let um = null;
    if (!umeditorFlags.init) {
      // what does this mean?
      $("div.tab-content").focus();

      // 初始化desc页面的um插件
      UM.delEditor('ueContainer');
      um = UM.getEditor('ueContainer');

      $("#ueContainer").blur(() => {
        if (this.data.subsReady) {
          const desc = um.getContent();
          const doc = {"desc.body": desc};
          Meteor.call("marketplace.seller.update", Meteor.userId(), doc);
        }
      });
      umeditorFlags.init = true;
    } else {
      um = UM.getEditor("ueContainer");
    }

    const desc = this.data.sellerInfo.desc || {};
    um.setContent(desc.body || "");
  },

  componentDidMount() {
    umeditorFlags.init = false;
    this.refreshEditor();
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
    const subsManager = BraavosCore.SubsManager.account;
    const subsReady = subsManager.ready() && BraavosCore.SubsManager.geo.ready();

    const allCountries = BraavosCore.Database.Braavos.Country.find({}, {
      fields: {code: 1, dialCode: 1, zhName: 1},
      sort: {pinyin: 1}
    }).fetch();
    const cn = _.find(allCountries, item => item.code == "CN");
    const others = _.filter(allCountries, item => item.code != "CN");
    const countries = Array.prototype.concat([cn], others);

    const userId = parseInt(Meteor.userId());
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: userId}) || {};

    // TODO 需要更细致的处理图像的方法. 考虑各种情况, 比如avatar是一个key等.
    if (userInfo && userInfo.avatar) {
      // 假如是新的avtar结构,要做特殊处理
      userInfo.avatar.url && (userInfo.avatar = userInfo.avatar.url);
      userInfo.avatar = userInfo.avatar.indexOf("qiniudn") ? `${userInfo.avatar}?imageView2/2/w/128/h/128` : userInfo.avatar;
    } else {
      userInfo.avatar = "images/logo.png"
    }

    const sellerInfo = BraavosCore.Database.Braavos.Seller.findOne({sellerId: userId}) || {};
    return {
      userInfo: userInfo,
      sellerInfo: sellerInfo,
      countries: countries,
      subsReady: subsReady
    };
  },

  // 更新商户的语言选项
  handleUpdateLang(event) {
    const selected = event.selected;
    const deselected = event.deselected;

    if (selected) {
      Meteor.call("marketplace.seller.updateArray", Meteor.userId(), "add", "lang", selected);
    }
    if (deselected) {
      Meteor.call("marketplace.seller.updateArray", Meteor.userId(), "remove", "lang", deselected);
    }
  },

  // 更新商户的附加服务
  handleUpdateServices(event) {
    const selected = event.selected;
    const deselected = event.deselected;

    if (selected) {
      Meteor.call("marketplace.seller.updateArray", Meteor.userId(), "add", "services", selected);
    }
    if (deselected) {
      Meteor.call("marketplace.seller.updateArray", Meteor.userId(), "remove", "services", deselected);
    }
  },

  // 更新电话信息
  handleUpdatePhone({countryCode, dialCode, number}) {
    if (countryCode && dialCode && number)
      Meteor.call("marketplace.seller.update", Meteor.userId(), {
        phone: [{
          countryCode: countryCode,
          dialCode: dialCode,
          number: number
        }]
      });
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
          const schema = new SimpleSchema({
            email: {
              type: String,
              regEx: SimpleSchema.RegEx.Email
            }
          });
          const ctx = schema.newContext();
          return ctx.validateOne({email: value}, "email")
        },
        label: _.first(this.data.sellerInfo.email || []),
        overlayMessage: "请输入正确的email地址"
      }
    }
  },

  render() {
    if (!this.data.subsReady) {
      return <div></div>;
    }

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

    const phone = _.first((this.data.sellerInfo || {}).phone || [{}]);
    const phoneEditor =
      <PhoneEditor countries={this.data.countries} phoneNumber={phone.number}
                   selectedCountry={phone.countryCode || "CN"}
                   onUpdatePhone={this.handleUpdatePhone}/>;

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
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              附加服务
            </label>
            <div className="col-xs-6 col-sm-7 col-md-8">
              <Chosen multiSelect={true} style={{width: 240}} selected={this.data.sellerInfo.services}
                      onChange={this.handleUpdateServices} placeholder={"添加附加服务"}
                      options={[{value: "language", text: "语言帮助"}, {value: "plan", text: "行程规划"}, {value: "consult", text: "当地咨询"}]}/>
              <CommentText text='附加服务为您愿意为游客免费提供的一些旅行帮助, 非必填' inline={true} style={{marginLeft: 30}}/>
            </div>
          </div>
          <hr />
          {phoneEditor}
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
