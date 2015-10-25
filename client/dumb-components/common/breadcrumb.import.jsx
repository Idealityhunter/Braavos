/**
 * 根据route对象中的parent属性, 从当前的route出发, 从下到上寻找所有的routes, 形成面包屑导航
 */
const breadcrumb = React.createClass({
  render() {
    // 获得routes列表
    const routes = [];
    let current = FlowRouter.current().route;
    routes.push(current);
    while (true) {
      const parentName = current.options.parent;
      const parent = parentName ? FlowRouter._routesMap[parentName] : null;
      if (parent) {
        current = parent;
        routes.push(current);
      } else {
        break;
      }
    }
    routes.reverse();

    // 获得对应的breadcrumb条目
    const entries = routes.map(r=> {
      const title = r.options.title || 'default';
      return <li><a href={FlowRouter.path(r.options.name)}>{title}</a></li>;
    });

    return (
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-lg-12">
          <h2>{this.props.title}</h2>
          <ol className="breadcrumb">
            {entries}
          </ol>
        </div>
      </div>
    );
  }
});

export const Breadcrumb = breadcrumb;