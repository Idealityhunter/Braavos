var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyIntroduction = React.createClass({
  mixins: [IntlMixin],

  render() {
    return (
      <div className="commodity-introduction-wrap">
        <form className="form-horizontal">
          <div className="form-group introduction">
            <label className="" style={{verticalAlign: 'top'}}>商品介绍</label>
            <div className="essay-contents inline">
              <script id="ueContainer" name="content" type="text/plain" style={{height: 400, width: 800}}></script>
            </div>
            {/* origin textarea
             <textarea className="form-control placeholder" rows="13"
             placeholder={this.placeholders.introduction}
             defaultValue={(this.props.desc.body) ? this.props.desc.body : ''}/>
            */}
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyIntroduction = commodityModifyIntroduction;