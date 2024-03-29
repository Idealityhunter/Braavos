const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

let leftSiderBar = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      showActivity: undefined,
    }
  },

  getMeteorData() {
    const handle = Meteor.subscribe('basicUserInfo');

    let userInfo;
    if (handle.ready()) {
      const userId = parseInt(Meteor.userId());
      userInfo = BraavosCore.Database['Yunkai']['UserInfo'].findOne({userId: userId});
    }

    if (!userInfo) {
      userInfo = {};
    }

    // TODO 需要更细致的处理图像的方法. 考虑各种情况, 比如avatar是一个key等.
    if (userInfo && userInfo.avatar) {
      // 假如是新的avtar结构,要做特殊处理
      userInfo.avatar.url && (userInfo.avatar = userInfo.avatar.url);
      userInfo.avatar += '?imageView2/2/w/48/h/48';
    } else {
      userInfo.avatar = "/images/logo.png"
    }

    return {
      userInfo,
      isAdmin: BraavosCore.Utils.account.isAdmin()
    };
  },

  componentDidMount() {
    $('#side-menu').metisMenu();
  },

  // 点击 activity 时, 控制 activity 二级菜单的展示和消失
  handleShowActivity(e){
    this.setState({
      showActivity: ! this.state.showActivity
    })
  },

  // 点击其它子菜单的时候, 控制 activity 菜单的隐藏
  // TODO 添加新一个二级菜单时可将此改为 handleHideOthers(e)
  handleHideActivity(e){
    this.setState({
      showActivity: false
    })
  },

  render() {
    const prefix = 'mainLayout.leftSideBar.';

    // activity 的二级菜单
    const activitiesNav = this.data.isAdmin ?
      <li className={ this.state.showActivity != undefined && this.state.showActivity || ActiveRoute.name(/^activities/) ? "active" : ""} onClick={this.handleShowActivity}>
        <a href="#">
          <i className="fa fa-th-large"></i>
          <span className="nav-label">
            <FormattedMessage message={this.getIntlMessage(`${prefix}platformActivities`)}/>
          </span>
          <span className="fa arrow"></span>
        </a>
        <ul className={`nav nav-second-level ${this.state.showActivity != undefined && this.state.showActivity || ActiveRoute.name(/^activities/) ? "in" : "collapse"}`}>
          <li key="activities-column" className={ActiveRoute.name(/^activities-column/) ? "active" : ""}>
            <a href={FlowRouter.path('activities-column')}>
              <FormattedMessage message={this.getIntlMessage(`${prefix}activities-column`)}/>
            </a>
          </li>
          <li key="activities-article" className={ActiveRoute.name(/^activities-article/) ? "active" : ""}>
            <a href={FlowRouter.path('activities-article')}>
              <FormattedMessage message={this.getIntlMessage(`${prefix}activities-article`)}/>
            </a>
          </li>
          <li key="activities-banner" className={ActiveRoute.name(/^activities-banner/) ? "active" : ""}>
            <a href={FlowRouter.path('activities-banner')}>
              <FormattedMessage message={this.getIntlMessage(`${prefix}activities-banner`)}/>
            </a>
          </li>
        </ul>
      </li> : <div/>;

    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">

            {/*头像部分*/}
            <li className="nav-header">
              <div className="dropdown profile-element">
                <span><img alt="image" width="48px" className="img-circle" src={this.data.userInfo.avatar}/></span>
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <span className="clear">
                    <span className="block m-t-xs">
                      <strong className="font-bold">{this.data.userInfo.nickName}</strong>
                    </span>
                    <span className="text-muted text-xs block">普通商户
                      <b className="caret"></b>
                    </span>
                  </span>
                </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li>
                    <a href={FlowRouter.path('account')}>
                      <FormattedMessage message={this.getIntlMessage(`${prefix}accountInfo`)}/>
                    </a>
                  </li>
                  {/*<li><a href="contacts.html">Contacts</a></li>*/}
                  {/*<li><a href="mailbox.html">Mailbox</a></li>*/}
                  <li className="divider"></li>
                  <li>
                    <a href={FlowRouter.path('logout')}>
                      <FormattedMessage message={this.getIntlMessage('login.logout')}/>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="logo-element">
                IN+
              </div>
            </li>

            {/*首页*/}
            <li className={ActiveRoute.name('home') ? "active" : ""} onClick={this.handleHideActivity}>
              <a href={FlowRouter.path('home')}>
                <i className="fa fa-diamond"/>
                <span className="nav-label">
                  <FormattedMessage message={this.getIntlMessage(`${prefix}homepage`)}/>
                </span>
              </a>
            </li>

            {/*商品管理*/}
            <li className={ActiveRoute.name('commodities') ? "active" : ""} onClick={this.handleHideActivity}>
              <a href={FlowRouter.path('commodities')}>
                <i className="fa fa-shopping-cart"/>
                <span className="nav-label">
                  <FormattedMessage message={this.getIntlMessage(`${prefix}commodities`)}/>
                </span>
              </a>
            </li>

            {/*订单管理*/}
            <li className={ActiveRoute.name('orders') ? "active" : ""} onClick={this.handleHideActivity}>
              <a href={FlowRouter.path('orders')}>
                <i className="fa fa-tags"/>
                <span className="nav-label">
                  <FormattedMessage message={this.getIntlMessage(`${prefix}orders`)}/>
                </span>
              </a>
            </li>

            {/*财务管理*/}
            <li className={ActiveRoute.name('finance') ? "active" : ""}>
              <a href={FlowRouter.path('finance')}>
                <i className="fa fa-database"/>
                <span className="nav-label">
                  <FormattedMessage message={this.getIntlMessage(`${prefix}finance`)}/>
                </span>
              </a>
            </li>

            {/*账户信息*/}
            <li className={ActiveRoute.name('account') ? "active" : ""} onClick={this.handleHideActivity}>
              <a href={FlowRouter.path('account')}>
                <i className="fa fa-user"/>
                <span className="nav-label">
                  <FormattedMessage message={this.getIntlMessage(`${prefix}accountInfo`)}/>
                </span>
              </a>
            </li>

            {/*消息*/}
            <li className={ActiveRoute.name('message') ? "active" : ""} onClick={this.handleHideActivity}>
              <a href={FlowRouter.path('message')}>
                <i className="fa fa-comments"/>
                <span className="nav-label">
                  <FormattedMessage message={this.getIntlMessage(`${prefix}message`)}/>
                </span>
              </a>
            </li>

            {activitiesNav}

            {/*Dashboards*/}
            {/*
            <li>
              <a href="#">
                <i className="fa fa-th-large"></i>
                <span className="nav-label">Dashboards</span>
                <span className="fa arrow"></span>
              </a>
              <ul className="nav nav-second-level collapse">
                <li><a href="#">Dashboard v.1</a></li>
                <li><a href="dashboard_2.html">Dashboard v.2</a></li>
                <li><a href="dashboard_3.html">Dashboard v.3</a></li>
                <li><a href="dashboard_4_1.html">Dashboard v.4</a></li>
              </ul>
            </li>
             */}

            {/*Menu Levels*/}
            {/*
            <li>
              <a href="#">
                <i className="fa fa-sitemap"></i>
                <span className="nav-label">Menu Levels</span>
                <span className="fa arrow"></span>
              </a>
              <ul className="nav nav-second-level collapse">
                <li><a href="#">Third Level <span className="fa arrow"></span></a>
                  <ul className="nav nav-third-level">
                    <li><a href="#">Third Level Item</a></li>
                    <li><a href="#">Third Level Item</a></li>
                    <li><a href="#">Third Level Item</a></li>
                  </ul>
                </li>
                <li><a href="#">Second Level Item</a></li>
                <li><a href="#">Second Level Item</a></li>
                <li><a href="#">Second Level Item</a></li>
              </ul>
            </li>
            */}
          </ul>
        </div>
      </nav>
    );
  }
});

export const LeftSiderBar = leftSiderBar;