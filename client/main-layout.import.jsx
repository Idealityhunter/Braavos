import {LeftSiderBar} from './dumb-components/common/left-siderbar';
import {TopBar} from './dumb-components/common/topbar';


let mainLayout = React.createClass({
  render() {
    return (
      <div id="wrapper">
        {/*左侧菜单栏*/}
        <LeftSiderBar />

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