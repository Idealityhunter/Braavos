import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button, Tabs, Tab, Input} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;


const MsgBlock = React.createClass({
  mixins: [IntlMixin],
  styles: {
    leftContainer: {
      textAlign: 'left'
    },
    rightContainer: {
      textAlign: 'right'
    },
    avatar: {
      display: 'inline-block',
      width: 40,
      height: 40,
      borderRadius: 20,
      margin: '10px 15px',
      verticalAlign: 'top'
    },
    bubble: {
      display: 'inline-block',
      border: '1px solid #ccc',
      padding: 10,
      position: 'relative',
      background: '#fff',
      borderRadius: 8,
      marginTop: 15,
      maxWidth: 345,
      textAlign: 'left',
      verticalAlign: 'top'
    },
    triangle: {
      position: 'absolute',
      top: 0,
      fontSize: 19
    },
    triangleAL: {
      zIndex: 1,
      color: '#ccc',
      left: -10
    },
    triangleBL: {
      zIndex: 3,
      color: '#fff',
      left: -9
    },
    triangleAR: {
      zIndex: 1,
      color: '#ccc',
      right: -10
    },
    triangleBR: {
      zIndex: 3,
      color: '#fff',
      right: -9
    },
    text: {
      margin: 0
    }
  },
  render(){
    const body = (this.props.senderId == 100068)
      ? <div style={this.styles.leftContainer}>
          <img style={this.styles.avatar} src={this.props.avatar}/>
          <div style={this.styles.bubble}>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleAL)}>◆</span>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleBL)}>◆</span>
            <p style={this.styles.text}>{this.props.contents}</p>
          </div>
        </div>
      : <div style={this.styles.rightContainer}>
          <div style={this.styles.bubble}>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleAR)}>◆</span>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleBR)}>◆</span>
            <p style={this.styles.text}>{this.props.contents}</p>
          </div>
          <img style={this.styles.avatar} src={this.props.avatar}/>
        </div>;
    return body;
  }
});

const TimeBlock = React.createClass({
  mixins: [IntlMixin],
  styles: {
    container: {
      margin: 5,
      color: '#bbb',
      fontSize: 12,
      textAlign: 'center'
    }
  },
  // TODO: 展示方式
  //   12月17日 11:41
  //   星期三 16:11(上周三,今天是星期二)
  //   昨天 11:46
  //   11:22
  render(){
    return (
      <div style={this.styles.container}>
        {moment(this.props.timestamp).format('YYYY-MM-DD hh-mm')}
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

// 会话相关信息容器(包括商品和订单)
const ConversationSide = React.createClass({
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
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }, {
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }, {
        commodityTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        planTitle: '济州岛Don&Dol烤肉店【黑猪肉套餐】',
        totalPrice: 125,
        orderId: 1451272257920,
        status: 'pengding'
      }, {
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

// 对话输入容器
const ConversationInput = React.createClass({
  mixins: [IntlMixin],
  styles: {
    container: {
      width: 498,
      height: 211,
      boxSizing: 'border-box'
    },
    textArea: {
      width: 498,
      height: 134,
      overflow: 'auto',
      border: 'none',
      padding: '5px 10px',
      borderTop: '1px solid #ccc'
    },
    foot: {
      textAlign: 'right',
      paddingRight: 10
    },
    comment: {
      color: '#aaa',
      marginRight: 10
    },

    // ToolBar
    toolBar: {
      width: 498,
      height: 35,
      padding: '6px 10px'
    },
    toolImage: {
      display: 'inline-block',
      width: 23,
      height: 23,
      marginRight: 10,
      cursor: 'pointer'
    },
    face: {
      background: 'url(/images/message/emoji.png) no-repeat'
    },
    file: {
      background: 'url(/images/message/file.png) no-repeat'
    },
    plan: {
      background: 'url(/images/message/plan_selected.png) no-repeat',
      marginRight: 6,
      backgroundSize: 'contain'
    },
    search: {
      background: 'url(/images/message/search_selected.png) no-repeat',
      backgroundSize: 'contain'
    }
  },
  _sendMsg(e){

  },
  render(){
    // 添加其它消息类型
    const toolBar =
      <div style={this.styles.toolBar}>
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.face)} title="表情" />
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.file)} title="图片" />
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.plan)} title="我的攻略" />
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.search)} title="搜索" />
      </div>;

    //<textarea style={this.styles.textArea} placeholder="请输入要发送的消息"></textarea>
    //<Input style={this.styles.textArea} type="textarea" placeholder="textarea" />

    // 发送框
    const textArea =
      <div>
        <textarea style={this.styles.textArea} placeholder="请输入要发送的消息"></textarea>
      </div>;

    // 包括发送按钮等
    const foot =
      <div style={this.styles.foot}>
        <p className="inline" style={this.styles.comment}>按下Cmd+Enter换行</p>
        <Button className="inline" bsStyle='info' onClick={this._sendMsg}>发送</Button>
      </div>;

    return (
      <div style={this.styles.container}>
        {toolBar}
        {textArea}
        {foot}
      </div>
    )
  }
});

