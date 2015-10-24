import {GoogleMapComponent} from 'client/dumb-components/common/googlemaps';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedRelative = ReactIntl.FormattedRelative;

const test = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    const lat = -37.8136;
    const lng = 144.9631;
    return {
      lat: lat,
      lng: lng,
      location: [lat, lng]
    }
  },

  onChange(evt) {
    const name = evt.target.name;
    console.log(`${name} changes`);

    if (name == 'latitude') {
      this.setState({lat: evt.target.value});
    } else if (name == 'longitude') {
      this.setState({lng: evt.target.value});
    }
  },

  onClick() {
    const lat = parseFloat(this.state.lat);
    const lng = parseFloat(this.state.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      this.setState({location: [lat, lng]});
    }
  },

  render() {
    console.log('home render');
    return (
      <div>
        <input type="text" onChange={this.onChange} name="latitude" value={this.state.lat}/>
        <input type="text" onChange={this.onChange} name="longitude" value={this.state.lng}/>
        <button onClick={this.onClick}>Click</button>
        <GoogleMapComponent lat={this.state.location[0]} lng={this.state.location[1]}/>
      </div>
    );
  }
});


//<FormattedNumber locales={['en-US']} local='en-US' value={1000} style="currency" currency="USD" />
export const Test = test;
