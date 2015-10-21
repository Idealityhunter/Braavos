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
    let intlData = AppDeps.IntlData.zh;
    // 将intlData加入content中
    let content = React.cloneElement(this.props.content, intlData);
    return (
      <div id="wrapper">
        {/*左侧菜单栏*/}
        <LeftSiderBar {...intlData} />

        <div id="page-wrapper" className="gray-bg">
          {/*顶部导航栏*/}
          <TopBar {...intlData} />
          {content}
        </div>
      </div>
    );
  }
});

export const MainLayout = mainLayout;