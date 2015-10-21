import {LeftSiderBar} from './dumb-components/common/left-siderbar';
import {TopBar} from './dumb-components/common/topbar';


let mainLayout = React.createClass({
  componentDidMount() {
    // Initialize i-check plugin
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });
  },
  render() {
    var intlData = AppDeps.IntlData.zh;
    return (
      <div id="wrapper">
        {/*左侧菜单栏*/}
        <LeftSiderBar {...intlData} />

        <div id="page-wrapper" className="gray-bg">
          {/*顶部导航栏*/}
          <TopBar />
          {this.props.content}
        </div>
      </div>
    );
  }
});

export const MainLayout = mainLayout;