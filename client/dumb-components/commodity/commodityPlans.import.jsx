import {CommentText} from '/client/dumb-components/common/comment-text';

const commodityPlans = React.createClass({
  getInitialState(){
    return {
      // 会影响: 修改状态下的条款以及增加的项目(的calendar是否展示)
      priceFollowDate: true,
      plans: [{
        planId: 'aaaa',
        name: '泰国清迈Oasis Spa绿洲水疗体验按摩',
        marketPrice: 59,
        price: 30,
        //pricing: [{
        //  price: 30,
        //  timerange: [new Date('2010-1-1'), new Date('2010-1-3')]
        //}, {
        //  price: 33,
        //  timerange: [new Date('2010-1-3'), new Date('2010-1-5')]
        //}],
        stock: 100
      },{
        planId: 'aaaa',
        name: '泰国清迈Oaaaasis Spa绿洲水疗体验按摩',
        marketPrice: 59,
        price: 30,
        stock: 100
      },{
        planId: 'aaaa',
        name: '泰国清迈Oassssis Spa绿洲水疗体验按摩',
        marketPrice: 59,
        price: 30,
        stock: 100
      }]
    }
  },
  // 套餐进入修改状态
  _handleModify(e) {
    e.preventDefault();
    const index = $(e.target).parents('tr').attr('data-id');
    console.log(index);
  },
  // 删除套餐
  _handleDelete(e) {
    e.preventDefault();
    const index = $(e.target).parents('tr').attr('data-id');
    this.setState({
      plans: !this.state.plans.splice(index, 1) || this.state.plans
    });
  },
  // 复制套餐
  _handleCopy(e) {
    e.preventDefault();
    const index = $(e.target).parents('tr').attr('data-id');
    this.setState({
      plans: this.state.plans.concat(this.state.plans[index])
    });
  },
  render() {
    let i = 0;
    const planList = this.state.plans.map(plan =>
      <tr data-id={i++} key={'plan-' + i}>
        <td className="">{plan.name}</td>
        <td className="">市场价￥{plan.marketPrice}</td>
        <td className="">售价￥{plan.price}起<i className="fa fa-calendar cursor-pointer calender-price" data-toggle="modal" data-target="#myModal"/></td>
        <td className="">库存{plan.stock}</td>
        <td className="controler">
          <button className="" style={{marginRight: 10}} onClick={this._handleModify}>修改</button>
          <button className="" style={{marginRight: 10}} onClick={this._handleDelete}>删除</button>
          <button className="" style={{marginRight: 10}} onClick={this._handleCopy}>复制</button>
        </td>
      </tr>
    );
    return (
      <div className="commodity-basic-plan">
        <form className="form-horizontal commodity-basic-form-wrap">
          <div className="form-group">
            <label className="label-text">使用日期</label>
            <label className="checkbox-inline">
              <input type="checkbox" defaultChecked="checked"/> 需要使用日期
            </label>
            <CommentText text='是否需要游客在预定时指定他的使用日期'/>
          </div>
          <table className="table">
            <tbody>
              {planList}
            </tbody>
          </table>
          <div className="form-group commodity-add">
            <div className="inline desc"><input type='text' placeholder="套餐描述" /></div>
            <div className="inline price-ave"><input type='text' placeholder="市场价" /></div>
            <div className="inline price-cur">
              <input type='text' className="inline" placeholder="售价" />
              <i className="fa fa-calendar cursor-pointer calender-price" style={{marginLeft: -20}} data-toggle="modal" data-target="#myModal"/>
            </div>
            <div className="inline stock">
              <input type='text' className="inline" placeholder="库存" />
            </div>
            <div className="inline add-button"><button className="">确定</button></div>
          </div>
        </form>
        <div className="modal inmodal" id="myModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content animated bounceInRight">
              <div className="modal-header">
                set price fo 泰国清迈Oasis Spa绿洲水疗体验按摩
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              </div>
              <div className="modal-body">
                <div className="commodity-basic-price-wrap">
                  <input className="inline commodity-basic-price" type='text' placeholder="售价"/>
                  <div className="inline">
                    <div className="form-group commodity-basic-datepicker inline">
                      <div className="input-daterange input-group">
                        <input type="text" className="input-sm form-control" name="start" placeholder="from"/>
                        <span className="input-group-addon">-</span>
                        <input type="text" className="input-sm form-control" name="end" placeholder="to"/>
                      </div>
                    </div>
                  </div>
                  <input className="inline commodity-basic-price" type='text' placeholder="售价"/>
                  <div className="inline">
                    <div className="form-group commodity-basic-datepicker inline">
                      <div className="input-daterange input-group">
                        <input type="text" className="input-sm form-control" name="start" placeholder="from"/>
                        <span className="input-group-addon">-</span>
                        <input type="text" className="input-sm form-control" name="end" placeholder="to"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="plus">+</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export const CommodityPlans = commodityPlans;