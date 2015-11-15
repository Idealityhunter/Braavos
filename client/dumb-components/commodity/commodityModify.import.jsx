import {Pageheading} from '/client/dumb-components/common/pageheading';
import {CommodityModifyBasic} from '/client/dumb-components/commodity/commodityModifyBasic';
import {CommodityModifyIntroduction} from '/client/dumb-components/commodity/commodityModifyIntroduction';
import {CommodityModifyInstruction} from '/client/dumb-components/commodity/commodityModifyInstruction';
import {CommodityModifyBook} from '/client/dumb-components/commodity/commodityModifyBook';
import {CommodityModifyTraffic} from '/client/dumb-components/commodity/commodityModifyTraffic';


const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityModify = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],
  getInitialState(){
    return {
      plans: []
    }
  },

  getMeteorData() {
    Meteor.subscribe('basicUserInfo');
    Meteor.subscribe('sellerInfo');
    // TODO 暂时通过router传数据进来!
    //Meteor.subscribe('commodityInfo', this.props.commodityId);
    //const commodityInfo = BraavosCore.Database.Braavos.Commodity.findOne({commodityId: this.props.commodityId});
    return {
      //commodityInfo: commodityInfo
    };
  },

  componentDidMount (){
    const self = this;
    $(".steps-container").steps({
      headerTag: "h3",
      bodyTag: "div",
      transitionEffect: "fade",
      autoFocus: true,
      onFinishing: function (event, currentIndex) {
        // TODO 验证和提交
        //当前step form
        //const form = $(this);

        // 获取填写的信息
        const priceInfo = _.reduce(self.state.plans, function(min, plan){
          if (plan.price < min.price){
            return {
              price: plan.price,
              marketPrice: plan.marketPrice
            };
          };
          return min;
        }, {
          price: Number.MAX_VALUE,
          marketPrice: Number.MAX_VALUE
        });

        // 获取上传图片
        const imageList = $('.gallery-wrap').find('.img-wrap').children('img');
        let images = [];
        let cover = {};
        for (i = 0;i < imageList.length;i++){
          if ($(imageList[i]).siblings('.fa-heart').length > 0)
            cover = {
             url: imageList[i].src
            }
          images[i] = {
            url: imageList[i].src
          };
        };

        // 获取country选中的option对应的值
        const countryIndex = $('.form-group.address>select').val();
        const country = $($('.form-group.address>select>option')[parseInt(countryIndex)]).text();

        // 获取category选中的option对应的值
        const categoryIndex = $('.form-group.category>select').val();
        const category = $($('.form-group.category>select>option')[parseInt(categoryIndex)]).text();

        // TODO plans中pricing的日期的转换
        // TODO 获取几个文本信息的值

        const timeRequired = $('.form-group.time-required').find('input').prop('checked');
        const commodityInfo = {
          title: $('.form-group.title>input').val(),
          country: {
            className: country,
            zhName: country,
            enName: country
          },
          address: $('.form-group.address>input').val(),
          category: [category],
          timeCost: $('.form-group.cost-time>input').val(),
          //stockInfo: $('.form-group.cost-time>input').val(),
          //book: $('.form-group.book>textarea').val(),
          //unbook: $('.form-group.unbook>textarea').val(),
          //chargeInclude: $('.form-group.charge-include>textarea').val(),
          //chargeExcept: $('.form-group.charge-except>textarea').val(),
          //usage: $('.form-group.usage>textarea').val(),
          //attention: $('.form-group.attention>textarea').val(),
          //traffic: $('.form-group.traffic>textarea').val(),
          //desc: $('.form-group.introduction>textarea').val(),
          price: priceInfo.price,
          marketPrice: priceInfo.marketPrice,
          plans: self.state.plans.map((plan) => {
            return {
              planId: plan.key,
              price: plan.price,
              marketPrice: plan.marketPrice,
              pricing: (timeRequired) ? plan.pricing : [{
                price: plan.price,
                timeRange: []
              }],
              title: plan.title,
              timeRequired: timeRequired//暂时全部一样
            }
          }),
          cover: cover,
          images : images
        };

        // TODO 提交并验证
        Meteor.call('commodity.insert', Meteor.userId(), commodityInfo, function(err, res){
          // TODO 回调结果反应
          if (err){
            swal("Failed!", "添加商品失敗!.", "error");
          };
          if (res){
            swal({
              title: "Successful!",
              text: "Your commodity has been added.",
              type: "success",
              showCancelButton: false,
              confirmButtonColor: "#AEDEF4",
              closeOnConfirm: true
            }, function(){
              FlowRouter.go('commodities');
            })
          }
        });

        // steps插件在return false时,title的样式会有不同
        return true;
      }
    });
    // TODO 理解jquery validate的用法
    //.validate({
    //  errorPlacement: function (error, element) {
    //    element.before(error);
    //  },
    //  rules: {
    //    confirm: {
    //      equalTo: "#password"
    //    }
    //  }
    //});

    // datepicker的绑定,要放在steps后,疑似steps改变了DOM结构,待考证
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });
  },


  handleChildSubmitState(plans){
    this.setState({
      plans: plans
    });
    return ;
  },

  render() {
    const prefix = 'commodities.modify.';
    return (
      <div className="commodity-modify-wrap">
        <Pageheading root="首页" category="商品管理" title="商品修改"/>
        <div className='steps-container'>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'basic')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'introduction')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'instruction')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'book')}/></h3>
          <h3><FormattedMessage message={this.getIntlMessage(prefix + 'traffic')}/></h3>
          <div className="basic">
            <CommodityModifyBasic
              handleChildSubmitState={this.handleChildSubmitState.bind(this)}
              title={this.props.title || []}
              cover={this.props.cover || ''}
              images={this.props.images || []}
              category={this.props.category || []}
              country={this.props.country || {}}
              address={this.props.address || ''}
              timeCost={this.props.timeCost || ''}
              plans={this.props.plans || []}
              price={this.props.price || ''}
              marketPrice={this.props.marketPrice || ''}
            />
          </div>
          <div className="introduction">
            <CommodityModifyIntroduction desc={this.props.desc || []}/>
          </div>
          <div className="instruction">
            <CommodityModifyInstruction notice={this.props.notice || []}/>
          </div>
          <div className="book">
            <CommodityModifyBook refundPolicy={this.props.refundPolicy || []}/>
          </div>
          <div className="traffic">
            <CommodityModifyTraffic trafficInfo={this.props.trafficInfo || []}/>
          </div>
        </div>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
