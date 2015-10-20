var IntlMixin = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedRelative = ReactIntl.FormattedRelative;

var PostMeta = React.createClass({
  mixins: [IntlMixin],

  render: function () {
    return (
      <FormattedMessage
        message={this.getIntlMessage('post.meta')}
        num={<FormattedNumber value={this.props.post.comments.length + 2389} />}
        ago={<FormattedRelative value={this.props.post.date} />}/>
    );
  }
});

var post = {
  date: 1422046290531,
  comments: ['asf', 'af']
};

//var intlData = {
//  locales: ['en-US'],
//  messages: {
//    post: {
//      meta: 'Posted {ago}, {num} comments'
//    }
//  }
//};

let test = React.createClass({
  mixins: [IntlMixin],

  render() {
    return (
      <div>
        <p>
          <FormattedMessage message={this.getIntlMessage('welcome')} />
        </p>

        <p>
          <FormattedNumber value={4200}/>
        </p>
      </div>

    );
  }
});

//<FormattedNumber locales={['en-US']} local='en-US' value={1000} style="currency" currency="USD" />
export const Test = test;