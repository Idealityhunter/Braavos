var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var text;

let commodityModifyIntroduction = React.createClass({
  mixins: [IntlMixin],
  placeholders: {
    introduction: '请添加商品介绍，您可粘贴图片或编辑文字描述'
  },

  componentDidMount(){
    const ue = UE.getEditor('ueContainer');

    // 存储自用的ue相关的变量参数
    //Meteor.call('getEssayConfig', function(err, res){
    //  ue.lxp = {
    //    bucket: 'essay', //res.bucket
    //    host: 'http://7xkpn3.com1.z0.glb.clouddn.com/',// res.host
    //    prefix: {
    //      images: 'static/images/',
    //      draft: 'preview/',
    //      publish: ''
    //    },
    //    suffix: {
    //      draft: '.html'
    //    }
    //  };
    //})

    const self = this;
    ue.ready(function(){
      //设置编辑器的内容
      ue.setContent((self.props.desc.body) ? self.props.desc.body : self.placeholders.introduction);
    });
  },

  render() {
    return (
      <div className="commodity-introduction-wrap">
        <form className="form-horizontal">
          <div className="form-group introduction">
            <label className="">商品介绍</label>
            <div className="essay-contents">
              <script id="ueContainer" name="content" type="text/plain" style={{height: 700}}></script>
            </div>
            {/* origin textarea
             <textarea className="form-control placeholder" rows="13"
             placeholder={this.placeholders.introduction}
             defaultValue={(this.props.desc.body) ? this.props.desc.body : ''}/>
            */}
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyIntroduction = commodityModifyIntroduction;