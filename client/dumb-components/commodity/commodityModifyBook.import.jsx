var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let commodityModifyBook = React.createClass({
  mixins: [IntlMixin],
  componentWillMount() {
    // TODO
  },
  componentDidMount() {
    $('textarea').on('blur', function(e){
      console.log(e.target.value);
    });
  },
  render() {
    return (
      <div className="commodity-book-wrap">
        <form className="form-horizontal">
          <div className="form-group book">
            <label className="">预定流程*</label>
            <textarea className="form-control" rows="3" placeholder="请输入预定流程"/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group unbook">
            <label className="">退改规定*</label>
            <textarea className="form-control" rows="3" placeholder="请输入退订或改订的相关规定"/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyBook = commodityModifyBook;