var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

//let commodityModifyBasic = React.createClass({
class commodityModifyBasic extends React.Component {
  componentWillMount() {
    text = '\n\n\n\n\n\n输入给游客的交通建议';
  }

  componentDidMount() {
    $('textarea').on('blur', function (e) {
      console.log(e.target.value);
    });
  }

  render() {
    return (
      <div className="commodity-basic-wrap">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">交通提示</label>
            <textarea className="form-control" rows="13" placeholder={text}/>
          </div>
        </form>
      </div>
    );
  }
//});
};

export const CommodityModifyBasic = commodityModifyBasic;