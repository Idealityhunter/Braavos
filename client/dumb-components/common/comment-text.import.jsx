

const commentText = React.createClass({
  styles: {
    verticalAlign: 'middle',
    color: 'darksalmon',
    fontSize: 12
  },
  render() {
    return (
      <div className={this.props.inline ? 'comment-text inline' : 'comment-text'}
           style={_.extend({}, this.styles, this.props.style)}>
        注：{this.props.text}
      </div>
    );
  }
});

export const CommentText = commentText;