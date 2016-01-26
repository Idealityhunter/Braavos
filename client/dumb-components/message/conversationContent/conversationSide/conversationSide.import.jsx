// 会话相关信息容器(包括商品和订单)

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationSide = React.createClass({
  mixins: [IntlMixin],
  getInitialState(){
    return {
      activeTab: 0,
      commodityInfo: {
        cover: 'http://7sbm17.com1.z0.glb.clouddn.com/commodity/images/54bec18b8b9598d98d31205e8a2afb42',
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        commodityId: 100428,
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        status: 'pengding'
      },
      orders: [{
        key: 222,
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }, {
        key: 223,
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }, {
        key: 224,
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }, {
        key: 225,
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }]
    }
  },
  styles: {
    container: {
      display: 'inline-block',
      width: 250,
      height: 563,
      borderLeft: '1px solid #ccc',
      verticalAlign: 'top',
      boxSizing: 'border-box'
    },
    tabTitle: {
      textAlign: 'center',
      width: '50%'
    },
    tabTitleActive: {
    },
    tabTitleText: {
      marginRight: 0,
      padding: '10px 20px 10px 20px'
    },
    tabTitleTextActive: {
      borderRadius: 0,
      borderBottom: '1px solid #fff'
    },
    tabContentWrap: {
      margin: '15px 0',
      width: 249,
      height: 505,
      overflowY: 'auto',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      padding: '0 17px'
    }
  },
  _changeTab(e) {
    this.setState({
      activeTab: parseInt(e.target.tabIndex)
    })
  },
  render(){
    return (
      <div style={this.styles.container}>
        <div className="tabs">
          <nav className="collapse in">
            <ul className="tab-titles nav nav-tabs">
              <li key={0}
                  className={this.state.activeTab == 0 ? "active" : ""}
                  style={this.state.activeTab == 0 ? _.extend({}, this.styles.tabTitle, this.styles.tabTitleActive) : this.styles.tabTitle}>
                <a href="" tabIndex={0}
                   onClick={this._changeTab}
                   style={this.state.activeTab == 0 ?  _.extend({}, this.styles.tabTitleText, this.styles.tabTitleTextActive) : this.styles.tabTitleText}>
                  商品
                </a>
              </li>
              <li key={1}
                  className={this.state.activeTab == 1 ? "active" : ""}
                  style={this.state.activeTab == 1 ? _.extend({}, this.styles.tabTitle, this.styles.tabTitleActive)  : this.styles.tabTitle}>
                <a href="" tabIndex={1}
                   onClick={this._changeTab}
                   style={this.state.activeTab == 1 ?  _.extend({}, this.styles.tabTitleText, this.styles.tabTitleTextActive) : this.styles.tabTitleText}>
                  订单
                </a>
              </li>
            </ul>
          </nav>
          <div className="tab-content">
            <div key={0} className={this.state.activeTab == 0 ? "tab-pane fade active in" : "tab-pane fade"}>
              <div style={this.styles.tabContentWrap}>
                <CommodityCard {...this.state.commodityInfo}/>
              </div>
            </div>
            <div key={1} className={this.state.activeTab == 1 ? "tab-pane fade active in" : "tab-pane fade"}>
              <div style={this.styles.tabContentWrap}>
                {this.state.orders.map(order => <OrderCard {...order}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


// 订单卡片
const OrderCard = React.createClass({
  mixins: [IntlMixin],
  styles: {
    container: {
      display: 'inline-block',
      width: 215,
      border: '1px solid #ccc',
      padding: 10,
      verticalAlign: 'top',
      boxSizing: 'border-box',
      marginBottom: 20
    },
    img: {
      width: 218,
      height: 218,
      marginBottom: 10
    },
    desc: {
      margin: 0
    },
    label: {
      marginRight: 10,
      marginBottom: 0
    },
    span: {
      display: 'inline-block',
      width: 60,
      paddingRight: 5,
      textAlign: 'justify',
      textAlignLast: 'justify'
    },
    foot: {
      marginBottom: 5,
      marginTop: 15,
      textAlign: 'right'
    }
  },

  render(){
    const head = <h3>订单{this.props.orderId}</h3>;
    const foot =
      <div style={this.styles.foot}>

        {/* _blank的做法待定 因为打开新页面又要重新加载,速度会很慢! */}

        <a href={`/orders/${this.props.orderId}`} target='_blank'>查看订单详情</a>>
      </div>;

    return(
      <div style={this.styles.container} onClick={this._openOrderPage}>
        {head}

        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>商品名</span>:
          </label>
          {this.props.commodityTitle}
        </p>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>套餐名</span>:
          </label>
          {this.props.planTitle}
        </p>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>订单总价</span>:
          </label>
          ¥{this.props.totalPrice}
        </p>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>订单状态</span>:
          </label>
          {/*this.props.status*/}
          待付款
        </p>

        {foot}
      </div>
    )
  }
});

// 商品卡片
const CommodityCard = React.createClass({
  mixins: [IntlMixin],
  styles: {
    container: {
      display: 'inline-block',
      width: 215,
      border: '1px solid #ccc',
      padding: '5px 5px 10px',
      verticalAlign: 'top',
      boxSizing: 'border-box',
      //cursor: 'pointer'
    },
    img: {
      width: 204,
      height: 204,
      marginBottom: 10
    },
    desc: {
      margin: 0
    },
    label: {
      marginRight: 10,
      marginBottom: 0
    },
    span: {
      display: 'inline-block',
      width: 45,
      paddingRight: 5,
      textAlign: 'justify',
      textAlignLast: 'justify'
    },
    marketPrice: {
      marginLeft: 8,
      textDecoration: 'line-through',
      color: '#aaa'
    }
  },

  // TODO 打开商品详情页面
  _openCommodityPage(){

  },

  render(){
    return(
      <div style={this.styles.container} onClick={this._openCommodityPage}>
        <img src={this.props.cover} style={this.styles.img} alt=""/>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>商品名</span>:
          </label>
          {this.props.commodityTitle}
        </p>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>商品ID</span>:
          </label>
          {this.props.commodityId}
        </p>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>套餐名</span>:
          </label>
          {this.props.planTitle}
        </p>
        <p style={this.styles.desc}>
          <label style={this.styles.label}>
            <span style={this.styles.span}>价格</span>:
          </label>
          ¥{this.props.price}
          <span style={this.styles.marketPrice}>¥{this.props.marketPrice}</span>
        </p>
      </div>
    )
  }
});
