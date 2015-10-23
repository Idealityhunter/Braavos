let udTest = React.createClass({
  componentDidMount() {
    ue = UE.getEditor(this.refs['ud-c'].getDOMNode());
    ue.setContent('<p>hello!</p>');
  },
  render() {
    return (
      <div ref="ud-c"></div>
    );
  }
});

export const UdTest = udTest;