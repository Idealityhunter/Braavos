/**
 * 编辑活动专区的列表
 *
 * Created by lyn on 3/23/16.
 */
import { BraavosBreadcrumb } from '/client/components/breadcrumb/breadcrumb'
import { Button, ButtonGroup } from '/lib/react-bootstrap'
import { ImageCropper } from "/client/common/image-cropper"
import { GeoSelect } from "/client/components/activities/article/article-edit"

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const UploadImage = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // 指定容器的宽高 => 从而进行样式上的适配
    width: React.PropTypes.number,
    height: React.PropTypes.number,

    // 指定 input 框的 ID, 以避免 ID 重复
    inputId: React.PropTypes.string,

    // 图片 url
    imageUrl: React.PropTypes.string,

    // 成功上传的回调动作
    onSuccessUpload: React.PropTypes.func,
  },

  getInitialState(){
    return {
      preloading: false,
      imageUrl: null
    }
  },

  // 上传失败的处理
  onFailUpload(){
    // 修改失败的状态转换
    this.setState({
      preloading: false
    });
    swal('上传失败!', '', 'error');
  },

  // 上传成功的处理
  onSuccessUpload(key){
    this.setState({
      preloading: false
    });

    this.props.onSuccessUpload(key);
  },

  // 获取上传需要的参数
  buildUploadOptions(imageSrc){
    const imageData = atob(imageSrc.replace(/^data:image\/[a-z]+;base64,/, ""));
    return {
      imageData: imageData,
      imageKey: `column/images/${CryptoJS.MD5(imageData).toString()}`,

      // TODO 修改 conf ,添加 column , 并且
      //bucketKey: "column"
      bucketKey: "commodity"
    }
  },

  // 构建 post 的数据
  buildPostData(key, token, data){
    const form = new FormData();

    // 添加相关参数
    form.append("key", key);
    form.append("token", token);

    // 添加上传的文件
    const writer = new Uint8Array(data.length);
    for (let i = 0; i < writer.length; i++) {
      writer[i] = data.charCodeAt(i);
    }
    const blob = new Blob([writer], {type: "application/octet-stream"});
    form.append("file", blob);

    return form;
  },

  // 上传至七牛
  upToQiniu(imageSrc){
    const {imageData, imageKey, bucketKey} = this.buildUploadOptions(imageSrc);

    Meteor.call("qiniu.getUploadToken", bucketKey, imageKey, {}, (err, ret) => {
      if (!err && ret) {
        // 获取上传数据
        const postData = this.buildPostData(ret.key, ret.token, imageData);

        // 发送post请求
        $.ajax({
          url: 'http://upload.qiniu.com',
          data: postData,
          contentType: false,
          processData: false,
          type: 'POST',
          success: (data, textStatus, jqXHR) => {
            this.onSuccessUpload(ret.key);
          },
          error: (jqXHR, textStatus, errorThrown) => {
            this.onFailUpload();
          }
        });
      } else {
        this.onFailUpload();
      }
    })
  },

  // 上传图片
  onUploadImage(evt) {
    this.setState({
      preloading: true
    });

    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.upToQiniu(reader.result);
      };
      reader.readAsDataURL(file);
    };

    // 清除这一次 input 的记录,以避免下一次 input 同样的数据而导致 change 事件不响应
    $(evt.target).val('');
  },

  styles: {
    plus: {
      border: '1px dashed #999',
      fontSize: 50,
      width: 80,
      height: 80,
      lineHeight: '80px',
      textAlign: 'center'
    }
  },

  render (){
    const wrapStyle = {
      boxSizing: 'content-box',
      width: this.props.width || 150,
      height: this.props.height || 150,
      border: '1px solid #666',
      position: 'relative',
      background: '#fff'
    };

    const labelStyle = {
      width: this.props.width || 150,
      height: this.props.height || 150,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const imageStyle = {
      height: this.props.height || 150,
      width: this.props.width || 150
    }

    const preloadStyle = {
      position: "absolute",
      top: this.props.height ? this.props.height / 2 - 20 : 55,
      left: this.props.width ? this.props.width / 2 - 20 : 55,
      height: 40,
      width: 40
    }

    const preloader =
      <div style={{display: this.state.preloading ? "block" : "none"}}>
        <img src="/images/spinner.gif"
             style={preloadStyle}/>
      </div>;

    const content = this.props.imageUrl
      ? <img style={imageStyle} src={this.props.imageUrl}/>
      : ! this.state.preloading
        ? <div style={this.styles.plus}>+</div>
        : <div />

    return (
      <div style={wrapStyle}>
        <label style={labelStyle} htmlFor={this.props.inputId || 'upload-file-input'}>
          {content}
          {preloader}
        </label>
        <input id={this.props.inputId || 'upload-file-input'} className="hidden" type="file" onChange={this.onUploadImage}/>
      </div>
    )
  }
})

