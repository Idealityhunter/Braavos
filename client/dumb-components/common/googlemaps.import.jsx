export const GoogleMapComponent = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    name: React.PropTypes.string,
    zoom: React.PropTypes.number,
    lat: React.PropTypes.number,
    lng: React.PropTypes.number,
    markers: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      name: 'Google Maps',
      zoom: 10,
      lat: 0,
      lng: 0,
      markers: []
    };
  },

  componentDidMount() {
    GoogleMaps.load();
  },

  getMeteorData() {
    return {
      loaded: GoogleMaps.loaded(),
      mapOptions: GoogleMaps.loaded() && this._mapOptions()
    };
  },

  _mapOptions() {
    return {
      center: new google.maps.LatLng(this.props.lat, this.props.lng),
      zoom: this.props.zoom
    };
  },

  render() {
    if (this.data.loaded) {
      // 初始化marker
      const markers = {};
      this.props.markers.forEach(entry=> {
        markers[Meteor.uuid()] = entry;
      });

      return <GoogleMapCore name={this.props.name} markers={markers}
                            options={{center: new google.maps.LatLng(this.props.lat, this.props.lng),
                            zoom: this.props.zoom}}/>;
    }

    return <div>Loading map...</div>;
  }
});

const GoogleMapCore = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
    markers: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      markers: {}
    };
  },

  getInitialState() {
    return {
      markers: this.props.markers
    };
  },

  // 存放内部的真实的marker对象
  _markers: {},

  // 地图实例对象
  _mapInstance: undefined,

  componentDidMount() {
    GoogleMaps.create({
      name: this.props.name,
      element: ReactDOM.findDOMNode(this),
      options: this.props.options
    });

    GoogleMaps.ready(this.props.name, (map) => {
      this._mapInstance = map.instance;

      google.maps.event.addListener(map.instance, 'click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const markerId = Meteor.uuid();

        const markersState = this.state.markers;
        markersState[markerId] = {lat: lat, lng: lng};
        this.setState({markers: markersState});
      });
    });
  },

  render() {
    // 删除state中不再出现的marker
    const deletedKeys = _.difference(Object.keys(this._markers), Object.keys(this.state.markers));
    deletedKeys.forEach(k=> {
      google.maps.event.clearInstanceListeners(this._markers[k]);
      delete this._markers[k];
    });

    // 移动已有的marker
    const oldKeys = _.intersection(Object.keys(this.state.markers), Object.keys(this._markers));
    oldKeys.forEach(k=> {
      this._markers[k].setPosition({lat: this.state.markers[k].lat, lng: this.state.markers[k].lng})
    });

    // 需要新建的marker
    const newKeys = _.difference(Object.keys(this.state.markers), Object.keys(this._markers));
    newKeys.forEach(k=> {
      const lat = this.state.markers[k].lat;
      const lng = this.state.markers[k].lng;

      const marker = new google.maps.Marker({
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, lng),
        map: this._mapInstance,
        id: k
      });

      google.maps.event.addListener(marker, 'dragend', (event) => {
        // 拖动marker的时候,需要更新state
        const s = this.state.markers;
        s[k].lat = event.latLng.lat();
        s[k].lng = event.latLng.lng();
        this.setState({markers: s});
      });

      this._markers[k] = marker;
    });

    return <div className="map-container"></div>;
  }
});