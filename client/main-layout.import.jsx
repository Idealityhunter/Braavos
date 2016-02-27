import {LeftSiderBar} from '/client/dumb-components/common/left-siderbar';
import {TopBar} from '/client/dumb-components/common/topbar';
import {store} from '/client/redux/store'
import {Provider} from '/lib/redux'

let App = React.createClass({
  componentDidMount() {
    // Initialize i-check plugin
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });
  },
  render() {
    const intlData = _.pick(this.props, 'locales', 'messages', 'format');
    document.title = this.props.documentTitle ? `${this.props.documentTitle}-旅行派|商户管理平台` : '旅行派|商户管理平台';

    return (
      <div id="wrapper">
        {/*左侧菜单栏*/}
        <LeftSiderBar {...intlData} />

        <div id="page-wrapper" className="gray-bg">
          {/*顶部导航栏*/}
          <TopBar {...intlData} />
          {this.props.content}
        </div>
      </div>
    );
  }
});

export const MainLayout = App;//() => <Provider store={store}><App /></Provider>;