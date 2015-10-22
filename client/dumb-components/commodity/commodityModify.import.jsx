import {Pageheading} from 'client/dumb-components/common/pageheading';
import {CommodityModifyInstruction} from 'client/dumb-components/commodity/commodityModifyInstruction';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodityModify = React.createClass({
  mixins: [IntlMixin],

  render() {
    let prefix = 'commodityMgmt.';
    return (
      <div className="commodity-mngm-wrap">
        <Pageheading root="首页" category="商品管理" title="商品修改"/>
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#tab-1"><FormattedMessage message={this.getIntlMessage(prefix + 'basic')}/></a></li>
            <li><a data-toggle="tab" href="#tab-2"><FormattedMessage message={this.getIntlMessage(prefix + 'introduction')} /></a></li>
            <li><a data-toggle="tab" href="#tab-3"><FormattedMessage message={this.getIntlMessage(prefix + 'instruction')} /></a></li>
            <li><a data-toggle="tab" href="#tab-4"><FormattedMessage message={this.getIntlMessage(prefix + 'traffic')} /></a></li>
            <li><a data-toggle="tab" href="#tab-5"><FormattedMessage message={this.getIntlMessage(prefix + 'book')} /></a></li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="panel-body">
                <strong>Lorem ipsum dolor sit amet, consectetuer adipiscing</strong>

                <p>A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of
                  existence in this spot, which was created for the bliss of souls like mine.</p>

                <p>I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at
                  the present moment; and yet I feel that I never was a greater artist than now. When.</p>
              </div>
            </div>
            <div id="tab-2" className="tab-pane">
              <div className="panel-body">
                <strong>Donec quam felis</strong>

                <p>Thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects
                  and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath </p>

                <p>I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite
                  sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet.</p>
              </div>
            </div>
            <div id="tab-3" className="tab-pane">
              <div className="panel-body">
                <CommodityModifyInstruction />
              </div>
            </div>
            <div id="tab-3" className="tab-pane">
              <div className="panel-body">
                <h4>银行卡</h4>
                <ul>
                  <li>2134 5217 3971 1</li>
                  <li>2134 5217 3971 1</li>
                  <li>2134 5217 3971 1</li>
                  <li>2134 5217 3971 1</li>
                </ul>
                <h4>添加</h4>
                <input type="text" placeholder="请输入您的银行卡号"/>
                <button>添加</button>
              </div>
            </div>
            <div id="tab-3" className="tab-pane">
              <div className="panel-body">
                <h4>银行卡</h4>
                <ul>
                  <li>2134 5217 3971 1</li>
                  <li>2134 5217 3971 1</li>
                  <li>2134 5217 3971 1</li>
                  <li>2134 5217 3971 1</li>
                </ul>
                <h4>添加</h4>
                <input type="text" placeholder="请输入您的银行卡号"/>
                <button>添加</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
