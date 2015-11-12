

const commentText = React.createClass({
  style: {
    verticalAlign: 'middle'
  },
  render() {
    return (
      <div className={this.props.inline ? 'comment-text inline' : 'comment-text'} style={this.style}>注：{this.props.text}</div>
    );
  }
});

export const CommentText = commentText;