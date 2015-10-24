import {Pageheading} from 'client/dumb-components/common/pageheading';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodity = React.createClass({
  mixins: [IntlMixin],

  render() {
    let prefix = 'commodities.';
    return (
      <div className="commodity-mngm-wrap">
        <Pageheading root="首页" title="商品管理"/>
        <a href="/commodity-mgmt/modify"><button type="button" className="btn btn-info">添加商品</button></a>
      </div>
    );
  }
});

export const Commodity = commodity;
