import {GoogleMapComponent} from '/client/dumb-components/common/googlemaps';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedRelative = ReactIntl.FormattedRelative;

const index = React.createClass({
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

  componentDidMount(){
    //UM.delEditor('ueContainer');
    //const um = UM.getEditor('ueContainer');
    //um.setContent('<p><img src="http://ueditor.baidu.com/server/umeditor/upload/demo.jpg" /></p>');

    // Particle效果
    function Particle(x, y, radius) {
      this.init(x, y, radius);
    }

    Particle.prototype = {

      init : function(x, y, radius) {

        this.alive = true;

        this.radius = radius || 10;
        this.wander = 0.15;
        this.theta = random(TWO_PI);
        this.drag = 0.92;
        this.color = '#fff';

        this.x = x || 0.0;
        this.y = y || 0.0;

        this.vx = 0.0;
        this.vy = 0.0;
      },

      move : function() {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.drag;
        this.vy *= this.drag;

        this.theta += random(-0.5, 0.5) * this.wander;
        this.vx += sin(this.theta) * 0.1;
        this.vy += cos(this.theta) * 0.1;

        this.radius *= 0.96;
        this.alive = this.radius > 0.5;
      },

      draw : function(ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    };

    // ----------------------------------------
    // Example
    // ----------------------------------------

    var MAX_PARTICLES = 280;
    var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900',
      '#FF4E50', '#F9D423' ];

    var particles = [];
    var pool = [];

    var demo = Sketch.create({
      container : document.getElementById('particle')
    });

    demo.setup = function() {

      // Set off some initial particles.
      var i, x, y;

      //  for ( i = 0; i < 20; i++ ) {
      x = (demo.width * 0.5) + random(-100, 100);
      y = (demo.height * 0.5) + random(-100, 100);
      demo.spawn(0, 999);
      // }
    };

    demo.spawn = function(x, y) {

      if (particles.length >= MAX_PARTICLES)
        pool.push(particles.shift());

      particle = pool.length ? pool.pop() : new Particle();
      particle.init(x, y, random(5, 40));

      particle.wander = random(0.5, 2.0);
      particle.color = random(COLOURS);
      particle.drag = random(0.9, 0.99);

      theta = random(TWO_PI);
      force = random(2, 8);

      particle.vx = sin(theta) * force;
      particle.vy = cos(theta) * force;

      particles.push(particle);
    };

    demo.update = function() {

      var i, particle;

      for (i = particles.length - 1; i >= 0; i--) {

        particle = particles[i];

        if (particle.alive)
          particle.move();
        else
          pool.push(particles.splice(i, 1)[0]);
      }
    };

    demo.draw = function() {

      demo.globalCompositeOperation = 'lighter';

      for ( var i = particles.length - 1; i >= 0; i--) {
        particles[i].draw(demo);
      }
    };

    demo.mousemove = function() {

      var particle, theta, force, touch, max, i, j, n;

      for (i = 0, n = demo.touches.length; i < n; i++) {

        touch = demo.touches[i], max = random(1, 4);
        for (j = 0; j < max; j++) {
          demo.spawn(touch.x, touch.y);
        }

      }
    };

    // 落地效果
    $('#logo')
      .addClass('animated flip')// 添加CSS类名
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass('animated bounceOutLeft');
      });
  },

  styles: {
    centerBlock: {
      display: 'block',
      backgroundColor: 'rgba(255,255,255,.7)',
      width: 220,
      marginTop: -60,
      marginLeft: -100,
      fontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: 20,
      borderRadius: 5,
      textAlign: 'center',
      position: 'fixed',
      left: '50%',
      top: '50%',
      overflow: 'hidden',
      zIndex: 9999,
      cursor: 'default'
    },
    title: {
      fontSize: 36,
      lineHeight: 1.5
    },
    abstract: {
      fontSize: 18
    }
  },

  render() {
    return (
      <div>
        <div id='logo' className="center-block" style={this.styles.centerBlock}>
          <h2 style={this.styles.title}>旅行派</h2>
          <h4 style={this.styles.abstract}>商户管理平台</h4>
        </div>
        <div id="particle" style={{position: 'fixed', top: 0, zIndex: 20}}></div>
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
export const Index = index;
