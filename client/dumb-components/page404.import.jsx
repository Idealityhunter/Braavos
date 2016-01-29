var IntlMixin = ReactIntl.IntlMixin;

const page404 = React.createClass({
  mixins: [IntlMixin],

  render() {
    return (
      <div className="middle-box text-center animated fadeInDown">
        <h1>404</h1>
        <h3 className="font-bold">Page Not Found</h3>

        <div className="error-desc">
          Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.
          <form className="form-inline m-t" role="form">
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Search for page" />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>
    );
  }
});

export const Page404 = page404;
