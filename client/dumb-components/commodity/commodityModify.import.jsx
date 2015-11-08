import {Pageheading} from '/client/dumb-components/common/pageheading';
import {CommodityModifyBasic} from '/client/dumb-components/commodity/commodityModifyBasic';
import {CommodityModifyIntroduction} from '/client/dumb-components/commodity/commodityModifyIntroduction';
import {CommodityModifyInstruction} from '/client/dumb-components/commodity/commodityModifyInstruction';
import {CommodityModifyBook} from '/client/dumb-components/commodity/commodityModifyBook';
import {CommodityModifyTraffic} from '/client/dumb-components/commodity/commodityModifyTraffic';


var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodityModify = React.createClass({
  mixins: [IntlMixin],
  componentDidMount (){
    $(".steps-container").steps({
      headerTag: "h3",
      bodyTag: "div",
      transitionEffect: "fade",
      autoFocus: true
    });
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });
  },
  render() {
    let prefix = 'commodities.';
    return (
      <div className="commodity-modify-wrap">
        <Pageheading root="首页" category="商品管理" title="商品修改"/>
        <div className='steps-container'>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'basic')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'introduction')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'instruction')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'book')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'traffic')}/></h3>
          <div className="basic"><CommodityModifyBasic /></div>
          <div><CommodityModifyIntroduction /></div>
          <div><CommodityModifyInstruction /></div>
          <div><CommodityModifyBook /></div>
          <div><CommodityModifyTraffic /></div>
        </div>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
