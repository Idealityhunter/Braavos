var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyTraffic = React.createClass({
  mixins: [IntlMixin],
  componentWillMount() {
    text = '\n\n\n\n\n\n请输入给游客的交通建议';
  },
  componentDidMount() {
    $('textarea').on('blur', function(e){
      console.log(e.target.value);
    });
  },
  render() {
    return (
      <div className="commodity-traffic-wrap">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">交通提示</label>
            <textarea className="form-control" rows="13" placeholder={text}/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyTraffic = commodityModifyTraffic;