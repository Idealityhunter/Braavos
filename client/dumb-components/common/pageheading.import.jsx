let pageheading = React.createClass({
  render() {
    let path = FlowRouter.current().context.pathname;
    if (this.props.category){
      this.props.categoryUrl = path.substring(0, path.lastIndexOf('/'));
    }
    //let route = FlowRouter.getRouteName();
    //console.log(path);
    //var title = 'path';
    console.log(this.props);
    return (
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-lg-12">
          <h2>{this.props.title}</h2>
          <ol className="breadcrumb">
            {this.props.root ? <li><a href='/'>{this.props.root}</a></li> : ''}
            {this.props.category ? <li><a href={this.props.categoryUrl}>{this.props.category}</a></li> : ''}
            <li className="active">
              <strong>{this.props.title}</strong>
            </li>
          </ol>
        </div>
      </div>
    );
  }
});

export const Pageheading = pageheading;