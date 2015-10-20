let leftSiderBar = React.createClass({
  componentDidMount() {
    $('#side-menu').metisMenu();
  },
  render() {
    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">

            {/*头像部分*/}
            <li className="nav-header">
              <div className="dropdown profile-element">
                <span><img alt="image" className="img-circle" src="img/profile_small.jpg" /></span>
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <span className="clear">
                    <span className="block m-t-xs">
                      <strong className="font-bold">David Williams</strong>
                    </span>
                    <span className="text-muted text-xs block">Art Director
                      <b className="caret"></b>
                    </span>
                  </span>
                </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a href="profile.html">Profile</a></li>
                  <li><a href="contacts.html">Contacts</a></li>
                  <li><a href="mailbox.html">Mailbox</a></li>
                  <li className="divider"></li>
                  <li><a href="login.html">Logout</a></li>
                </ul>
              </div>
              <div className="logo-element">
                IN+
              </div>
            </li>

            {/*首页*/}
            <li className={ActiveRoute.path('/') ? "active" : ""}>
              <a href="/">
                <i class="fa fa-diamond"></i>
                <span class="nav-label">首页</span>
              </a>
            </li>

            {/*商品管理*/}
            <li className={ActiveRoute.path('/product-info') ? "active" : ""}>
              <a href="/product-info">
                <i class="fa fa-diamond"></i>
                <span class="nav-label">商品管理</span>
              </a>
            </li>

            {/*订单管理*/}
            <li className={ActiveRoute.path('/order-info') ? "active" : ""}>
              <a href="/order-info">
                <i class="fa fa-diamond"></i>
                <span class="nav-label">订单管理</span>
              </a>
            </li>

            {/*财务管理*/}
            <li className={ActiveRoute.path('/finance-info') ? "active" : ""}>
              <a href="/finance-info">
                <i class="fa fa-diamond"></i>
                <span class="nav-label">财务管理</span>
              </a>
            </li>

            {/*账户信息*/}
            <li className={ActiveRoute.path('/account-info') ? "active" : ""}>
              <a href="/account-info">
                <i class="fa fa-diamond"></i>
                <span class="nav-label">账户信息</span>
              </a>
            </li>

            {/*Dashboards*/}
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

            {/*Menu Levels*/}
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
          </ul>
        </div>
      </nav>
    );
  }
});

export const LeftSiderBar = leftSiderBar;