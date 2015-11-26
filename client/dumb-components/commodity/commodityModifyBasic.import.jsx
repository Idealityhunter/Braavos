import {CommentText} from '/client/dumb-components/common/comment-text';
import {CommodityGallery} from '/client/dumb-components/commodity/commodityGallery';
import {CommodityCalendar} from '/client/dumb-components/commodity/commodityCalendar';
import {CommodityPlans} from '/client/dumb-components/commodity/commodityPlans';
import {NumberInput} from '/client/common/numberInput';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityModifyBasic = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  styles: {
    asterisk: {
      color: 'coral',
      verticalAlign: 'text-top',
      paddingLeft: 5,
      fontsize: 18
    }
  },

  getInitialState(){
    return {
      country: this.props.country && this.props.country.zhName || '阿尔巴尼亚',//阿尔巴尼亚是为了第一次添加时的locality的获取
      locality: this.props.locality && this.props.locality.zhName || ''
    }
  },

  // 获取country和locality列表的数据
  getMeteorData() {
    Meteor.subscribe('countries');
    const countries = BraavosCore.Database.Braavos.Country.find({}, {sort: {'pinyin': 1}}).fetch();

    Meteor.subscribe('localities', this.state.country);
    const localities = BraavosCore.Database.Braavos.Locality.find({}, {sort: {'enName': 1}}).fetch();

    return {
      countries: countries,
      localities: localities
    }
  },

  getDefaultProps(){
    // 传入下一层的数据
    return {
      plans: []
    }
  },

  // 修改国家时,触发更新locality的数据
  _handleCountryChange(e){
    const country = $(e.target).children(`option:eq(${e.target.value})`).text();
    this.setState({
      country: country
    })
  },

  // 修改locaity
  _handleLocalityChange(e){
    const locality = $(e.target).children(`option:eq(${e.target.value})`).text();
    this.setState({
      locality: locality
    })
  },

  // 清除因为提交造成的error效果
  _handleClearErrorClass(e){
    $(e.target).removeClass('error');
    console.log(e);
  },

  render() {
    const prefix = 'commodities.modify.basicTab.';
    let selectCountryIndex = '';
    let selectCategoryIndex = '';
    let selectLocalityIndex = '';
    let i = 0;
    const self = this;

    // 获取国家对应的option的value
    if (this.state.country){
      const countryArray = this.data.countries.slice();
      for (i = 0;i < countryArray.length;i++){
        if (countryArray[i].zhName == this.state.country){
          selectCountryIndex = i;
          break;
        }
      };
    };

    // 获取国家对应的option的value
    if (this.state.locality){
      const localityArray = this.data.localities.slice();
      for (i = 0;i < localityArray.length;i++){
        if (localityArray[i].zhName == this.state.locality){
          selectLocalityIndex = i;
          break;
        }
      };
    };

    // 获取目录对应的option的value
    if (this.props.category && this.props.category.length > 0){
      const categoryArray = ['特色活动', '文化体验', '美食住宿', '城市游览', '门票预订', '演出', 'SPA', '游船', '其它'];
      for (i = 0;i < categoryArray.length;i++){
        if (categoryArray[i] == this.props.category[0]){
          selectCategoryIndex = i;
          break;
        };
      };
    };

    // 根据data生成country的select组件
    i = 0;
    const countryOptionList = this.data.countries.map(country => (<option value={i++} data-en={country.enName}>{country.zhName}</option>));
    const countrySelect = (
      <select name="" id="" className="country-select form-control" placeholder="国家" value={selectCountryIndex} onChange={this._handleCountryChange}>
        {countryOptionList}
      </select>
    );

    // 根据data生成locality的select组件
    let j = 0;
    const localityOptionList = this.data.localities.map(locality => (<option value={j++} data-en={locality.enName}>{locality.zhName}</option>));
    const localitySelect = (
      <select name="" id="" className="locality-select form-control" placeholder="城市" value={selectLocalityIndex} onChange={this._handleLocalityChange}>
        {localityOptionList}
      </select>
    );

    return (
      <div className="commodity-basic-wrap">
        <label className="">
          <FormattedMessage message={this.getIntlMessage(prefix + 'commodityImages')}/>
          <span style={this.styles.asterisk}>*</span>
        </label>
        <CommodityGallery images={this.props.images} cover={this.props.cover}/>
        <hr style={{border:'1px dashed #ddd'}}/>
        <label className=""><FormattedMessage message={this.getIntlMessage(prefix + 'basicInfo')}/></label>
        <form className="form-horizontal commodity-basic-form-wrap">
          <div className="form-group title">
            <label className="label-text">
              <FormattedMessage message={this.getIntlMessage(prefix + 'commodityName')}/>
              <span style={this.styles.asterisk}>*</span>
            </label>
            <input className="inline placeholder" type='text' placeholder="" defaultValue={this.props.title || ''} style={{padding: 6}} onChange={this._handleClearErrorClass}/>
          </div>
          <div className="form-group address">
            <label className="label-text">
              <FormattedMessage message={this.getIntlMessage(prefix + 'addressInfo')}/>
              <span style={this.styles.asterisk}>*</span>
            </label>
            {countrySelect}
            {localitySelect}
            <input className="inline placeholder" type='text' placeholder="(选填)详细地址" defaultValue={this.props.address || ''} style={{padding: 6}}/>
          </div>
          <div className="form-group category">
            <label className="label-text">
              <FormattedMessage message={this.getIntlMessage(prefix + 'commodityCategories')}/>
              <span style={this.styles.asterisk}>*</span>
            </label>
            <select name="" id="" className="form-control" defaultValue={selectCategoryIndex}>
              <option value="0">特色活动</option>
              <option value="1">文化体验</option>
              <option value="2">美食住宿</option>
              <option value="3">城市游览</option>
              <option value="4">门票预订</option>
              <option value="5">演出</option>
              <option value="6">SPA</option>
              <option value="7">游船</option>
              <option value="8">其它</option>
            </select>
          </div>
          {/*
          <div className="form-group">
           <label className="label-text">服务语言</label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox1" value="option1"/> 英语
           </label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox2" value="option2"/> 中文
           </label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox3" value="option3"/> 本地语言
           </label>
           <CommentText text='服务语言为与游客交流的语言' inline={true} />
           </div>
          */}
          <div className="form-group cost-time">
            <label className="label-text">
              <FormattedMessage message={this.getIntlMessage(prefix + 'timeCost')}/>
              <span style={this.styles.asterisk}>*</span>
            </label>
            <NumberInput className="inline placeholder" style={{width:50, padding:6}}
                         value={this.props.timeCost || ''}
                         placeholder=''
                         onChange={this._handleClearErrorClass.bind(this)}
            />
            <FormattedMessage message={this.getIntlMessage(prefix + 'hour')}/>
          </div>
          {/*
           <div className="form-group">
           <label className="label-text">旅行服务</label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox1" value="option1"/> 当地咨询
           </label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox2" value="option2"/> 行程规划
           </label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox3" value="option3"/> 语言帮助
           </label>
           <label className="checkbox-inline">
           <input type="checkbox" id="inlineCheckbox3" value="option3"/> 其它 <input className="inline placeholder" type='text' placeholder=""/>
           </label>
           <CommentText text='旅行服务为您愿意为游客免费提供的一些旅行帮助'/>
           </div>
          */}
        </form>
        <hr style={{border:'1px dashed #ddd'}}/>
        <label className="">预定设置<span style={this.styles.asterisk}>*</span></label>
        <CommodityPlans
          plans={this.props.plans}
          handleSubmitState={this.props.handleChildSubmitState.bind(this)}
        />
      </div>
    );
  }
});

export const CommodityModifyBasic = commodityModifyBasic;
