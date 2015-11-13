var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyIntroduction = React.createClass({
  mixins: [IntlMixin],
  placeholders: {
    introduction: '请添加商品介绍，您可插入图片或编辑文字描述'
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
            <textarea className="form-control placeholder" rows="13" placeholder={this.placeholders.introduction}/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyIntroduction = commodityModifyIntroduction;