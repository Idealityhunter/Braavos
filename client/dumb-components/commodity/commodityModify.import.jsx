import {Pageheading} from '/client/dumb-components/common/pageheading';
import {CommodityModifyBasic} from '/client/dumb-components/commodity/commodityModifyBasic';
import {CommodityModifyIntroduction} from '/client/dumb-components/commodity/commodityModifyIntroduction';
import {CommodityModifyInstruction} from '/client/dumb-components/commodity/commodityModifyInstruction';
import {CommodityModifyBook} from '/client/dumb-components/commodity/commodityModifyBook';
import {CommodityModifyTraffic} from '/client/dumb-components/commodity/commodityModifyTraffic';


const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityModify = React.createClass({
  getInitialState(){
    return {
      plans: []
    }
  },

  getMeteorData() {
    Meteor.subscribe('sellerInfo');
    console.log('haha');
    return {};
  },

  handleChildSubmitState(plans){
    console.log(this);
    this.setState({
      plans: plans
    });
    return ;
  },
  mixins: [IntlMixin],
  componentDidMount (){
    self = this;
    $(".steps-container").steps({
      headerTag: "h3",
      bodyTag: "div",
      transitionEffect: "fade",
      autoFocus: true,
      onFinishing: function (event, currentIndex) {
        // TODO 验证和提交
        //当前step form
        //const form = $(this);

        // TODO 获取数据
        const commodityInfo = {
          title: $('.form-group.title>input').val(),
          country: $('.form-group.address>select').val(),
          address: $('.form-group.address>input').val(),
          category: [$('.form-group.category>select').val()],
          costTime: $('.form-group.cost-time>input').val(),
          //marketPrice: $('.form-group.cost-time>input').val(),
          //stock: $('.form-group.cost-time>input').val(),
          price: $('.form-group.cost-time>input').val(),
          //book: $('.form-group.book>textarea').val(),
          //unbook: $('.form-group.unbook>textarea').val(),
          //chargeInclude: $('.form-group.charge-include>textarea').val(),
          //chargeExcept: $('.form-group.charge-except>textarea').val(),
          //usage: $('.form-group.usage>textarea').val(),
          //attention: $('.form-group.attention>textarea').val(),
          //traffic: $('.form-group.traffic>textarea').val(),
          //desc: $('.form-group.introduction>textarea').val(),
          plans: self.state.plans
        };

        // TODO 提交并验证
        Meteor.call('addCommodity', Meteor.userId(), commodityInfo, function(err, res){
          // TODO 回调结果反应
          console.log(err);
          console.log(res);
        });

        // steps插件在return false时,title的样式会有不同
        return true;
      }
    });
    // TODO 理解jquery validate的用法
    //.validate({
    //  errorPlacement: function (error, element) {
    //    element.before(error);
    //  },
    //  rules: {
    //    confirm: {
    //      equalTo: "#password"
    //    }
    //  }
    //});

    // datepicker的绑定,要放在steps后,疑似steps改变了DOM结构,待考证
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });
  },
  render() {
    const prefix = 'commodities.modify.';
    return (
      <div className="commodity-modify-wrap">
        <Pageheading root="首页" category="商品管理" title="商品修改"/>
        <div className='steps-container'>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'basic')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'introduction')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'instruction')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'book')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'traffic')}/></h3>
          <div className="basic"><CommodityModifyBasic handleChildSubmitState={this.handleChildSubmitState.bind(this)}/></div>
          <div className="introduction"><CommodityModifyIntroduction /></div>
          <div className="instruction"><CommodityModifyInstruction /></div>
          <div className="book"><CommodityModifyBook /></div>
          <div className="traffic"><CommodityModifyTraffic /></div>
        </div>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
