import {CommentText} from '/client/dumb-components/common/comment-text';
import {CommodityGallery} from '/client/dumb-components/commodity/commodityGallery';
import {CommodityCalendar} from '/client/dumb-components/commodity/commodityCalendar';
import {CommodityPlans} from '/client/dumb-components/commodity/commodityPlans';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityModifyBasic = React.createClass({
  mixins: [IntlMixin],
  getDefaultProps(){
    // 传入下一层的数据
    return {
      plans: []
      //plans: [{
      //  //showModal: false,
      //  //key: Meteor.uuid(),
      //  //status: 'view',
      //  planId: 'aaaa',
      //  title: '泰国清迈Oasis Spa绿洲水疗体验按摩',
      //  marketPrice: 59,
      //  price: 30,
      //  pricing: [{
      //    price: 30,
      //    timeRange: [new Date('2010-1-1'), new Date('2010-1-3')]
      //  }, {
      //    price: 33,
      //    timeRange: [new Date('2010-1-3'), new Date('2010-1-5')]
      //  }],
      //  stock: 100
      //},{
      //  planId: 'aaaa',
      //  title: '泰国清迈Oaaaasis Spa绿洲水疗体验按摩',
      //  marketPrice: 59,
      //  price: 30,
      //  pricing: [{
      //    price: 30,
      //    timeRange: [new Date('2010-11-1'), new Date('2010-11-3')]
      //  }, {
      //    price: 33,
      //    timeRange: [new Date('2010-11-3'), new Date('2010-11-5')]
      //  }],
      //  stock: 100
      //},{
      //  planId: 'aaaa',
      //  title: '泰国清迈Oassssis Spa绿洲水疗体验按摩',
      //  marketPrice: 59,
      //  pricing: [],//注意一定要有初始值
      //  price: 30,
      //  pricing: [{
      //    price: 30,
      //    timeRange: [new Date('2010-11-1'), new Date('2010-11-3')]
      //  }],
      //  stock: 100
      //}]
    }
  },

  render() {
    const prefix = 'commodities.modify.basicTab.';
    return (
      <div className="commodity-basic-wrap">
        <label className=""><FormattedMessage message={this.getIntlMessage(prefix + 'commodityImages')}/></label>
        <CommodityGallery />
        <hr style={{border:'1px dashed #ddd'}}/>
        <label className=""><FormattedMessage message={this.getIntlMessage(prefix + 'basicInfo')}/></label>
        <form className="form-horizontal commodity-basic-form-wrap">
          <div className="form-group title">
            <label className="label-text"><FormattedMessage message={this.getIntlMessage(prefix + 'commodityName')}/>*</label>
            <input className="inline" type='text' placeholder=""/>
          </div>
          <div className="form-group address">
            <label className="label-text"><FormattedMessage message={this.getIntlMessage(prefix + 'addressInfo')}/>*</label>
            <select name="" id="" className="form-control" defaultValue="0">
              <option value="0">中国</option>
              <option value="1">泰国</option>
              <option value="2">菲律宾</option>
            </select>
            {/*
             <select name="" id="" className="form-control" defaultValue="0">
             <option value="0">海南</option>
             <option value="1">北京</option>
             <option value="2">上海</option>
             </select>
            */}

            <input className="inline" type='text' placeholder=""/>
          </div>
          <div className="form-group category">
            <label className="label-text"><FormattedMessage message={this.getIntlMessage(prefix + 'commodityCategories')}/>*</label>
            <select name="" id="" className="form-control" defaultValue="0">
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
            <label className="label-text"><FormattedMessage message={this.getIntlMessage(prefix + 'timeCost')}/></label>
            <input className="inline" type='text' placeholder="" style={{width:50,textAlign:'center'}}/><FormattedMessage message={this.getIntlMessage(prefix + 'hour')}/>
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
           <input type="checkbox" id="inlineCheckbox3" value="option3"/> 其它 <input className="inline" type='text' placeholder=""/>
           </label>
           <CommentText text='旅行服务为您愿意为游客免费提供的一些旅行帮助'/>
           </div>
          */}
        </form>
        <hr style={{border:'1px dashed #ddd'}}/>
        <label className="">预定设置*</label>
        <CommodityPlans plans={this.props.plans} handleSubmitState={this.props.handleChildSubmitState.bind(this)}/>
      </div>
    );
  }
});

export const CommodityModifyBasic = commodityModifyBasic;
