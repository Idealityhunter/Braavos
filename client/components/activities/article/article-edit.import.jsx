/**
 * 编辑文章的列表
 *
 * Created by lyn on 3/29/16.
 */
import { BraavosBreadcrumb } from '/client/components/breadcrumb/breadcrumb'
import { Button, ButtonGroup } from '/lib/react-bootstrap'
import { ImageCropper } from "/client/common/image-cropper"

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const GeoSelect = React.createClass({
  propTypes: {
    // select 中的列表数据
    data: React.PropTypes.array,

    // 被选择的名称
    zhName: React.PropTypes.string,

    // select 选项修改的回调函数
    onOptionChange: React.PropTypes.func,

    // geo 种类,涉及展示和类名
    geoType: React.PropTypes.string,
    geoTypeName: React.PropTypes.string
  },

  componentDidMount(){
    // 组件挂载后 chosen 需要绑定一下
    this._handleChosenUpdate();
  },

  componentDidUpdate(){
    // 每次数据更新, 应该重新绑定一下 chosen
    this._handleChosenUpdate();
  },

  // TODO 当 locality 或 country 没改变时就不重新渲染
  shouldComponentUpdate(nextProps, nextState){
    return true;
  },

  // select 修改的触发函数
  _handleOptionChange(e){
    const zhName = $(e.target).children(`option:eq(${e.target.value})`).text();
    this.props.onOptionChange(zhName);
  },

  // 当 chosen 的选项更新时触发的回调
  _handleChosenUpdate(){
    // 绑定 chosen 插件或者更新数据
    const className = `.${this.props.geoType}-select`;
    if ($(className).next('.chosen-container').length <= 0){
      $(className).chosen({
        no_results_text: `没有找到这个${this.props.geoTypeName}`
      });

      // 根据chosen的选择更新state
      $(className).off('change');
      $(className).on('change', (evt, params) => {
        this.props.onOptionChange(evt.target[params.selected].label || evt.target[params.selected].innerText || evt.target[params.selected].innerHTML)
      });
    } else{
      $(className).trigger("chosen:updated");
    };
  },

  styles: {
    // 下拉菜单的样式(country 和 locality 选择框)
    select: {
      width: 150
    }
  },

  render(){
    // 获取对应的 option 的 value
    let selectIndex = '';
    if (this.props.zhName){
      const selectArray = this.props.data.slice();
      for (let i = 0;i < selectArray.length;i++){
        if (selectArray[i].zhName == this.props.zhName){
          selectIndex = i;
          break;
        }
      };
    };

    // 根据 data 生成 select 组件
    let i = 0;
    const optionList = this.props.data.map(item => (<option value={i++} key={item._id._str}>{item.zhName}</option>));
    return (
      <select name="" id=""
              className={`${this.props.geoType}-select form-control`}
              style={this.styles.select}
              placeholder={this.props.geoTypeName}
              data-placeholder={`${this.props.geoTypeName}数据正在加载中`}
              value={selectIndex}
              onChange={this._handleOptionChange}>
        {optionList}
      </select>
    );
  }
});

export const ArticleEdit = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],
  propTypes: {
    // 文章详情
    title: React.PropTypes.string,
    desc: React.PropTypes.string,
    content: React.PropTypes.string,
    articleId: React.PropTypes.number,
    country: React.PropTypes.object,
    locality: React.PropTypes.object
  },

  getInitialState(){
    return {
      country: this.props.country && this.props.country.zhName || '中国', //'中国' 是为了第一次添加时的locality的获取
      locality: this.props.locality && this.props.locality.zhName || '台北' //'台北' 是为了保存时从 state 获取 locality 不会出错
    }
  },

  // 获取country和locality列表的数据
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

  componentDidMount(){
    // 初始化 um 插件
    UM.delEditor('ueContainer');
    const um = UM.getEditor('ueContainer');
    um.ready(() => {
      //设置编辑器的内容
      um.setContent(this.props.content || '');
    });
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

  // 保存文章内容
  saveArticleInfo(){
    // 获取 country 数据
    const country = this.getGeoInfo(this.state.country, 'Country');

    // 获取 locality 数据
    const locality = this.getGeoInfo(this.state.locality, 'Locality');

    // 获取RichText
    const um = UM.getEditor('ueContainer');
    const content = um.getContent();

    // 获取编辑的信息
    const articleInfo = {
      country,
      locality,
      content,
      title: this.state.title || this.props.title || '',
      desc: this.state.desc || this.props.desc || ''
    };

    // TODO 验证编辑的数据
    //this.validateArticleInfo();

    // 假如存在 articleId 说明是编辑页面,不存在则为添加页面
    if (this.props.articleId){
      Meteor.call('activity.article.edit', this.props.articleId, articleInfo, (err, res) => {
        if (err || res == 0) {
          swal("编辑文章失敗!", "", "error");
          return;
        }

        if (res){
          swal({
            title: "成功编辑文章!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#AEDEF4",
            closeOnConfirm: true
          }, function () {
            FlowRouter.go('/activities/articles');
          });

          // 以免不点击 swal 导致不跳转
          Meteor.setTimeout(() => FlowRouter.go('/activities/articles'), 500);
        }
      })
    }else{
      Meteor.call('activity.article.create', articleInfo, (err, res) => {
        if (err || res == 0) {
          swal("添加文章失敗!", "", "error");
          return;
        }

        if (res){
          swal({
            title: `成功添加文章: ${articleInfo.title}`,
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#AEDEF4",
            closeOnConfirm: true
          }, function () {
            FlowRouter.go('/activities/articles');
          });

          // 以免不点击 swal 导致不跳转
          Meteor.setTimeout(() => FlowRouter.go('/activities/articles'), 500);
        }
      })
    };
  },

  styles: {
    // 包裹用户进行输入行为的DOM元素,用以达成对齐等效果(比如: input, textarea)
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
    }
  },

  // 修改国家的 state
  _handleCountryChange(country){
    this.setState({country})
  },

  // 修改城市的 state
  _handleLocalityChange(locality){
    this.setState({locality})
  },

  render (){
    return (
      <div className="column-edit-wrap">
        <BraavosBreadcrumb />
        <br />
        <div>
          <div className="form-group">
            <label className="label-text">
              文章标题
            </label>
            <div style={this.styles.inputWrap}>
              <input className="placeholder" type='text' placeholder=""
                     value={this.state.title || this.props.title || ''}
                     style={this.styles.textInput}
                     onChange={e => this.setState({title: e.target.value})}/>
            </div>
          </div>

          <div className="form-group">
            <label className="">
              文章介绍
            </label>
            <div style={this.styles.inputWrap}>
              <textarea className="form-control placeholder" rows="3" placeholder=""
                        style={this.styles.textInput}
                        value={this.state.desc || this.props.desc || ''}
                        onChange={e => this.setState({desc: e.target.value})}/>
            </div>
          </div>

          <div className="form-group">
            <label className="">
              选择国家和城市
            </label>
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
            </div>
          </div>

          <hr style={this.styles.hr}/>

          <div className="form-group">
            <label className="">
              文章详情
            </label>
            <div style={this.styles.inputWrap}>
              <script id="ueContainer" name="content" type="text/plain" style={{height: 400, width: 800}}></script>
            </div>
          </div>

          <hr style={this.styles.hr}/>

          <Button style={{marginBottom: 30}} bsStyle="info" bsSize="small" onClick={this.saveArticleInfo}>保存文章</Button>
        </div>
      </div>
    )
  }
})