var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var textChargeInclude, textChargeExcept, textUsage, textAttention;

let commodityModifyInstruction = React.createClass({
  mixins: [IntlMixin],

  styles: {
    asterisk: {
      color: 'coral',
      verticalAlign: 'text-top',
      paddingLeft: 5,
      fontsize: 18
    }
  },

  placeholders: {
    textChargeInclude: '请简单介绍商品费用包含哪些项目',
    textUsage: '请输入商品使用方法',
    textAttention: ''
  },

  defaultValues: {
    textChargeExcept: '1、费用包含中未提及的其他费用及个人消费',
  },

  render() {
    return (
      <div className="commodity-instruction-wrap">
        <form className="form-horizontal">
          <div className="form-group charge-include">
            <label className="">费用包含<span style={this.styles.asterisk}>*</span></label>
            <textarea className="form-control placeholder" rows="3" placeholder={this.placeholders.textChargeInclude}/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group charge-except">
            <label className="">费用不含</label>
            <textarea className="form-control placeholder" rows="3" defaultValue={this.defaultValues.textChargeExcept}/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group usage">
            <label className="">使用方法<span style={this.styles.asterisk}>*</span></label>
            <textarea className="form-control placeholder" rows="8" placeholder={this.placeholders.textUsage}/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group attention">
            <label className="">注意事项</label>
            <textarea className="form-control placeholder" rows="8" placeholder={this.placeholders.textAttention}/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyInstruction = commodityModifyInstruction;