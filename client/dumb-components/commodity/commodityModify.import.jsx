import {Pageheading} from 'client/dumb-components/common/pageheading';
import {CommodityModifyBasic} from 'client/dumb-components/commodity/commodityModifyBasic';
import {CommodityModifyIntroduction} from 'client/dumb-components/commodity/commodityModifyIntroduction';
import {CommodityModifyInstruction} from 'client/dumb-components/commodity/commodityModifyInstruction';
import {CommodityModifyBook} from 'client/dumb-components/commodity/commodityModifyBook';
import {CommodityModifyTraffic} from 'client/dumb-components/commodity/commodityModifyTraffic';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodityModify = React.createClass({
  mixins: [IntlMixin],

  render() {
    let prefix = 'commodities.';
    return (
      <div className="commodity-modify-wrap">
        <Pageheading root="首页" category="商品管理" title="商品修改"/>
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#tab-1"><FormattedMessage message={this.getIntlMessage(prefix + 'basic')}/></a></li>
            <li><a data-toggle="tab" href="#tab-2"><FormattedMessage message={this.getIntlMessage(prefix + 'introduction')} /></a></li>
            <li><a data-toggle="tab" href="#tab-3"><FormattedMessage message={this.getIntlMessage(prefix + 'instruction')} /></a></li>
            <li><a data-toggle="tab" href="#tab-4"><FormattedMessage message={this.getIntlMessage(prefix + 'book')} /></a></li>
            <li><a data-toggle="tab" href="#tab-5"><FormattedMessage message={this.getIntlMessage(prefix + 'traffic')} /></a></li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="panel-body">
                <CommodityModifyBasic />
              </div>
            </div>
            <div id="tab-2" className="tab-pane">
              <div className="panel-body">
                <CommodityModifyIntroduction />
              </div>
            </div>
            <div id="tab-3" className="tab-pane">
              <div className="panel-body">
                <CommodityModifyInstruction />
              </div>
            </div>
            <div id="tab-4" className="tab-pane">
              <div className="panel-body">
                <CommodityModifyBook />
              </div>
            </div>
            <div id="tab-5" className="tab-pane">
              <div className="panel-body">
                <CommodityModifyTraffic />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
