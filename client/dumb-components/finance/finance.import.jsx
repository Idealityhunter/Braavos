import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button} from "/lib/react-bootstrap";
import {OrderCloseModal} from '/client/dumb-components/order/orderCloseModal';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const finance = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      // 展示已完成/退款成功的订单
      options: {
        status: {
          $in: ['finished', 'refunded']
        }
      }
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
    if (handleOrder.ready()) {
      //最好是按照更新时间来排序吧
      orders = BraavosCore.Database.Braavos.Order.find({}, {sort: {updateTime: -1}}).fetch();
      orders = orders.map(order => _.extend(order, {
        key: Meteor.uuid(),
        totalPrice: order.totalPrice / 100
      }));
    }

    return {
      orders: orders || []
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

    let updateTimeRange = {};
    if ($('.input-daterange>input[name=start]').val() || $('.input-daterange>input[name=end]').val()) {
      _.extend(updateTimeRange, {'updateTime': {}})

      if ($('.input-daterange>input[name=start]').val()) {
        _.extend(updateTimeRange.updateTime, {
          '$gte': $('.input-daterange>input[name=start]').val()
        });
      }
      if ($('.input-daterange>input[name=end]').val()) {
        _.extend(updateTimeRange.updateTime, {
          '$lte': moment($('.input-daterange>input[name=end]').val()).add(1, 'day').format('YYYY-MM-DD')
        });
      }
    }

    this.setState({
      options: _.extend(this.state.options, searchId, updateTimeRange)
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

  // 获取退款数额
  _getRefundAmount(order){
    const activity = _.find(order.activities, activity => activity.action == 'refund' && activity.data && activity.data.type == 'accept');
    return activity && activity.data && activity.data.amount || order.totalPrice;
  },

  // 获取交易状态的展示
  _getTradeStatusHtml(order) {
    switch (order.status){
      case 'finished':
        return '已成功的订单'
      case 'refunded':
        return [
          <p>已关闭</p>,
          <p>(已退款{this._getRefundAmount(order)}元)</p>
        ]
      default:
        // TODO 待做(会有哪些可能性?)
        return ''
    }
  },

  styles: {
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
    amount: {
      fontSize: 20
    },
    statistic: {
      backgroundColor: 'aliceblue',
      padding: '5px 15px 10px',
      border: '1px solid #ddd',
      margin: '20px 10px 0'
    },
    marginLeft: {
      marginLeft: 30
    },
    hr: {
      borderColor: '#ddd'
    },
    marginRight: {
      marginRight: 30
    },
    label: {
      marginRight: 20,
      marginBottom: 10
    }
  },

  _getIncome(order){
    const income = (order.status == 'finished')
      ? order.totalPrice
      : order.totalPrice - this._getRefundAmount(order);

    return(
      <td data-value={income} style={{textAlign:'center'}}>
        <p>¥{income}</p>
        <a href={`/orders/${order.orderId}`}>查看详情</a>
      </td>
    );
  },

  render() {
    const prefix = 'orders.';

    // 筛选控制
    const filter =
      <div className="row">
        <div className="col-sm-4">
          <div className="form-group">
            <label className="control-label">
              订单完成时间
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
        <div className="col-sm-3">
          <div className="form-group">
            <label className="control-label" htmlFor="order-search">
              <FormattedMessage message={this.getIntlMessage(`${prefix}label.search`)}/>
            </label>
            <input id="order-search" name="order-search" placeholder="订单号/手机号/商品编号" className="form-control"/>
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
          实收
        </th>
        <th data-hide="phone" style={{textAlign:'center'}}>
          订单完成时间
        </th>
        <th data-hide="phone" style={{textAlign:'center'}}>
          <FormattedMessage message={this.getIntlMessage(`${prefix}label.tradeStatus`)}/>
        </th>
        <th data-hide="phone" style={{textAlign:'center'}}>
          <FormattedMessage message={this.getIntlMessage(`${prefix}label.contact`)}/>
        </th>
      </tr>
      </thead>;

    // 商品列表行
    const orderList = this.data.orders.map(order =>
        <tr key={order.key} style={(order.status == 'disabled') ? {color: '#aaa'} : {color: '#333'}}>
          <td style={{textAlign:'center'}}>{order.orderId}</td>
          <td data-value={order.commodity.commodityId} style={{textAlign:'center'}}>
            <p>{order.commodity.title}</p>
            <p>商品编号: {order.commodity.commodityId}</p>
          </td>
          <td data-value={order.quantity} style={{textAlign:'center'}}>{order.quantity}</td>
          {this._getIncome(order)}
          <td style={{textAlign:'center'}}>{moment(order.updateTime).format('YYYY-MM-DD')}</td>
          <td style={{color: '#333', textAlign: 'center'}}>
            {this._getTradeStatusHtml(order)}
          </td>
          <td style={{textAlign:'center'}}>
            <p>{`${order.contact.surname}${order.contact.givenName}`}</p>
            <p>{`手机: ${order.contact.tel.dialCode} ${order.contact.tel.number}`}</p>
            <a href="">留言</a>
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
          <td colSpan="8">
            <ul className="pagination pull-right"></ul>
          </td>
        </tr>
      </tfoot>;

    // 商品表格
    const orderTable =
      <div className="row">
        <div className="ibox" style={this.styles.ibox}>
          <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="10">
            {orderTableHead}
            {orderTableBody}
            {orderTableFoot}
          </table>
        </div>
      </div>;

    const financeStatistics =
      <div style={this.styles.statistic}>
        <h2>账户总览</h2>
        <hr style={this.styles.hr}/>
        <div>
          <label style={this.styles.label}>账户总余额:</label>
          <span style={this.styles.amount}>¥1099</span>
          <Button bsStyle="primary" bsSize="small" style={this.styles.marginLeft}>申请提现</Button>
        </div>
        <div>
          <label style={this.styles.label}>总销售额:</label>
          <span>¥98779</span>
        </div>
        <div>
          <label style={this.styles.label}>已提取金额:</label>
          <span>¥97680</span>
          <a href="" style={this.styles.marginLeft}>提现记录</a>
        </div>
      </div>;

    return (
      <div className="finance-mngm-wrap">
        <BraavosBreadcrumb />

        <div className="animated fadeInRight">
          {financeStatistics}
        </div>
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  {filter}
                </div>
                <div className="ibox-content">
                  {orderTable}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
});

export const Finance = finance;

