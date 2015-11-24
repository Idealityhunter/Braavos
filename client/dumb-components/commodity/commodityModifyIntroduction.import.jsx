var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyIntroduction = React.createClass({
  mixins: [IntlMixin],
  placeholders: {
    introduction: '请添加商品介绍，您可粘贴图片或编辑文字描述'
  },

  render() {
    return (
      <div className="commodity-introduction-wrap">
        <form className="form-horizontal">
          <div className="form-group introduction">
            <label className="">商品介绍</label>
            <div className="essay-contents">
              <script id="ueContainer" name="content" type="text/plain" style={{height: 400}}></script>
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