/**
 * Created by zephyre on 12/4/15.
 */

import {Breadcrumb, BreadcrumbItem} from "/lib/react-bootstrap"

export const BraavosBreadcrumb = React.createClass({
  render() {
    const items = FlowBreadcrumb.breadcrumbList().map(v => {
      const {title, path, route, active} = v;
      return active ?
        <BreadcrumbItem key={route.options.name} active>{title}</BreadcrumbItem> :
        <BreadcrumbItem key={route.options.name} href={path}>{title}</BreadcrumbItem>;
    });

    return (
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-lg-12">
          <h2></h2>
          <Breadcrumb>
            {items}
          </Breadcrumb>
        </div>
      </div>
    );
  }
});

