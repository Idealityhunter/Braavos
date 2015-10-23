var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var textChargeInclude, textChargeExcept, textUsage, textAttention;

let commodityModifyInstruction = React.createClass({
  mixins: [IntlMixin],
  componentWillMount() {
    textChargeInclude = '1) 输入费用所包含的项目\n2)';
    textChargeExcept = '个人消费及价格包含中未提及的其它费用';
    textUsage = '【收到票券类型】：\n【票券使用方法】：\n【出发和返回时间及地点】：\n【使用说明】：\n【适用门店】：\n【换票方式】：\n【换票地址】：\n【开放和结束时间】：';
    textAttention = '【开放和结束时间】：\n【预约提醒】：\n【验证提醒】：\n【限购限用提醒】：\n【其它优惠】：\n【使用规则】：\n【温馨提示】：\n【商家服务】：';
  },
  componentDidMount() {
    $('textarea').on('blur', function(e){
      console.log(e.target.value);
    });
  },
  render() {
    return (
      <div className="commodity-instruction-wrap">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">费用包含*</label>
            <textarea className="form-control" rows="3" placeholder={textChargeInclude}/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">费用不含</label>
            <textarea className="form-control" rows="3" placeholder="请输入费用不包含的项目" defaultValue={textChargeExcept}/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">使用方法*</label>
            <textarea className="form-control" rows="8" placeholder="请输入商品的使用方法" defaultValue={textUsage}/>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">注意事项</label>
            <textarea className="form-control" rows="8" placeholder="请输入服务中的注意事项" defaultValue={textAttention}/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyInstruction = commodityModifyInstruction;