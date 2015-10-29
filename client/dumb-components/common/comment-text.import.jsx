
class commentText extends React.Component {
  render() {
    return (
      <div className={this.props.inline ? 'comment-text inline' : 'comment-text'}>注：{this.props.text}</div>
    );
  }
};

export const CommentText = commentText;