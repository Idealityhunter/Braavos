import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button} from "/lib/react-bootstrap";
import {OrderCloseModal} from '/client/dumb-components/order/orderCloseModal';
import {OrderMixin} from '/client/dumb-components/order/orderMixins';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

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

const order = React.createClass({
  mixins: [IntlMixin, OrderMixin, ReactMeteorData],

  getInitialState(){
    return {
      showCloseModal: false,
      options: {},
      curOrderId: '',
      activeStatus: 'all'
    }
  },

  getMeteorData() {
    let options = _.clone(this.state.options);
    const userId = parseInt(Meteor.userId());
    let isAdmin = false;

    // 获取用户权限
    if (BraavosCore.SubsManager.account.ready()) {
      const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
      const adminRole = 10;
      isAdmin = (_.indexOf(userInfo.roles, adminRole) != -1);
    };

    // 获取商品信息
    const handleOrder = Meteor.subscribe('orders', options, isAdmin);
    let orders;
    let ordersReady = false;
    if (handleOrder.ready()) {
      //最好是按照更新时间来排序吧
      orders = BraavosCore.Database.Braavos.Order.find({}, {sort: {updateTime: -1}}).fetch();
      orders = orders.map(order => _.extend(order, {
        key: Meteor.uuid(),
        totalPrice: order.totalPrice / 100
      }));
      ordersReady = true;
    }

    return {
      orders: orders || [],
      ordersReady: ordersReady
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

  // 订单筛选结果的更新
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
      options: _.extend(this.state.options, searchId, createTimeRange)
    });
  },

  // 重置筛选条件,并且展示所有订单
  _handleReset(){
    // 清空2个选择条件的数据
    $('#order-search').val('');
    $('.input-daterange>input[name=start]').val('');
    $('.input-daterange>input[name=end]').val('');
    $('.input-daterange input').each(function () {
      $(this).datepicker("clearDates");
    });
  },

  // 关闭closeModal
  _handleCloseOrderModalClose(){
    this.setState({
      showCloseModal: false
    })
  },

  // 提交关闭操作
  _handleCloseOrderModalSubmit(reason){
    const self = this;
    swal({
      title: "确认关闭该交易?",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "确认关闭",
    }, () => {
      // 获取关闭交易的理由reason,并提交
      self._handleCloseOrderModalClose();
      const curOrder = _.find(self.data.orders, order => order.orderId == self.state.curOrderId);
      Meteor.call('order.close', self.state.curOrderId, curOrder.consumerId, curOrder.commodity.title, reason, (err, res) => {
        if (err){
          // 错误处理
          swal('关闭交易失败', '', 'warning');
        } else{
          // TODO 关闭交易成功
        }
      });
    });
  },

  // 点击'关闭'
  _handleCloseOrder(orderId, e){
    this.setState({
      curOrderId: orderId,
      showCloseModal: true
    });
  },

  // 获取操作的展示
  _getActionHtml(order){
    switch (order.status){
      case 'pending':
        return [
          <br/>,
          <a href="" onClick={this._handleCloseOrder.bind(this, order.orderId)}>关闭交易</a>
        ]
      case 'paid':
        return [
          <br/>,
          <a href={`/orders/${order.orderId}/deliver`}>发货</a>,
          <br/>,
          <a href={`/orders/${order.orderId}/refund/cancel`}>缺货退款</a>
        ]
      case 'refundApplied':
        // 是否已发货
        return (_.findIndex(order.activities, (activity) => activity.action == 'commit') == -1)
          ? [
            <br/>,
            <a href={`/orders/${order.orderId}/refund/paid`}>退款处理</a>,
            <br/>,
            <a href={`/orders/${order.orderId}/deliver`}>发货</a>
          ]
          : [
            <br/>,
            <a href={`/orders/${order.orderId}/refund/committed`}>退款处理</a>
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
      case 'refundApplied':
        // 是否已发货
        return (_.findIndex(order.activities, (activity) => activity.action == 'commit') == -1)
          ? [
            <p>待退款</p>,
            <p>(买家已付款)</p>
          ]
          : [
            <p>待退款</p>,
            <p>(卖家已发货)</p>
          ]
      case 'refunded':
        return [
          <p>已关闭</p>,
          <p>(已退款{this._getRefundAmount(order)}元)</p>
        ]
      case 'finished':
        return '已成功的订单'
      case 'canceled':
        return (_.findIndex(order.activities, (activity) => activity.action == 'cancel') != -1)
          // 区分 超时自动取消 or 商家/买家主动取消
          ? (this._getActivityOperator(order.activities, 'cancel') == order.consumerId)
            // 区分商家/买家取消
            ? [
              <p>已关闭</p>,
              <p>(买家已取消交易)</p>
            ]
            : [
              <p>已关闭</p>,
              <p>(商家已取消交易)</p>
            ]
          : [
            <p>已关闭</p>,
            <p>(买家支付过期)</p>
          ]
      default:
        // TODO 待做(会有哪些可能性?)
        return ''
    }
  },

  // 响应statusTab的点击事件
  _handleStatusFilter(status){
    switch (status){
      case 'all':
        // 全部就置空
        this.setState({options: {}});
        break;
      case 'closed':
        this.setState({
          options: {
            status: {
              // 关闭是取消,退款完成的合并状态
              $in: ['canceled', 'refunded']
            }
          }
        });
        break;
      default:
        this.setState({
          options: {
            status: status
          }
        });
        break;
    };
    this.setState({activeStatus: status});
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
    },
    btnGroup: {
      marginTop: 25,
      marginRight: 30,
      float: 'right'
    },
    statusTableUl: {
      display: 'inline-block',
      margin: '0 15px',
      padding: 0,
      cursor: 'pointer'
    },
    statusTableLi: {
      border: '1px solid #aaa',
      borderBottom: 'none',
      display: 'inline-block',
      padding: '10px 20px'
    },
    statusTableLiActive: {
      //border: '1px solid #1ab394',
      border: '1px solid #18a689',
      borderBottom: 'none',
      //backgroundColor: '#1ab394',
      backgroundColor: '#18a689',
      color: 'white'
    },
    ibox: {
      //border: '1px solid #1ab394'
      border: '1px solid #18a689'
    },
    defaultSentence: {
      color: '#aaa',
      fontSize: 20,
      textAlign: 'center'
    }
  },

  render() {
    const prefix = 'orders.';

    // 筛选控制
    const filter =
      <div className="ibox-content m-b-sm border-bottom">
        <div className="row">
          <div className="col-sm-3">
            <div className="form-group">
              <label className="control-label" htmlFor="order-search">
                <FormattedMessage message={this.getIntlMessage(`${prefix}label.search`)}/>
              </label>
              <input id="order-search" name="order-search" placeholder="订单号/手机号/商品编号" className="form-control"/>
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
          <ButtonToolbar style={this.styles.btnGroup}>
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
          <th data-hide="phone" data-type="numeric">
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.totalAdvancePayment`)}/>
          </th>
          <th data-hide="phone" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.createdDate`)}/>
          </th>
          <th data-hide="phone" style={{textAlign:'center'}}>
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.tradeStatus`)}/>
          </th>
          <th data-hide="phone" style={{textAlign:'center'}}>
            {/*<FormattedMessage message={this.getIntlMessage(`${prefix}label.purchaser`)}/>*/}
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.contact`)}/>
          </th>
          <th className="text-right" data-sort-ignore="true">
            <FormattedMessage message={this.getIntlMessage(`${prefix}label.action`)}/>
          </th>
        </tr>
      </thead>;

    // 商品列表行
    const orderList = this.data.orders.map(order => {
      return (
        <tr key={order.key}>
          <td style={{textAlign:'center'}}>{order.orderId}</td>
          <td data-value={order.commodity && order.commodity.commodityId} style={{textAlign:'center'}}>
            <p>{order.commodity && order.commodity.title}</p>
            <p>商品编号: {order.commodity && order.commodity.commodityId}</p>
          </td>
          <td data-value={order.quantity} style={{textAlign:'center'}}>{order.quantity}</td>
          <td data-value={order.totalPrice} style={{textAlign:'center'}}>{order.totalPrice}</td>
          <td style={{textAlign:'center'}}>{moment(order.createTime).format('YYYY-MM-DD HH:mm')}</td>
          <td style={{color: '#333', textAlign: 'center'}}>
            {this._getTradeStatusHtml(order)}
          </td>
          <td style={{textAlign:'center'}}>
            <p>{order.contact && `${order.contact.surname}${order.contact.givenName}`}</p>
            <p>{order.contact && order.contact.tel && `手机: ${order.contact.tel.dialCode} ${this._getEncodedNumber(order, order.contact.tel.number)}`}</p>
          </td>
          <td style={{color: '#333', textAlign: 'center'}}>
            <div className="btn-group">
              <a href={`/orders/${order.orderId}`}>订单详情</a>
              {this._getActionHtml(order)}
              <br/>
              <a href="">留言</a>
            </div>
          </td>
        </tr>)
      }
    );

    const orderTableBody =
      <tbody>
        {orderList}
      </tbody>;

    const orderTableFoot =
      <tfoot>
        <tr>
          {/*<td colSpan={this.data.isAdmin ? "10" : "8"}>*/}
          <td colSpan="8">
            <ul className="pagination pull-right"></ul>
          </td>
        </tr>
      </tfoot>;

    // 过滤状态的tab
    const statusTabList =
      <ul style={this.styles.statusTableUl}>
        <li onClick={this._handleStatusFilter.bind(this, 'all')} style={(this.state.activeStatus == 'all') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>全部订单</li>
        <li onClick={this._handleStatusFilter.bind(this, 'pending')} style={(this.state.activeStatus == 'pending') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>等待买家付款</li>
        <li onClick={this._handleStatusFilter.bind(this, 'paid')} style={(this.state.activeStatus == 'paid') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>待发货</li>
        <li onClick={this._handleStatusFilter.bind(this, 'committed')} style={(this.state.activeStatus == 'committed') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>已发货</li>
        <li onClick={this._handleStatusFilter.bind(this, 'finished')} style={(this.state.activeStatus == 'finished') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>已成功的订单</li>
        <li onClick={this._handleStatusFilter.bind(this, 'refundApplied')} style={(this.state.activeStatus == 'refundApplied') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>待退款</li>
        <li onClick={this._handleStatusFilter.bind(this, 'closed')} style={(this.state.activeStatus == 'closed') ? _.extend({}, this.styles.statusTableLi, this.styles.statusTableLiActive) : this.styles.statusTableLi}>已关闭</li>
      </ul>;

    // 商品表格
    const orderTable =
      <div className="row">
        {statusTabList}
        <div className="col-lg-12">
          <div className="ibox" style={this.styles.ibox}>
            <div className="ibox-content">
              {this.data.orders.length == 0
                ? this.data.ordersReady
                  ? <div style={this.styles.defaultSentence}>未找到符合条件的订单</div>
                  : <div style={this.styles.defaultSentence}>正在查询中 ...</div>
                : ''
              }
              <table className="footable table table-stripped toggle-arrow-tiny"
                     data-page-size="10"
                     style={{display: (this.data.orders.length == 0) ? 'none' : ''}}>
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

        <div className="wrapper wrapper-content animated fadeInRight">
          {filter}
          {orderTable}
        </div>
        <OrderCloseModal
          showModal={this.state.showCloseModal}
          handleClose={this._handleCloseOrderModalClose}
          handleSubmit={this._handleCloseOrderModalSubmit}
        />
      </div>
    );
  }
});

export const Order = order;
