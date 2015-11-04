import {Breadcrumb} from '/client/dumb-components/common/breadcrumb';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodity = React.createClass({
  mixins: [IntlMixin],

  render() {
    let prefix = 'commodities.';
    return (
      <div className="commodity-mngm-wrap">
        <Breadcrumb />
        <a href="/commodities/editor"><button type="button" className="btn btn-info">添加商品</button></a>
      </div>
    );
  }
});

export const Commodity = commodity;
