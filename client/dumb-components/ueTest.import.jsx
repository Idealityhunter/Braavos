let ueTest = React.createClass({
  componentDidMount() {
    UE.getEditor( React.findDOMNode(this.refs['ue-container']));
  },
  render() {
    return (
      <div ref='ue-container'></div>
    );
  }
});

export const UETest = ueTest;