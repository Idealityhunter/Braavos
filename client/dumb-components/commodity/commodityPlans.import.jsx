import {CommentText} from '/client/dumb-components/common/comment-text';
import {CommodityPlansModal} from '/client/dumb-components/commodity/commodityPlansModal';

const commodityPlans = React.createClass({
  getInitialState(){
    return {
      // 会影响: 修改状态下的条款以及增加的项目(的calendar是否展示)
      dateRequired: true,
      // 当为负数时表示触发的是addPlan的modal,假如为非负整数则为modifyPlan的modal
      // curPlanIndex: -1,
      // 存储当前新增套餐的值(以防同时进行添加和修改,modal改变以至于无法保存pricing值)
      addPlan: {
        title: 'aaasad',
        pricing: [{
          price: 301,
          timeRange: [new Date('2010-1-1'), new Date('2010-1-3')]
        }, {
          price: 332,
          timeRange: [new Date('2010-1-3'), new Date('2010-1-5')]
        }]
      },
      plans: [{
        key: Meteor.uuid(),
        status: 'edit',
        planId: 'aaaa',
        title: '泰国清迈Oasis Spa绿洲水疗体验按摩',
        marketPrice: 59,
        price: 30,
        pricing: [{
          price: 30,
          timeRange: [new Date('2010-1-1'), new Date('2010-1-3')]
        }, {
          price: 33,
          timeRange: [new Date('2010-1-3'), new Date('2010-1-5')]
        }],
        stock: 100
      },{
        key: Meteor.uuid(),
        status: 'view',
        planId: 'aaaa',
        title: '泰国清迈Oaaaasis Spa绿洲水疗体验按摩',
        marketPrice: 59,
        price: 30,
        pricing: [{
          price: 30,
          timeRange: [new Date('2010-11-1'), new Date('2010-11-3')]
        }, {
          price: 33,
          timeRange: [new Date('2010-11-3'), new Date('2010-11-5')]
        }],
        stock: 100
      },{
        key: Meteor.uuid(),
        status: 'view',
        planId: 'aaaa',
        title: '泰国清迈Oassssis Spa绿洲水疗体验按摩',
        marketPrice: 59,
        pricing: [],//注意一定要有初始值
        price: 30,
        stock: 100
      }]
    }
  },
  // 套餐进入修改状态
  _handleModify(e) {
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const arrayIndex = curIndex - 1;
    // TODO 进入修改状态
  },
  // 删除套餐
  _handleDelete(e) {
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const arrayIndex = curIndex - 1;
    let copyPlan = this.state.plans && this.state.plans.slice();
    copyPlan.splice(arrayIndex, 1);
    this.setState({
      plans: copyPlan
    });
  },
  // 复制套餐
  _handleCopy(e) {
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const arrayIndex = curIndex - 1;
    this.setState({
      plans: this.state.plans.concat(this.state.plans[arrayIndex])
    });
  },
  // 添加套餐
  _handleAddPlan(e) {
    e.preventDefault();
    const addForm = $(e.target).parents('.commodity-add')[0];
    this.setState({
      plans: this.state.plans.concat({
        name: $(addForm).children('.title').children('input').val(),
        marketPrice: $(addForm).children('.market-price').children('input').val(),
        price: $(addForm).children('.price').children('input').val(),
        stock: $(addForm).children('.stock').children('input').val()
      })
    });
  },
  // 修改是否需要日期(calendar)
  _handleDateRequired(e) {
    this.setState({
      dateRequired: !this.state.dateRequired// 当为true的时候有calendar并且会用组件填充售价(price);当为false的时候没有calendar,自己输入售价
    });
  },
  render() {
    let i = 0;//从1开始,0表示添加的input
    const planList = this.state.plans.map(plan => (plan.status == 'edit') ? (
      <tr className="plan-wrap" data-id={++i} key={plan.key}>
        <td className="title">
          <input className="inline" type='text' placeholder="套餐描述" defaultValue={plan.title}/>
        </td>
        <td className="market-price">
          <input className="inline" type='text' placeholder="市场价￥" defaultValue={plan.marketPrice}/>
        </td>
        <td className="price">
          <input className="inline" type='text' placeholder="售价￥" defaultValue={plan.price}/>
          <i className="fa fa-calendar cursor-pointer calender-price" style={{marginLeft: -20}} data-toggle="modal" data-target={"#calendar-modal-" + i}/>
        </td>
        <td className="stock">
          <input className="inline" type='text' placeholder="库存" defaultValue={plan.stock}/>
        </td>
        <td className="controller">
          <button className="" onClick={this._handleSubmitEdit} style={{marginRight:10}}>确定</button>
          <button className="" onClick={this._handleCancelEdit}>取消</button>
        </td>
      </tr>
    ) : (
      <tr className="plan-wrap" data-id={++i} key={plan.key}>
        <td className="title">{plan.title}</td>
        <td className="market-price">市场价￥{plan.marketPrice}</td>
        <td className="price">售价￥{plan.price}起<i className="fa fa-calendar cursor-pointer calender-price" data-toggle="modal" data-target={"#calendar-modal-" + i} style={{marginLeft: 2}}/></td>
        <td className="stock">库存{plan.stock}</td>
        <td className="controller">
          <button className="" style={{marginRight: 10}} onClick={this._handleModify}>修改</button>
          <button className="" style={{marginRight: 10}} onClick={this._handleDelete}>删除</button>
          <button className="" style={{marginRight: 10}} onClick={this._handleCopy}>复制</button>
        </td>
      </tr>
    ));
    let j = 0;
    const modalList = this.state.plans.map(plan =>
      <CommodityPlansModal
        plan = {this.state.plans[j]}
        index = {++j}
      />
    )
    return (
      <div className="commodity-basic-plan">
        <form className="form-horizontal commodity-basic-form-wrap">
          <div className="form-group">
            <label className="label-text">使用日期</label>
            <label className="checkbox-inline">
              <input type="checkbox" defaultChecked="checked" onChange={this._handleDateRequired}/> 需要使用日期
            </label>
            <CommentText text='是否需要游客在预定时指定他的使用日期'/>
          </div>
          <table className="table">
            <tbody>
              {planList}

            </tbody>
          </table>
          {modalList}
          <div className="form-group commodity-add">
            <div className="inline title">
              <input type='text' placeholder="套餐描述"/>
            </div>
            <div className="inline market-price">
              <input type='text' placeholder="市场价￥"/>
            </div>
            <div className="inline price">
              <input type='text' className="inline" placeholder="售价￥" />
              <i className="fa fa-calendar cursor-pointer calender-price" style={{marginLeft: -20}} data-toggle="modal" data-target="#calendar-modal-0"/>
            </div>
            <div className="inline stock">
              <input type='text' className="inline" placeholder="库存" />
            </div>
            <div className="inline add-button">
              <button className="" onClick={this._handleAddPlan}>确定</button>
            </div>
            <CommodityPlansModal
              index = {0}
              plan = {this.state.addPlan}
            />
          </div>
        </form>
      </div>
    )
  }
});

export const CommodityPlans = commodityPlans;