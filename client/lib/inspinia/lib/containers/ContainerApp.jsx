ContainerApp = React.createClass({
  mixins: [ReactMeteorData],
  componentWillMount() {
    console.log('will mount');
    let id = new Mongo.ObjectID().toString();
    if (!id) {
      id = Meteor.uuid();
      FlowRouter.setParams({id: id});
    }
    console.log(id);
  },
  componentDidMount() {
    console.log('did mount');
  },
  getMeteorData() {
    console.log('meteor data');
    return {};
  },
  submitInfo() {
    //Business.update()
  },
  render() {
    return (
      <BaiscForm />
    );
  }
});