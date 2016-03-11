
export const SearchBox = React.createClass({
  getDefaultProps: () => {
    return {

    }
  },

  propTypes: {
    // 修改搜索词的回调函数
    onChangeSearchWord: React.PropTypes.func,

    // 返回搜索结果的回调函数
    onChangeSearchResult: React.PropTypes.func,

    // 搜索词
    searchWord: React.PropTypes.string,

    // 搜索结果
    matchedMessages: React.PropTypes.object
  },

  styles: {
    container: {
      width: 250,
      height: 35,
      borderBottom: '1px solid #ccc'
    },
    search: {
      input: {
        margin: '5px 20px',
        padding: '1px 4px',
        width: 210,
        height: 25,
        borderRadius: 2,
        border: '1px solid #ddd'
      },
      result: {
        backgroundColor: 'rgba(255,255,255,1)',
        position: 'relative',
        border: '1px solid #aaa',
        width: 210,
        left: 20,
        top: -5,
        padding: 5,
        borderTop: 'none',
        maxHeight: 300
      },
      scrollWrap: {
        overflow: 'auto',
        width: 200,
        maxHeight: 290
      },
      highlight: {
        color: 'red',
        margin: '0px 1px'
      },
      ul: {
        listStyle: 'none',
        padding: 0,
        margin: 0
      },
      conversationName: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        margin: 2
      },
      conversationMessages: {
        margin: 0,
        paddingLeft: 20,
        cursor: 'pointer'
      }
    }
  },

  // 获取搜索到的匹配的消息列表
  getMatchedMessageList(searchWord){
    const self = this;
    Meteor.call('search.message.match.contents', searchWord, (err , res) => {
      // TODO: 搜索失败或者数据为空(没查到该数据...)
      if (err || !res){
        BraavosCore.logger.debug('搜索消息失败');
        BraavosCore.logger.debug(err);
      };

      // 成功的搜索
      this.props.onChangeSearchResult(res.hits.hits);
    });
  },

  // 用户修改搜索词的处理动作
  _handleChangeSearchWord(e){
    // 修改搜索词
    this.props.onChangeSearchWord(e.target.value);

    // 获取搜索引擎的数据
    //if (!this.throttled)
    //  this.throttled = _.throttle(this.getMatchedMessageList, 2000);
    //this.throttled(e.target.value);
    if (!this.debounced)
      this.debounced = _.debounce(this.getMatchedMessageList, 500);
    this.debounced(e.target.value);
  },

  // 建立message和conversation的映射关系
  mapMessagesToConversations(messages){
    // 另外一种方式 => 假如不需要name的话可以使用
    //return _.groupBy(messages, message => message._source.conversation);
    return _.reduce(messages, (memo, message) => {
      if (memo[message._source.conversation])
        memo[message._source.conversation].messages.push(message)
      else
        memo[message._source.conversation] = {
          key: message._source.conversation,
          name: message._source.conversation, // TODO 换成nickName
          messages: [message]
        }
      return memo;
    }, {})
  },

  // 根据em分割contents
  splitContentByEm(contents){
    return contents.split(/\<\/?\e\m\>/)
  },

  // 判奇函数
  isOdd(i){
    return i % 2
  },

  // 将contents分割成'非highlight部分'和'highlight部分',并区别展示
  getSplitContents(contents){
    contents = this.splitContentByEm(contents)
    const htmlContents = [];

    // 奇数项为'highlight部分',需要着重展示
    for (let i=0;i < contents.length;i++){
      htmlContents.push(
        (this.isOdd(i))
          ? <span style={this.styles.search.highlight}>{contents[i]}</span>
          : contents[i]
      )
    };

    return htmlContents;
  },

  render() {
    // 提取message,并修改成conversation -> messages的结构来存储
    const matchedMessages = this.props.matchedMessages && !this.props.matchedMessages.isEmpty() ? this.props.matchedMessages.toJS() : [];
    const conversationMessages = this.mapMessagesToConversations(matchedMessages);

    // 搜索结果的展示下拉列表
    const searchResult =
      <div style={this.styles.search.result} className={(this.props.searchWord && this.props.searchWord != '') ? '' : 'hidden'}>
        <div style={this.styles.search.scrollWrap}>
          {(matchedMessages.length > 0)
            ? <ul style={this.styles.search.ul}>
                {_.map(conversationMessages, conversation => (
                  <li key={conversation.key}>
                    <h3 style={this.styles.search.conversationName} title={conversation.name}>{conversation.name}</h3>
                    {conversation.messages.map(message =>
                      <p style={this.styles.search.conversationMessages} className="hover-gainsboro" key={message._id._str}>
                        {this.getSplitContents(message.highlight.contents[0])}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            : <div>未搜索到与'{this.props.searchWord}'相关的消息</div>
          }
        </div>
      </div>;

    return(
      <div style={this.styles.container}>
        <input type="text" placeholder="搜索聊天记录"
               value={this.props.searchWord}
               style={this.styles.search.input}
               onChange={this._handleChangeSearchWord}/>
        {searchResult}
      </div>
    )
  }
});
