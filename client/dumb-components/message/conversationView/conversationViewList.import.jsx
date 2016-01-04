// 左侧的 Conversation View 列表

import {ConversationView} from '/client/dumb-components/message/conversationView/conversationView';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationViewList = React.createClass({
  mixins: [IntlMixin],
  styles:{
    container: {
      borderRight: '1px solid #ccc',
      display: 'inline-block',
      width: 250,
      height: 598,
      boxSizing: 'border-box'
    },
    listWrap: {
      width: 249,
      height: 594,
      marginTop: 2,
      overflow: 'auto',
      boxSizing: 'border-box'
    }
  },
  render(){
    return (
      <div style={this.styles.container}>
        <div style={this.styles.listWrap}>
          {this.props.conversations.map(conversation => <ConversationView {... conversation}/>)}
        </div>
      </div>
    );
  }
});
