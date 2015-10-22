let commodityModifyInstruction = React.createClass({
  //let textChargeExcept = ;
  //let textChargeExcept = ;
  //let textChargeExcept = ;
  //let textChargeExcept = ;

  render() {
    return (
      <div className="commodity-instruction-wrap">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="">费用包含*</label>
            <textarea className="form-control" rows="3" placeholder="请输入费用所包含的项目" defaultValue="王老五"/>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyInstruction = commodityModifyInstruction;