export const ColumnEdit = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  propTypes: {
    // 专区详情
    title: React.PropTypes.string,
    images: React.PropTypes.array,
    banner: React.PropTypes.object,
    desc: React.PropTypes.string,
    commodities: React.PropTypes.array,
    rank: React.PropTypes.number,
    columnId: React.PropTypes.number,
    columnType: React.PropTypes.string,
    country: React.PropTypes.object,
    locality: React.PropTypes.object
  },

  getInitialState(){
    return {
      // 输入商品编号框的 value
      commodityId: null,

      // 是否为城市专区
      isLocalitySpecial: null,

      // 记录 country 和 locality 的选择
      country: this.props.country && this.props.country.zhName || '中国',
      locality: this.props.locality && this.props.locality.zhName || '台北'
    }
  },

  // 获取 country 和 locality 列表的数据
  getMeteorData() {
    // 订阅 country 数据
    const subsManager = BraavosCore.SubsManager.geo;
    subsManager.subscribe("countries");

    // 获取 country 数据
    const countries = BraavosCore.Database.Braavos.Country.find({}, {sort: {'pinyin': 1}}).fetch();

    // 对国家展示顺序作优先级处理
    //const defaultCountriesName = ['菲律宾', '韩国', '日本', '台湾', '泰国', '越南', '马来西亚', '印度尼西亚', '斯里兰卡', '柬埔寨', '新加坡', '印度', '阿联酋', '肯尼亚', '以色列', '中国'];
    const defaultCountriesName = ['菲律宾', '韩国', '日本', '中国', '泰国', '越南', '马来西亚', '印度尼西亚', '斯里兰卡', '柬埔寨', '新加坡', '印度', '阿联酋', '肯尼亚', '以色列', '尼泊尔', '马尔代夫'];
    const defaultCountries = _.filter(countries, country => _.indexOf(defaultCountriesName, country.zhName) != -1);
    let tempCountries = [];
    if (defaultCountries.length > 0){
      for (let index in defaultCountriesName){
        const tempCountry = _.find(defaultCountries, defaultCountry => defaultCountry.zhName == defaultCountriesName[index]);
        if (tempCountry) tempCountries.push(tempCountry);
      }
    }
    const restCountries = _.filter(countries, country => _.indexOf(defaultCountriesName, country.zhName) == -1);

    // 订阅 locality 数据
    let localities = [];
    subsManager.subscribe("localities", this.state.country);

    // 获取 locality 数据
    if (subsManager.ready()) {
      localities = BraavosCore.Database.Braavos.Locality.find({"country.zhName": this.state.country}, {sort: {'enName': 1}}).fetch();

      // 对城市展示顺序作优先级处理
      const defaultLocalitiesName = ["清迈","曼谷","普吉岛","苏梅岛","芭堤雅","甲米","首尔","釜山","大阪","东京","京都","冲绳","巴厘岛","加德满都","博卡拉","奇特旺","槟城","沙巴","吉隆坡","新山","垦丁","台中","台北","高雄","花莲","马累","马尔代夫","长滩岛","薄荷岛","杜马盖地","海豚湾","暹粒","吴哥窟","新加坡","民丹岛","巴淡岛","圣淘沙","河内","芽庄"]
      const defaultLocalities = _.filter(localities, locality => _.indexOf(defaultLocalitiesName, locality.zhName) != -1);
      let tempLocalities = [];
      if (defaultLocalities.length > 0){
        for (let index in defaultLocalitiesName){
          const tempLocality = _.find(defaultLocalities, defaultLocality => defaultLocality.zhName == defaultLocalitiesName[index]);
          if (tempLocality) tempLocalities.push(tempLocality);
        }
      }
      const restLocalities = _.filter(localities, locality => _.indexOf(defaultLocalitiesName, locality.zhName) == -1);
      localities = Array.prototype.concat(tempLocalities, restLocalities)
    }

    return {
      localities,
      countries: Array.prototype.concat(tempCountries, restCountries)
    }
  },

  // 添加商品动作
  handleAddCommodity(){
    if (_.isString(this.state.commodityId)){
      // 此处 parseInt 可以去除两边空格
      const commodityId = parseInt(this.state.commodityId);

      if (! _.isNaN(commodityId)){
        // 初始化 state 中的 commodities
        if (!this.state.commodities){
          if (this.props.commodities)
            this.setState({commodities: this.props.commodities})
          else
            this.setState({commodities: []});
        };

        this.setState({
          commodityId: '',
          commodities: _.concat(this.state.commodities, commodityId)
        });
        return ;
      }
    }

    swal('添加失败!', '请输入正确的商品编号', 'error')
  },

  // 获取 geo 信息
  getGeoInfo(zhName, geoType){
    const geoItem = BraavosCore.Database.Braavos[geoType].findOne({zhName});
    const geoInfo = {
      zhName,
      _id: geoItem._id,
      className: `com.lvxingpai.model.geo.${geoType}`
    };
    geoItem && geoItem.enName && _.extend(geoInfo, {enName: geoItem.enName});

    return geoInfo;
  },

  // 从 DOM 中获取 locality 的值
  getLocalityFromSelect(){
    const localityIndex = $('select.locality-select').val();
    const localityZh = $($('select.locality-select>option')[parseInt(localityIndex)]).text();
    return localityZh;
  },

  // 保存专区内容
  saveColumnInfo(){
    // 判断是否为 城市专区
    const isLocalitySpecial = this.state.isLocalitySpecial !== null && this.state.isLocalitySpecial
        || this.state.isLocalitySpecial == null && this.props.columnType == 'locality';

    // 获取编辑的信息
    const columnInfo = {
      title: this.state.title || this.props.title || '',
      images: this.state.cover && [{key: this.state.cover}] || this.props.images || [{key: ''}],
      banner: this.state.banner && {key: this.state.banner} || this.props.banner || {key: ''},
      desc: this.state.desc || this.props.desc || '',
      commodities: this.state.commodities || this.props.commodities || [],
      rank: this.state.rank || this.props.rank || 1,
      columnType: isLocalitySpecial ? 'locality' : 'special'
    };

    // TODO 验证编辑的数据
    //this.validateColumnInfo();

    // 城市专区获取 country 和 locality 数据
    if (isLocalitySpecial){
      _.extend(columnInfo, {
        country: this.getGeoInfo(this.state.country, 'Country'),

        // 注意: 此处不能只从 state 获取 locality 数据;因为切换国家的时候, locality 也会切换,然而 state 中的 locality 并没有改变,其实相当于"状态和表现分离"了
        locality: this.getGeoInfo((this.state.locality !== '') ? this.state.locality : this.getLocalityFromSelect(), 'Locality')
      })
    }

    // 假如存在 columnId 说明是编辑页面,不存在则为添加页面
    if (this.props.columnId){
      Meteor.call('activity.column.edit', this.props.columnId, columnInfo, (err, res) => {
        if (err || res == 0) {
          swal("编辑专区失敗!", "", "error");
          return;
        }

        if (res){
          swal({
            title: "成功编辑专区!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#AEDEF4",
            closeOnConfirm: true
          }, function () {
            FlowRouter.go('/activities/columns');
          });

          // 以免不点击 swal 导致不跳转
          Meteor.setTimeout(() => FlowRouter.go('/activities/columns'), 500);
        }
      })
    }else{
      Meteor.call('activity.column.create', columnInfo, (err, res) => {
        if (err || res == 0) {
          swal("添加专区失敗!", "", "error");
          return;
        }

        if (res){
          swal({
            title: `成功添加专区: ${columnInfo.title}`,
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#AEDEF4",
            closeOnConfirm: true
          }, function () {
            FlowRouter.go('/activities/columns');
          });

          // 以免不点击 swal 导致不跳转
          Meteor.setTimeout(() => FlowRouter.go('/activities/columns'), 500);
        }
      })
    };
  },

  styles: {
    // 包裹用户进行输入行为的DOM元素,用以达成对齐等效果(比如: input,textarea)
    inputWrap: {
      display: 'block',
      margin: '10px 0 20px 5px'
    },

    // 输入文本的DOM元素(包括 input 和 textarea)
    textInput : {
      padding: 6,
      width: 400
    },

    hr: {
      borderColor: 'silver',
      marginTop: 40,
      marginBottom: 40
    },

    // 商品列表的包裹层
    commoditiesWrap: {
      margin: '20px 5px',
      border: '1px solid #999',
      padding: 8,
      width: 400
    }
  },

  // 修改专区类型(是否为"城市专区")
  _handleTypeChange(e) {
    this.setState({
      isLocalitySpecial: e.target.checked
    });
  },

  // 修改国家的 state
  _handleCountryChange(country){
    this.setState({
      country,
      locality: ''
    })
  },

  // 修改城市的 state
  _handleLocalityChange(locality){
    this.setState({locality})
  },

  // 判断当前选择是否为城市专区
  _isLocalitySpecial(){
    return (this.state.isLocalitySpecial || this.state.isLocalitySpecial == null && this.props.columnType == 'locality')
  },

  render (){
    const commodities = this.state.commodities || this.props.commodities || [];
    const commoditiesWrap = (commodities.length > 0)
      ? <div style={this.styles.commoditiesWrap}>
          {commodities.map(commodity => <p>{commodity}</p>)}
        </div>
      : <div />;

    const geoContents = this._isLocalitySpecial() ?
      <div style={this.styles.inputWrap}>
        <div style={{marginRight: 20, display: 'inline-block'}}>
          <GeoSelect data = {this.data.countries}
                     zhName = {this.state.country}
                     geoType="country"
                     geoTypeName="国家"
                     onOptionChange = {this._handleCountryChange}/>
        </div>

        <GeoSelect data = {this.data.localities}
                   zhName = {this.state.locality}
                   geoType="locality"
                   geoTypeName="城市"
                   onOptionChange = {this._handleLocalityChange}/>
      </div> : null;// 注意: 此处使用null, 是因为没有内容的 div 会导致有一个 chosen 生成的 DOM 不会被清除! 比如: <div/> 或者 <div><div/>

    return (
      <div className="column-edit-wrap">
        <BraavosBreadcrumb />
        <br />
        <div>
          <div className="form-group">
            <label className="label-text">
              活动名称
            </label>
            <div style={this.styles.inputWrap}>
              <input className="placeholder" type='text' placeholder=""
                     value={this.state.title || this.props.title || ''}
                     style={this.styles.textInput}
                     onChange={e => this.setState({title: e.target.value})}/>
            </div>
          </div>

          <div className="form-group">
            <label className="label-text">
              活动排名指数(指数越低则排名越前)
            </label>
            <div style={this.styles.inputWrap}>
              <input className="placeholder" type='text' placeholder=""
                     value={this.state.rank || this.props.rank || ''}
                     style={this.styles.textInput}
                     onChange={e => this.setState({rank: parseInt(e.target.value)})}/>
            </div>
          </div>

          <div className="form-group">
            <label className="label-text">
              选择专区位置
            </label>
            <label className="">
              <input type="checkbox" defaultChecked={this._isLocalitySpecial() ? "checked" : ""} onChange={this._handleTypeChange}/> 在"城市专区"
            </label>
            {geoContents}
          </div>

          <hr style={this.styles.hr}/>

          <div className="form-group">
            <label className="label-text">
              封面图-首页/城市页(参数规格: 400*400)
            </label>
            <div style={this.styles.inputWrap}>
              <UploadImage width={150} height={150}
                           inputId="columnCover"
                           onSuccessUpload={key => this.setState({cover: key})}
                           imageUrl={this.state.cover && `http://images.taozilvxing.com/${this.state.cover}` || this.props.images && this.props.images[0] && `http://images.taozilvxing.com/${this.props.images[0].key}` || ''}
              />
            </div>
          </div>

          <hr style={this.styles.hr}/>

          <div className="form-group">
            <label className="label-text">
              banner图-专区页(参数规格: 900*600)
            </label>
            <div style={this.styles.inputWrap}>
              <UploadImage width={300} height={200}
                           inputId="columnBanner"
                           onSuccessUpload={key => this.setState({banner: key})}
                           imageUrl={this.state.banner && `http://images.taozilvxing.com/${this.state.banner}` || this.props.banner && `http://images.taozilvxing.com/${this.props.banner.key}` || ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="">
              活动介绍
            </label>
            <div style={this.styles.inputWrap}>
              <textarea className="form-control placeholder" rows="3" placeholder=""
                        style={this.styles.textInput}
                        value={this.state.desc || this.props.desc || ''}
                        onChange={e => this.setState({desc: e.target.value})}
              />
            </div>
          </div>

          <hr style={this.styles.hr}/>

          <div className="form-group">
            <label className="">
              专区商品
            </label>
            {commoditiesWrap}
            <div style={{marginLeft: 5}}>
              <input className="placeholder" type='text' placeholder="商品编号"
                     style={this.styles.textInput}
                     value={this.state.commodityId}
                     onChange={e => this.setState({commodityId: e.target.value})}
              />
              <Button style={{marginLeft: 20}} bsStyle="info" bsSize="small" onClick={this.handleAddCommodity}>添加商品</Button>
            </div>
          </div>

          <hr style={this.styles.hr}/>

          <Button style={{marginBottom: 30}} bsStyle="info" bsSize="small" onClick={this.saveColumnInfo}>保存专区</Button>

        </div>
      </div>
    )
  }
})