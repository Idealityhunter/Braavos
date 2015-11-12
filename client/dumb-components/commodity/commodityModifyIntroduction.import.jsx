var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyIntroduction = React.createClass({
  mixins: [IntlMixin],
  componentWillMount() {
    text = '\n\n\n\n\n\n请输入商品介绍';
  },
  componentDidMount() {
    $('textarea').on('blur', function(e){
      console.log(e.target.value);
    });
  },
  render() {
    return (
      <div className="commodity-introduction-wrap">
        <form className="form-horizontal">
          <div className="form-group introduction">
            <label className="">商品介绍</label>
            {/*
              TODO add the text editor
            */}
            <textarea className="form-control" rows="13" placeholder={text}/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyIntroduction = commodityModifyIntroduction;