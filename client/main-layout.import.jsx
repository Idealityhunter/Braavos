let mainLayout = React.createClass({
  render() {
    return (
      <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
      <div className="container todoWrapper">
        <div className="well text-center">
          Braavos
        </div>
        {this.props.content}
      </div>
      </body>
      </html>
    );
  }
});

export const MainLayout = mainLayout;