import {CommentText} from '/client/dumb-components/common/comment-text';
import {CommodityGallery} from '/client/dumb-components/commodity/commodityGallery';
import {CommodityCalendar} from '/client/dumb-components/commodity/commodityCalendar';
import {CommodityPlans} from '/client/dumb-components/commodity/commodityPlans';
import {NumberInput} from '/client/common/numberInput';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityModifyBasic = React.createClass({
  mixins: [IntlMixin],

  styles: {
    asterisk: {
      color: 'coral',
      verticalAlign: 'text-top',
      paddingLeft: 5,
      fontsize: 18
    }
  },

  getDefaultProps(){
    // 传入下一层的数据
    return {
      plans: []
    }
  },

  render() {
    const prefix = 'commodities.modify.basicTab.';
    let selectCountryIndex = '';
    let selectCategoryIndex = '';

    // 获取国家对应的option的value
    if (this.props.country && this.props.country.zhName){
      const countryArray = ['中国','菲律宾','泰国'];
      for (let i = 0;i < countryArray.length;i++){
        if (countryArray[i] == this.props.country.zhName){
          selectCountryIndex = i;
        }
      };
    };

    // 获取国家对应的option的value
    if (this.props.category && this.props.category.length > 0){
      const categoryArray = ['特色活动', '文化体验', '美食住宿', '城市游览', '门票预订', '演出', 'SPA', '游船', '其它'];
      for (let i = 0;i < categoryArray.length;i++){
        if (categoryArray[i] == this.props.category[0]){
          selectCategoryIndex = i;
        }
      };
    };

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
            <input className="inline placeholder" type='text' placeholder="" defaultValue={this.props.title || ''}/>
          </div>
          <div className="form-group address">
            <label className="label-text">
              <FormattedMessage message={this.getIntlMessage(prefix + 'addressInfo')}/>
              <span style={this.styles.asterisk}>*</span>
            </label>
            <select name="" id="" className="form-control" placeholder="国家" defaultValue={selectCountryIndex}>
              <option value="0">中国</option>
              <option value="1">泰国</option>
              <option value="2">菲律宾</option>
            </select>
            <select name="" id="" className="form-control" placeholder="城市" defaultValue="">
              <option value="0">海南</option>
              <option value="1">北京</option>
              <option value="2">上海</option>
            </select>

            <input className="inline placeholder" type='text' placeholder="(选填)详细地址" defaultValue={this.props.address || ''}/>
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
            <NumberInput className="inline placeholder" style={{width:50}}
                         value={this.props.timeCost || ''}
                         placeholder=''
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
