import {GoogleMapComponent} from '/client/dumb-components/common/googlemaps';
import {TextField} from "/client/components/textfield/textfield"

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
      location: [lat, lng],
      showOverlay: false,
      ovverlayMessage: "输入错误",
      tfValue: ""
    }
  },

  onTextFieldChange(event) {
    this.setState({tfValue: event.value, showOverlay: event.value.length >= 3});
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

  componentDidMount(){
    //UM.delEditor('ueContainer');
    //const um = UM.getEditor('ueContainer');
    //um.setContent('<p><img src="http://ueditor.baidu.com/server/umeditor/upload/demo.jpg" /></p>');
  },

  render() {
    return (
      <div>
        <TextField value={this.state.tfValue} onChange={this.onTextFieldChange} showOverlay={this.state.showOverlay}
                   labelClassName="col-xs-1" wrapperClassName="col-xs-3"
                   overlayMessage="输入错误" label="输入" placeholder="请输入详细信息"/>
        {/*
         <div className="essay-contents">
         <script id="ueContainer" name="content" type="text/plain" style={{height: 400}}></script>
         </div>
         <div>
         <input type="text" onChange={this.onChange} name="latitude" value={this.state.lat}/>
         <input type="text" onChange={this.onChange} name="longitude" value={this.state.lng}/>
         <button onClick={this.onClick}>Click</button>
         <GoogleMapComponent lat={this.state.location[0]} lng={this.state.location[1]}/>
         </div>
         */}
      </div>
    );
  }
});


//<FormattedNumber locales={['en-US']} local='en-US' value={1000} style="currency" currency="USD" />
export const Test = test;
