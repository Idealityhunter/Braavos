import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button} from "/lib/react-bootstrap";

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

// 补全underscore的语法
_.findIndex || ( _.findIndex = (arr, cal) => {
  return _.reduce(arr, (memo, arri) => {
    memo.index ++;
    if (cal(arri)) memo.flag = memo.index;
    return memo
  }, {
    index: -1,
    flag: -1
  }).flag;
});

var order = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      options: {}
    }
  },

  getMeteorData() {
    let options = _.clone(this.state.options);
    //const userId = parseInt(Meteor.userId());
    //
    //// 获取用户权限
    //if (BraavosCore.SubsManager.account.ready()) {
    //  const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
    //  const adminRole = 10;
    //  const isAdmin = (_.indexOf(userInfo.roles, adminRole) != -1);
    //  if (isAdmin) options['isAdmin'] = true;
    //}

    // 获取商品信息
    const handleOrder = Meteor.subscribe('orders', options);
    let orders = [];
    if (handleOrder.ready()) {
      //commodities = BraavosCore.Database.Braavos.Commodity.find(_.extend({'seller.sellerId': userId}, this.state.options), {sort: {createTime: -1}}).fetch();
      orders = BraavosCore.Database.Braavos.Order.find({}, {sort: {createTime: -1}}).fetch();
      orders = orders.map(order => _.extend(order, {
        key: Meteor.uuid()
      }));
    }
    return {
      orders: orders,
      //isAdmin: options.isAdmin
    };
  },

  componentDidMount(){
    $('.footable').footable();
    $('.input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      language: 'zh'
    });
  },

  componentDidUpdate(){
    const footable = $('.footable');
    footable.trigger('footable_redraw'); //Redraw the table
  },

  // 商品筛选结果的更新
  _handleFilter(){
    const searchId = $('#order-search').val()
      ? {'searchId': $('#order-search').val()}
      : {};

    let createTimeRange = {};
    if ($('.input-daterange>input[name=start]').val() || $('.input-daterange>input[name=end]').val()) {
      _.extend(createTimeRange, {'createTime': {}})

      if ($('.input-daterange>input[name=start]').val()) {
        _.extend(createTimeRange.createTime, {
          '$gte': $('.input-daterange>input[name=start]').val()
        });
      }
      if ($('.input-daterange>input[name=end]').val()) {
        _.extend(createTimeRange.createTime, {
          '$lte': moment($('.input-daterange>input[name=end]').val()).add(1, 'day').format('YYYY-MM-DD')
        });
      }
    }

    this.setState({
      options: _.extend(searchId, createTimeRange)
    });
  },

  // 重置筛选条件,并且展示所有商品
  _handleReset(){
    // 清空2个选择条件的数据
    $('#order-search').val('');
    $('.input-daterange>input[name=start]').val('');
    $('.input-daterange>input[name=end]').val('');
    $('.input-daterange input').each(function () {
      $(this).datepicker("clearDates");
    });
  },

  // 下架商品
  _handleDropCommodity(e){
    const self = this;
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    swal({
      title: "确认下架?",
      text: "",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "下架",
      closeOnConfirm: false
    }, function () {
      Meteor.call('commodity.status.update', self.data.commodities[curIndex].commodityId, 'disabled', function (err, res) {
        if (err) {
          // 下架失敗
          swal("下架失败!", "", "error");
        }
        ;
        if (res) {
          // 下架成功
          swal("下架成功", "", "success");
        }
      });
    });
  },

  // 上架商品
  _handlePubCommodity(e){
    const self = this;
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    Meteor.call('commodity.status.update', self.data.commodities[curIndex].commodityId, 'pub', function (err, res) {
      if (err) {
        // 上架失败
        swal("上架失败!", "", "error");
      }
      ;
      if (res) {
        // 上架成功
        swal("上架成功!", "", "success");
      }
    });
  },

  // 编辑商品
  _handleEditCommodity(e){
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const curCommodityId = this.data.commodities[curIndex].commodityId;
    FlowRouter.go(`/commodities/editor/${curCommodityId}?isAdmin=${!!this.data.isAdmin}`);
  },

  // 关闭订单处理
  _handleCloseOrder(orderId, e){
    console.log(e);
    console.log(orderId);
  },

  // 获取操作的展示
  _getActionHtml(order){
    switch (order.status){
      case 'pending':
        return [
          <br/>,
          <a href="" onClick={this._handleCloseOrder.bind(this, order.orderId)}>关闭</a>
        ]
      case 'paid':
        return [
          <br/>,
          <a href="">发货</a>,
          <br/>,
          <a href="">缺货退款</a>
        ]
      case 'refundApplied':
        // 是否已发货
        return (_.findIndex(order.activities, (activity) => {activity.action == 'commit'}) == -1)
          ? [
            <br/>,
            <a href="">退款处理</a>,
            <br/>,
            <a href="">发货</a>
          ]
          : [
            <br/>,
            <a href="">退款处理</a>
          ]
      default :
        return ;
    }
  },

  // 获取交易状态的展示
  _getTradeStatusHtml(order) {
    switch (order.status){
      case 'pending':
        return '等待买家付款'
      case 'paid':
        return [
          <p>待发货</p>,
          <p>(买家已付款)</p>
        ]
      case 'committed':
        return '已发货'
      case 'finished':
        return '已成功的订单'
      case 'refundApplied':
        // 是否已发货
        return (_.findIndex(order.activities, (activity) => {activity.action == 'commit'}) == -1)
          ? [
            <p>待退款</p>,
            <p>(买家已付款)</p>
          ]
          : [
            <p>待退款</p>,
            <p>(卖家已发货)</p>
          ]
      case 'cancelled':
        // TODO 谁取消的
        return [
          <p>已关闭</p>,
          <p>(交易取消)</p>
        ]
      case 'expired':
        // TODO 分辨是谁过期!
        return [
          <p>已关闭</p>,
          <p>(买家支付过期)</p>
        ]
      case 'refunded':
        // TODO 从order.activities中获取退款金额
        return [
          <p>已关闭</p>,
          <p>(已退款...元)</p>
        ]
      default:
        // TODO 待做(会有哪些可能性?)
        return ''
    }
  },

  styles: {
    addBtn: {
      marginTop: 25,
      width: 100,
      float: 'left',
      marginLeft: 20
    },
    calendar: {
      marginLeft: -20,
      marginTop: 11,
      verticalAlign: 'top'
    },
    datepickerInput: {
      height: 35,
      backgroundColor: 'rgba(0,0,0,0)'
    }
  },

  render() {
    const prefix = 'orders.';

    // 筛选控制
    const filter =
      <div className="ibox-content m-b-sm border-bottom">
        <div className="row">
          <div className="col-sm-2">
            <div className="form-group">
              <label className="control-label" htmlFor="order-search">
                <FormattedMessage message={this.getIntlMessage(`${prefix}label.search`)}/>
              </label>
              <input id="order-search" name="order-search" placeholder="订单号/买家名/手机号" className="form-control"/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label className="control-label" htmlFor="order-createdDate">
                <FormattedMessage message={this.getIntlMessage(`${prefix}label.createdDate`)}/>
              </label>
              <div className="input-daterange input-group">
                <input type="text" className="input-sm form-control" name="start" placeholder="" defaultValue=""
                       readOnly
                       style={this.styles.datepickerInput}/>
                <i className="fa fa-calendar cursor-pointer calender-price" style={this.styles.calendar}/>
                <span className="input-group-addon">-</span>
                <input type="text" className="input-sm form-control" name="end" placeholder="" defaultValue=""
                       readOnly
                       style={this.styles.datepickerInput}/>
                <i className="fa fa-calendar cursor-pointer calender-price" style={this.styles.calendar}/>
              </div>
            </div>
          </div>
          <ButtonToolbar style={{marginTop:25}}>
            <Button bsStyle="primary" bsSize="small" onClick={this._handleFilter} active>
              <FormattedMessage message={this.getIntlMessage(`${prefix}btn.query`)}/>
            </Button>
            <Button bsStyle="warning" bsSize="small" onClick={this._handleReset} active>
              <FormattedMessage message={this.getIntlMessage(`${prefix}btn.reset`)}/>
            </Button>
          </ButtonToolbar>
        </div>
      </div>;

    const orderTableHead =
      <thead>
        <tr>
          {/*TODO 并没有起到作用!!! => 貌似是react将数字转成了id*/}
          <th data-hide="phone" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.orderId`)}/>
          </th>
          <th data-hide="phone" data-type="numeric" data-sort-ignore="true" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.commodity`)}/>
          </th>
          <th data-hide="phone" data-type="numeric" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.purchaseQuantity`)}/>
          </th>
          <th data-hide="phone">
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.totalAdvancePayment`)}/>
          </th>
          <th data-hide="phone" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.createdDate`)}/>
          </th>
          <th data-hide="phone" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.tradeStatus`)}/>
          </th>
          <th data-hide="phone" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.purchaser`)}/>
          </th>
          <th className="text-right" data-sort-ignore="true">
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.action`)}/>
          </th>
        </tr>
      </thead>;

    // 商品列表行
    const orderList = this.data.orders.map(order =>
        <tr key={order.key} style={(order.status == 'disabled') ? {color: '#aaa'} : {color: '#333'}}>
          <td style={{textAlign:'center'}}>{order.orderId}</td>
          <td data-value={order.commodity.commodityId} style={{textAlign:'center'}}>
            <span>{order.commodity.title}</span>
            <br/>
            <span>商品编号: {order.commodity.commodityId}</span>
          </td>
          <td data-value={order.quantity} style={{textAlign:'center'}}>{order.quantity}</td>
          <td>{order.totalPrice}</td>
          <td style={{textAlign:'center'}}>{moment(order.createTime).format('YYYY-MM-DD')}</td>
          <td style={{color: '#333', textAlign: 'center'}}>
            {this._getTradeStatusHtml(order)}
          </td>s
          <td style={{textAlign:'center'}}>
            <span>{`${order.contact.surname}${order.contact.givenName}`}</span>
            <br/>
            <span>{`手机: ${order.contact.tel.dialCode} ${order.contact.tel.number}`}</span>
            <br/>
            <a href="">留言</a>
          </td>
          <td style={{color: '#333', textAlign: 'center'}}>
            <div className="btn-group">
              <a href="">订单详情</a>
              {this._getActionHtml(order)}
            </div>
          </td>
        </tr>
    );

    const orderTableBody =
      <tbody>
        {orderList}
      </tbody>;

    const orderTableFoot =
      <tfoot>
        <tr>
          {/*<td colSpan={this.data.isAdmin ? "10" : "8"}>*/}
          <td colSpan="6">
            <ul className="pagination pull-right"></ul>
          </td>
        </tr>
      </tfoot>;

    // 商品表格
    const orderTable =
      <div className="row">
        <div className="col-lg-12">
          <div className="ibox">
            <div className="ibox-content">
              <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="10">
                {orderTableHead}
                {orderTableBody}
                {orderTableFoot}
              </table>
            </div>
          </div>
        </div>
      </div>;

    return (
      <div className="order-mngm-wrap">
        <BraavosBreadcrumb />

        <div className="wrapper wrapper-content animated fadeInRight ecommerce">
          {filter}
          {orderTable}
        </div>
      </div>
    );
  }
});

export const Order = order;
