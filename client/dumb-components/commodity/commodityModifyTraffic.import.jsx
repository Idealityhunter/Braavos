var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyTraffic = React.createClass({
  mixins: [IntlMixin],
  placeholders: {
    trafficInfo: '请输入给游客的交通建议，比如游玩地址或乘车方案'
  },

  render() {
    return (
      <div className="commodity-traffic-wrap">
        <form className="form-horizontal">
          <div className="form-group traffic">
            <label className="">交通提示</label>
            <textarea className="form-control placeholder" rows="13"
                      placeholder={this.placeholders.trafficInfo}
                      defaultValue={(this.props.trafficInfo.length > 0) ? this.props.trafficInfo[0].body : ''}/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyTraffic = commodityModifyTraffic;