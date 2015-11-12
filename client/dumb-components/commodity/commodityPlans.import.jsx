import {CommentText} from '/client/dumb-components/common/comment-text';
import {CommodityPlansModal} from '/client/dumb-components/commodity/commodityPlansModal';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityPlans = React.createClass({
  mixins: [IntlMixin],
  getInitialState(){
    return {
      // 会影响: 修改状态下的条款以及增加的项目(的calendar是否展示)
      dateRequired: true,
      // 存储当前新增套餐的值(以防同时进行添加和修改,modal改变以至于无法保存pricing值)
      addPlan: {
        showModal: false,
        title: '',
        status: 'edit',
        marketPrice: '',
        price: '',
        modalPrice: '',
        pricing: [],
        modalPricing: [],
        stock: ''
      },
      // Bug: 这种方法,假如另一边有人在操作,则数据的变动会无法传进来啊
      plans: this.props.plans.map(plan => _.extend(plan, {
        showModal: false,
        key: Meteor.uuid(),
        status: 'view',
        modalPrice: plan.price,
        modalPricing: plan.pricing//存储pricing的副本,当modal提交时会覆盖此处
      }))
    }
  },

  // 套餐进入修改状态
  _handleModify(e) {
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const arrayIndex = curIndex - 1;
    let copyPlan = this.state.plans.slice();
    copyPlan[arrayIndex].status = 'edit';
    this.setState({
      plans: copyPlan
    });
  },

  // 删除套餐
  _handleDelete(e) {
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const arrayIndex = curIndex - 1;
    let copyPlan = this.state.plans.slice();
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
    let copyPlan = this.state.plans;
    copyPlan = copyPlan.concat(_.clone(this.state.plans[arrayIndex]));
    copyPlan[copyPlan.length - 1].key = Meteor.uuid();
    this.props.handleSubmitState(copyPlan);
    this.setState({
      plans: copyPlan
    });
  },

  // 添加套餐
  _handleAddPlan(e) {
    e.preventDefault();
    const addForm = $(e.target).parents('.commodity-add')[0];
    let copyPlan = this.state.plans.slice();
    copyPlan = copyPlan.concat({
      title: $(addForm).children('.title').children('input').val(),
      marketPrice: $(addForm).children('.market-price').children('input').val(),
      price: $(addForm).children('.price').children('input').val(),
      modalPrice: $(addForm).children('.price').children('input').val(),
      pricing: this.state.addPlan.modalPricing,
      modalPricing: this.state.addPlan.modalPricing,
      stock: $(addForm).children('.stock').children('input').val(),
      key: Meteor.uuid()
    });

    // 提交修改给父组件
    this.props.handleSubmitState(copyPlan);
    this.setState({
      plans: copyPlan
    });
  },

  // 修改是否需要日期(calendar)
  _handleDateRequired(e) {
    this.setState({
      dateRequired: !this.state.dateRequired// 当为true的时候有calendar并且会用组件填充售价(price);当为false的时候没有calendar,自己输入售价
    });
  },

  // plan在修改状态下确认修改
  _handleSubmitEdit(e) {
    e.preventDefault();
    const $trElement = $(e.target).parents('tr');
    const curIndex = $trElement.attr('data-id');
    const arrayIndex = curIndex - 1;

    // 非state存储的编辑结果的获取
    const title = $trElement.children('.title').children('input').val();
    const marketPrice = $trElement.children('.market-price').children('input').val();
    const price = $trElement.children('.price').children('input').val();
    const stock = $trElement.children('.stock').children('input').val();

    let copyPlan = this.state.plans.slice();
    _.extend(copyPlan[arrayIndex], {
      status: 'view',
      title: title,
      marketPrice: marketPrice,
      price: copyPlan[arrayIndex].modalPrice,
      pricing: copyPlan[arrayIndex].modalPricing,
      stock: stock
    });

    // 提交修改给父组件
    this.props.handleSubmitState(copyPlan);
    this.setState({
      plans: copyPlan
    });

    // TODO 清除修改记录(addplan中应该为空,包括modal层)
  },

  // plan在修改状态下取消修改
  _handleCancelEdit(e) {
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const arrayIndex = curIndex - 1;
    let copyPlan = this.state.plans.slice();
    _.extend(copyPlan[arrayIndex],{
      status: 'view',
      modalPrice: copyPlan[arrayIndex].price,
      modalPricing: copyPlan[arrayIndex].pricing
    });
    this.setState({
      plans: copyPlan
    });
  },

  // 控制modal的消失
  _handleCancelModal(modalIndex){
    const curIndex = modalIndex;
    if (curIndex == 0){
      this.setState({
        addPlan: _.extend(this.state.addPlan, {
          showModal: false
        })
      });
    }else{
      const arrayIndex = curIndex - 1;
      let copyPlan = this.state.plans.slice();
      _.extend(copyPlan[arrayIndex], {
        showModal: false
      });
      this.setState({
        plans: copyPlan
      });
    }
  },

  // 控制modal的展示
  _handleShowModal(e){
    if ($(e.target).parents('.commodity-add').length > 0){
      this.setState({
        addPlan: _.extend(this.state.addPlan, {
          existModal: true,
          showModal: true
        })
      });
    }else{
      const curIndex = $(e.target).parents('tr').attr('data-id');
      const arrayIndex = curIndex - 1;
      let copyPlan = this.state.plans.slice();
      copyPlan[arrayIndex] = _.extend(copyPlan[arrayIndex], {
        existModal: true,
        showModal: true
      });
      this.setState({
        plans: copyPlan
      });
    }
  },

  // 控制modal修改的保存
  _handleSubmitModal(pricing, modalIndex){
    const curIndex = modalIndex;
    if (curIndex == 0){
      this.setState({
        addPlan: _.extend(this.state.addPlan, {
          existModal: false,
          showModal: false,
          modalPricing: pricing,
          modalPrice: _.reduce(pricing, function(min, pricingItme){ return Math.min(min, pricingItme.price)}, Number.MAX_VALUE)
        })
      });
    }else{
      const arrayIndex = curIndex - 1;
      let copyPlan = this.state.plans.slice();
      _.extend(copyPlan[arrayIndex],{
        existModal: false,
        showModal: false,
        modalPricing: pricing,
        modalPrice: _.reduce(pricing, function(min, pricingItme){
          return Math.min(min, pricingItme.price)
        }, Number.MAX_VALUE)
      });
      this.setState({
        plans: copyPlan
      });
    }
  },
  render() {
    const prefix = 'commodities.modify.';
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
          {(this.state.dateRequired)
            ? <input className="inline" type='text' placeholder="售价￥" value={plan.price} onClick={this._handleShowModal}/>
            : <input className="inline" type='text' placeholder="售价￥" defaultValue={plan.price}/>
          }
          <i className={"fa fa-calendar cursor-pointer calender-price" + ((this.state.dateRequired) ? "" : " hidden")} style={{marginLeft: -20}} onClick={this._handleShowModal}/>
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
        <td className="price">售价￥{plan.price}起<i className={"fa fa-calendar cursor-pointer calender-price" + ((this.state.dateRequired) ? "" : " hidden")} onClick={this._handleShowModal} style={{marginLeft: 2}}/></td>
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
        onClose = {this._handleCancelModal}
        onSubmit = {this._handleSubmitModal}
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
              <input type='text' placeholder="套餐描述" defaultValue={this.state.addPlan.title}/>
            </div>
            <div className="inline market-price">
              <input type='text' placeholder="市场价￥" defaultValue={this.state.addPlan.marketPrice}/>
            </div>
            <div className="inline price">
              {(this.state.dateRequired)
                ? <input className="inline" type='text' placeholder="售价￥" value={this.state.addPlan.modalPrice} onClick={this._handleShowModal}/>
                : <input className="inline" type='text' placeholder="售价￥" defaultValue={this.state.addPlan.modalPrice}/>
              }
              <i className={"fa fa-calendar cursor-pointer calender-price" + ((this.state.dateRequired) ? "" : " hidden")} style={{marginLeft: -20}} onClick={this._handleShowModal}/>
            </div>
            <div className="inline stock">
              <input type='text' className="inline" placeholder="库存" defaultValue={this.state.addPlan.stock}/>
            </div>
            <div className="inline add-button">
              <button className="" onClick={this._handleAddPlan}>确定</button>
            </div>
            <CommodityPlansModal
              index = {0}
              plan = {this.state.addPlan}
              onClose = {this._handleCancelModal}
              onSubmit = {this._handleSubmitModal}
            />
          </div>
        </form>
      </div>
    )
  }
});

export const CommodityPlans = commodityPlans;