// 对话内容框
const ConversationWindow = React.createClass({
  mixins: [IntlMixin],
  getInitialState(){
    return {
      msgs: [{
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100053,
        receiverId : 100068,
        chatType : "single",
        contents : "******test******",
        msgType : 0,
        timestamp : 1437106632058,
          targets : [100068, 100053]
        }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100068,
        receiverId : 100053,
        chatType : "single",
        contents : "******test******",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100053,
        receiverId : 100068,
        chatType : "single",
        contents : "******test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1****",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100068,
        receiverId : 100053,
        chatType : "single",
        contents : "***阿里山放假安徽省地方1***test******",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100053,
        receiverId : 100068,
        chatType : "single",
        contents : "******test****阿里山放假安徽省地方1**",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }]
    }
  },
  styles: {
    container: {
      width: 498,
      height: 350,
      boxSizing: 'border-box',
      borderBottom: '1px solid #ccc',
    },
    wrap: {
      width: 498,
      height: 346,
      boxSizing: 'border-box',
      marginTop: 2, //对齐左侧
      marginBottom: 2,
      padding: '10px 0 20px',
      overflow: 'auto'
    }
  },
  render(){
    return (
      <div style={this.styles.container}>
        <div style={this.styles.wrap}>
          <TimeBlock timestamp={1437106632058} />
          {this.state.msgs.map(msg => <MsgBlock {...msg}/>)}
        </div>
      </div>
    )
  }
});

// 右侧会话容器
const ConversationContainer = React.createClass({
  mixins: [IntlMixin],
  styles: {
    noSelected: {
      // 额外的样式
      padding: '250px 330px',
      color: '#d1d1d2',
      fontSize: 14
    },
    container: {
      display: 'inline-block',
      width: 748,
      height: 600,
      verticalAlign: 'top',
      boxSizing: 'border-box'
    },
    head: {
      height: 35,
      lineHeight: '35px',
      textAlign: 'center',
      borderBottom: '1px solid #ccc'
    },
    body: {
      display: 'inline-block',
      width: 498,
      height: 563,
      boxSizing: 'border-box'
    }
  },
  render(){
    if (! this.props.user) {
      return(
        <div style={_.extend({}, this.styles.noSelected, this.styles.container)}>
          未选择聊天
        </div>
      )
    };

    const head =
      <div style={this.styles.head}>
        {this.props.user}
      </div>;

    const body =
      <div style={this.styles.body}>
        <ConversationWindow />
        <ConversationInput />
      </div>;

    return (
      <div style={this.styles.container}>
        {head}
        <div>
          {body}
          {/*TODO 可缩回?*/}
          <ConversationSide />
        </div>
      </div>
    )
  }
});

