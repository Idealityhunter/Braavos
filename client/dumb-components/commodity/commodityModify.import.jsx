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
      plans: this.props.plans || []
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
      enableCancelButton: false,
      labels: {
        finish: "完成",
        next: "下一步",
        previous: "上一步",
        cancel: '取消'
      },
      onStepChanging: function(event, currentIndex, newIndex){
        if (currentIndex < newIndex){
          // TODO 验证当前tab的必要信息是否填充完毕
          switch (currentIndex){
            case 0: {
              // 名称,图片,时长和套餐是必须的
              if (!$('.form-group.title>input').val()
                || $('.gallery-wrap').find('.img-wrap').children('img').length <= 0
                || !$('.form-group.cost-time>input').val()
                || self.state.plans.length <= 0){
                // TODO 弹窗提示?还是别的?
                return false;
              }
              break;
            };
            case 2: {
              // 费用包含和使用方法是必须的
              if (!$('.form-group.charge-include>textarea').val() || !$('.form-group.usage>textarea').val()){
                // TODO 弹窗提示?还是别的?
                return false;
              }
              break;
            };
            case 3: {
              // 预定和退改流程都是必须的
              if (!$('.form-group.book>textarea').val() || !$('.form-group.unbook>textarea').val()){
                // TODO 弹窗提示?还是别的?
                return false;
              }
              break;
            };
            default: return true;
          }
        }
        return true;
      },
      onFinishing: function (event, currentIndex) {
        // TODO 验证和提交
        //$(".body:eq(" + newIndex + ") .error", form).removeClass("error")

        // 当前若是在最后一页则无需检查,可以直接提交
        if (currentIndex < 4){
          // TODO 在其它的页面的提交需要做检查
          if (!$('.form-group.title>input').val()
            || $('.gallery-wrap').find('.img-wrap').children('img').length <= 0
            || !$('.form-group.cost-time>input').val()
            || self.state.plans.length <= 0){
            // TODO 弹窗提示?还是别的?
            console.log($(".steps>ul>li:eq(0)"));
            $(".steps>ul>li:eq(0)").addClass("error");
            location.hash = "steps-uid-0-t-0";
            if (currentIndex != 0)
              return true;
            else
              return false;
          };
          if (!$('.form-group.charge-include>textarea').val() || !$('.form-group.usage>textarea').val()){
            // TODO 弹窗提示?还是别的?
            //$(".steps>ul>li:eq(2)").addClass("error");
            //location.hash = "steps-uid-0-t-2";
            return false;
          };
          if (!$('.form-group.book>textarea').val() || !$('.form-group.unbook>textarea').val()){
            // TODO 弹窗提示?还是别的?
            //$(".steps>ul>li:eq(3)").addClass("error");
            //location.hash = "steps-uid-0-t-3";
            return false;
          };
        };

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
             url: imageList[i].src.split('?')[0]//截取掉imageView等参数
            }
          images[i] = {
            url: imageList[i].src.split('?')[0]
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

        // tips: 现在timeRequired默认为true且不可修改
        //const timeRequired = $('.form-group.time-required').find('input').prop('checked');
        const timeRequired = true;

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
          refundPolicy: [
            {
              // book
              title: '预定流程',
              summary: $('.form-group.book>textarea').val(),
              body: $('.form-group.book>textarea').val()
            },
            {
              // unbook
              title: '退改流程',
              summary: $('.form-group.unbook>textarea').val(),
              body: $('.form-group.unbook>textarea').val()
            }
          ],
          notice: [
            {
              // chargeInclude
              title: '费用包含',
              summary: $('.form-group.charge-include>textarea').val(),
              body: $('.form-group.charge-include>textarea').val()
            },
            {
              // chargeExcept
              title: '费用不含',
              summary: $('.form-group.charge-except>textarea').val(),
              body: $('.form-group.charge-except>textarea').val()
            },
            {
              // usage
              title: '使用方法',
              summary: $('.form-group.usage>textarea').val(),
              body: $('.form-group.usage>textarea').val()
            },
            {
              // attention
              title: '注意事项',
              summary: $('.form-group.attention>textarea').val(),
              body: $('.form-group.attention>textarea').val()
            }
          ],
          trafficInfo: [{
            title: '交通提示',
            summary: $('.form-group.traffic>textarea').val(),
            body: $('.form-group.traffic>textarea').val()
          }],
          desc: {
            title: '商品介绍',
            summary: $('.form-group.introduction>textarea').val(),
            body: $('.form-group.introduction>textarea').val()
          },
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
        // 编辑和添加的不同
        if (self.props.commodityId) {
          Meteor.call('commodity.update', Meteor.userId(), commodityInfo, self.props.commodityId, function(err, res){
            // TODO 回调结果反应
            if (err){
              swal("Failed!", "编辑商品信息失敗!.", "error");
            };
            if (res){
              swal({
                title: "Successful!",
                text: "Your commodity has been modified.",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#AEDEF4",
                closeOnConfirm: true
              }, function(){
                FlowRouter.go('commodities');
              })
            }
          });
        } else {
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
        }

        // steps插件在return false时,title的样式会有不同
        return true;
      }
    });

    // datepicker的绑定,要放在steps后,疑似steps改变了DOM结构,待考证
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      //language: 'en'
      // TODO 待解决 => 希望能够展示中文的月份等信息
      language: 'zh'
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
        <Pageheading root="首页" category="商品管理" title={this.props.commodityId ? "编辑商品" : "添加商品"}/>
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
            <CommodityModifyIntroduction desc={this.props.desc || {}}/>
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
