// 消息页面主容器

import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button, Tabs, Tab, Input} from "/lib/react-bootstrap";

import {ConversationViewList} from '/client/dumb-components/message/conversationView/conversationViewList';
import {ConversationContent} from '/client/dumb-components/message/conversationContent/conversationContent';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

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


    // tab主体
    const tabBody = (this.state.activeStatus == 'message')
      ? <div className="col-lg-12 fadeIn"></div>
      : <div className="col-lg-12 fadeIn">
          <div className="ibox" style={this.styles.ibox}>
            <ConversationViewList conversations={conversations}/>
            <ConversationContent user={this.state.curUser}/>
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