// 左侧对话列表项
const ConversationItem = React.createClass({
  mixins: [IntlMixin],
  styles: {
    conversationItem:{
      borderBottom: '1px solid #ccc'
    },
    avatar: {
      width: 60,
      height: 60,
      display: 'inline-block',
      margin: 5,
      padding: 5,
      borderRadius: 10
    },
    summary: {
      width: 160,
      display: 'inline-block',
      padding: '15px 5px 10px',
      overflow: 'hidden',
      verticalAlign: 'top'
    },
    time: {
      color: '#aaa',
      float: 'right'
    },
    digest: {
      marginTop: 5,
      width: 150,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  },
  render(){
    return(
      <div style={this.styles.conversationItem}>
        <img src={this.props.avatar} style={this.styles.avatar}/>
        <div style={this.styles.summary}>
          <div>
            {/*长度未限制,因此可能会有bug*/
              this.props.nickName
            }
            <span style={this.styles.time}>{this.props.time}</span>
          </div>
          <p style={this.styles.digest}>{this.props.summary}</p>
        </div>
      </div>
    );
  }
});

const message = React.createClass({
  //mixins: [IntlMixin, ReactMeteorData],
  mixins: [IntlMixin],

  getInitialState(){
    return {
      activeStatus: 'conversation',
      curUser: '瓜西'
      //curUser: undefined
    }
  },

  //getMeteorData() {
  //  let options = _.clone(this.state.options);
  //  const userId = parseInt(Meteor.userId());
  //  let isAdmin = false;
  //
  //  // 获取用户权限
  //  if (BraavosCore.SubsManager.account.ready()) {
  //    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
  //    const adminRole = 10;
  //    isAdmin = (_.indexOf(userInfo.roles, adminRole) != -1);
  //  }
  //  ;
  //
  //  // 获取商品信息
  //  const handleOrder = Meteor.subscribe('orders', options, isAdmin);
  //  let orders;
  //  if (handleOrder.ready()) {
  //    //最好是按照更新时间来排序吧
  //    orders = BraavosCore.Database.Braavos.Order.find({}, {sort: {updateTime: -1}}).fetch();
  //    orders = orders.map(order => _.extend(order, {
  //      key: Meteor.uuid(),
  //      totalPrice: order.totalPrice / 100
  //    }));
  //  }
  //
  //  return {
  //    orders: orders || []
  //  };
  //},

  // 响应statusTab的点击事件
  _handleTabChange(status){
    this.setState({activeStatus: status});
  },

  styles: {
    tabHeadList: {
      display: 'inline-block',
      margin: '0 15px',
      padding: 0,
      cursor: 'pointer'
    },
    tabHeadListItem: {
      border: '1px solid #aaa',
      borderBottom: 'none',
      display: 'inline-block',
      padding: '10px 20px'
    },
    tabHeadListItemActive: {
      //border: '1px solid #1ab394',
      border: '1px solid #18a689',
      borderBottom: 'none',
      //backgroundColor: '#1ab394',
      backgroundColor: '#18a689',
      color: 'white'
    },
    conversationListWrap: {
      borderRight: '1px solid #ccc',
      display: 'inline-block',
      width: 250,
      height: 598,
      boxSizing: 'border-box'
    },
    conversationList: {
      width: 249,
      height: 594,
      marginTop: 2,
      overflow: 'auto',
      boxSizing: 'border-box'
    },
    ibox: {
      //border: '1px solid #1ab394'
      border: '1px solid #18a689',
      backgroundColor: '#ffffff',
      width: 1000,
      height: 600
    }
  },

  render() {
    const prefix = 'message.';
    let conversations = [];
    const conversation = {
      // TODO 更进一步 => 判断是否今天的消息,然后选择是否展示确切的日期
      time: moment().format('hh:mm'),
      avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
      nickName: '瓜西',
      summary: '阿卡家连锁店返利卡公司付款拉高速'
    };
    for (i = 0;i < 100;i++) {
      conversations.push(conversation);
    }

    // tab首部
    const tabHeadList =
      <ul style={this.styles.tabHeadList}>
        <li onClick={this._handleTabChange.bind(this, 'message')}
            style={(this.state.activeStatus == 'message') ? _.extend({}, this.styles.tabHeadListItem, this.styles.tabHeadListItemActive) : this.styles.tabHeadListItem}>
          消息中心
        </li>
        <li onClick={this._handleTabChange.bind(this, 'conversation')}
            style={(this.state.activeStatus == 'conversation') ? _.extend({}, this.styles.tabHeadListItem, this.styles.tabHeadListItemActive) : this.styles.tabHeadListItem}>
          聊天中心
        </li>
      </ul>;

    // 左侧会话列表
    const conversationList =
      <div style={this.styles.conversationListWrap}>
        <div style={this.styles.conversationList}>
          {conversations.map(conversation => <ConversationItem {... conversation}/>)}
        </div>
      </div>;

    // tab主体
    const tabBody = (this.state.activeStatus == 'message')
      ? <div className="col-lg-12 fadeIn"></div>
      : <div className="col-lg-12 fadeIn">
          <div className="ibox" style={this.styles.ibox}>
            {conversationList}
            <ConversationContainer user={this.state.curUser}/>
          </div>
        </div>;

    return (
      <div className="message-mngm-wrap">
        <BraavosBreadcrumb />

        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            {tabHeadList}
            {tabBody}
          </div>
        </div>
      </div>
    );
  }
});

export const Message = message;
