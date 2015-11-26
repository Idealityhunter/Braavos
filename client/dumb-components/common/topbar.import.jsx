var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let topBar = React.createClass({
  mixins: [IntlMixin],

  componentDidMount() {
    // Toggle left navigation
    $('#navbar-minimalize').on('click', function (event) {
      console.log('click');
      console.log(event);
      event.preventDefault();

      // Toggle special class
      $("body").toggleClass("mini-navbar");

      // Enable smoothly hide/show menu
      if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
          function () {
            $('#side-menu').fadeIn(500);
          }, 100);
      } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
          function () {
            $('#side-menu').fadeIn(500);
          }, 300);
      } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
      }
    });
  },
  render() {
    return (
      <nav className="navbar navbar-static-top" role="navigation" style={{marginBottom: 0}}>
        <div className="navbar-header">
          <a id="navbar-minimalize" className="minimalize-styl-2 btn btn-primary " href="#">
            <i className="fa fa-bars"></i>
          </a>

        </div>
        <ul className="nav navbar-top-links navbar-right">
          {/*消息提示*/}
          {/*
          <li className="dropdown">
            <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
              <i className="fa fa-envelope"></i>
              <span className="label label-warning">16</span>
            </a>
            <ul className="dropdown-menu dropdown-messages">
              <li>
                <div className="dropdown-messages-box">
                  <a href="#" className="pull-left">
                    <img alt="image" className="img-circle" src="img/a7.jpg" />
                  </a>
                  <div className="media-body">
                    <small className="pull-right">46h ago</small>
                    <strong>Mike Loreipsum</strong> started following <strong>Monica Smith</strong>. <br />
                    <small className="text-muted">3 days ago at 7:58 pm - 10.06.2014</small>
                  </div>
                </div>
              </li>
              <li className="divider"></li>
              <li>
                <div className="dropdown-messages-box">
                  <a href="#" className="pull-left">
                    <img alt="image" className="img-circle" src="img/a4.jpg" />
                  </a>
                  <div className="media-body ">
                    <small className="pull-right text-navy">5h ago</small>
                    <strong>Chris Johnatan Overtunk</strong> started following <strong>Monica Smith</strong>. <br />
                    <small className="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
                  </div>
                </div>
              </li>
              <li className="divider"></li>
              <li>
                <div className="dropdown-messages-box">
                  <a href="#" className="pull-left">
                    <img alt="image" className="img-circle" src="img/profile.jpg" />
                  </a>
                  <div className="media-body ">
                    <small className="pull-right">23h ago</small>
                    <strong>Monica Smith</strong> love <strong>Kim Smith</strong>. <br />
                    <small className="text-muted">2 days ago at 2:30 am - 11.06.2014</small>
                  </div>
                </div>
              </li>
              <li className="divider"></li>
              <li>
                <div className="text-center link-block">
                  <a href="#">
                    <i className="fa fa-envelope"></i> <strong>Read All Messages</strong>
                  </a>
                </div>
              </li>
            </ul>
          </li>
          */}
          {/*系统提示*/}
          {/*
          <li className="dropdown">
            <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
              <i className="fa fa-bell"></i>  <span className="label label-primary">8</span>
            </a>
            <ul className="dropdown-menu dropdown-alerts">
              <li>
                <a href="#">
                  <div>
                    <i className="fa fa-envelope fa-fw"></i> You have 16 messages
                    <span className="pull-right text-muted small">4 minutes ago</span>
                  </div>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a href="#">
                  <div>
                    <i className="fa fa-twitter fa-fw"></i> 3 New Followers
                    <span className="pull-right text-muted small">12 minutes ago</span>
                  </div>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a href="#">
                  <div>
                    <i className="fa fa-upload fa-fw"></i> Server Rebooted
                    <span className="pull-right text-muted small">4 minutes ago</span>
                  </div>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <div className="text-center link-block">
                  <a href="#">
                    <strong>See All Alerts</strong>
                    <i className="fa fa-angle-right"></i>
                  </a>
                </div>
              </li>
            </ul>
          </li>
           */}
          <li>
            <a href={FlowRouter.path('logout')}>
              <i className="fa fa-sign-out"></i>
              <FormattedMessage message={this.getIntlMessage('login.logout')}/>
            </a>
          </li>
          <li>
            <a className="right-sidebar-toggle">
              <i className="fa fa-tasks"></i>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
});

export const TopBar = topBar;