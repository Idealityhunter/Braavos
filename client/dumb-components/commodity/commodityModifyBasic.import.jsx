import {CommentText} from 'client/dumb-components/common/comment-text';
import {CommodityGallery} from 'client/dumb-components/commodity/commodityGallery';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

class commodityModifyBasic extends React.Component {
  componentDidMount() {
    $('textarea').on('blur', function (e) {
      console.log(e.target.value);
    });
  }

  render() {
    return (
      <div className="commodity-basic-wrap">
        <label className="">商品图片</label>
        <CommodityGallery />
        <hr style={{border:'1px dashed #ddd'}}/>
        <label className="">基本信息</label>
        <form className="form-horizontal commodity-basic-form-wrap">
          <div className="form-group">
            <label className="label-text">商品名称*</label>
            <input className="inline" type='text' placeholder=""/>
          </div>
          <div className="form-group">
            <label className="label-text">地址信息*</label>
            <select name="" id="" className="form-control">
              <option value="">中国</option>
              <option value="">泰国</option>
              <option value="">菲律宾</option>
            </select>
            <select name="" id="" className="form-control">
              <option value="">海南</option>
              <option value="">北京</option>
              <option value="">上海</option>
            </select>
            <input className="inline" type='text' placeholder=""/>
          </div>
          <div className="form-group">
            <label className="label-text">商品分类*</label>
            <select name="" id="" className="form-control">
              <option value="">特色活动</option>
              <option value="">文化体验</option>
              <option value="">美食住宿</option>
              <option value="">城市游览</option>
              <option value="">门票预订</option>
              <option value="">演出</option>
              <option value="">SPA</option>
              <option value="">游船</option>
              <option value="">其他</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label-text">服务语言</label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox1" value="option1"/> 英语
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox2" value="option2"/> 中文
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox3" value="option3"/> 本地语言
            </label>
            <CommentText text='服务语言为与游客交流的语言' inline={true} />
          </div>
          <div className="form-group">
            <label className="label-text">游玩时长</label>
            <input className="inline" type='text' placeholder=""/> 小时
          </div>
          <div className="form-group">
            <label className="label-text">旅行服务</label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox1" value="option1"/> 当地咨询
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox2" value="option2"/> 行程规划
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox3" value="option3"/> 语言帮助
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox3" value="option3"/> 其它 <input className="inline" type='text' placeholder=""/>
            </label>
            <CommentText text='旅行服务为您愿意为游客免费提供的一些旅行帮助'/>
          </div>
        </form>
        <hr style={{border:'1px dashed #ddd'}}/>
        <label className="">预定设置*</label>
        <form className="form-horizontal commodity-basic-form-wrap">
          <div className="form-group">
            <label className="label-text">使用日期</label>
            <label className="checkbox-inline">
              <input type="checkbox" id="inlineCheckbox2" value="option2"/> 需要使用日期
            </label>
            <CommentText text='是否需要游客在预定时指定他的使用日期'/>
          </div>
          <table className="table">
            <tr>
              <td className="">泰国清迈Oasis Spa绿洲水疗体验按摩</td>
              <td className="">市场价$59</td>
              <td className="">售价$39起<i className="fa fa-calendar cursor-pointer calender-price"/></td>
              <td className="">库存<i className="fa fa-calendar cursor-pointer calender-stock"/></td>
              <td className="controler">
                <button className="" style={{marginRight: 10}}>修改</button>
                <button className="" style={{marginRight: 10}}>删除</button>
                <button className="" style={{marginRight: 10}}>复制</button>
              </td>
            </tr>
            <tr>
              <td className="">泰国清迈Oasis Spa绿洲massage</td>
              <td className="">市场价$30</td>
              <td className="">售价$26起<i className="fa fa-calendar cursor-pointer calender-price"/></td>
              <td className="">库存<i className="fa fa-calendar cursor-pointer calender-stock"/></td>
              <td className="controler">
                <button className="" style={{marginRight: 10}}>修改</button>
                <button className="" style={{marginRight: 10}}>删除</button>
                <button className="" style={{marginRight: 10}}>复制</button>
              </td>
            </tr>
          </table>
          <div className="form-group commodity-add">
            <div className="inline desc"><input type='text' placeholder="套餐描述" /></div>
            <div className="inline price-ave"><input type='text' placeholder="市场价" /></div>
            <div className="inline price-cur"><input type='text' className="inline" placeholder="售价" /><i className="fa fa-calendar cursor-pointer calender-price"/></div>
            <div className="inline stock"><input type='text' className="inline" placeholder="库存" /><i className="fa fa-calendar cursor-pointer calender-stock"/></div>
            <div className="inline add-button"><button className="">确定</button></div>
          </div>
        </form>
      </div>
    );
  }
};

export const CommodityModifyBasic = commodityModifyBasic;