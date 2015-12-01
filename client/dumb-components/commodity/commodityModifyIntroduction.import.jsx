import {CommentText} from '/client/dumb-components/common/comment-text';
const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

let commodityModifyIntroduction = React.createClass({
  mixins: [IntlMixin],

  placeholders: {
    introduction: '请添加商品介绍，您可粘贴图片或编辑文字描述'
  },

  componentDidMount(){
    // 初始化desc页面的um插件
    UM.delEditor('ueContainer');
    const um = UM.getEditor('ueContainer');
    um.ready(() => {
      //设置编辑器的内容
      um.setContent((this.props.desc && this.props.desc.body) ? this.props.desc.body : '');
    });
  },

  render() {
    return (
      <div className="commodity-introduction-wrap">
        <form className="form-horizontal">
          <div className="form-group introduction">
            <label className="" style={{verticalAlign: 'top'}}>商品介绍</label>
            <div className="essay-contents inline">
              <CommentText text={this.placeholders.introduction}/>
              <script id="ueContainer" name="content" type="text/plain" style={{height: 400, width: 800}}></script>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyIntroduction = commodityModifyIntroduction;