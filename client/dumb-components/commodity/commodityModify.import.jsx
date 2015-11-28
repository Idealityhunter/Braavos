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
  submitLock: false,
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
      enableKeyNavigation: false,
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
              //if (!$('.form-group.title>input').val()
              //  || $('.gallery-wrap').find('.img-wrap').children('img').length <= 0
              //  || !$('.form-group.cost-time>input').val()
              //  || self.state.plans.length <= 0){
              //  // TODO 弹窗提示?还是别的?
              //  return false;
              //}
              if (!$('.form-group.title>input').val()){
                swal('请填写商品名称!', '', 'error');
                $('.form-group.title>input').addClass('error');
                return false;
              };
              if ($('.gallery-wrap').find('.img-wrap').children('img').length <= 0){
                swal('请添加商品图片!', '', 'error');
                return false;
              };
              if (!$('.form-group.cost-time>input').val()){
                swal('请填写游玩时长!', '', 'error');
                $('.form-group.cost-time>input').addClass('error');
                return false;
              };
              if (self.state.plans.length <= 0){
                swal('请添加套餐信息!', '', 'error');
                return false;
              };
              break;
            };
            case 2: {
              // 费用包含和使用方法是必须的
              //if (!$('.form-group.charge-include>textarea').val() || !$('.form-group.usage>textarea').val()){
              //  // TODO 弹窗提示?还是别的?
              //  return false;
              //}
              if (!$('.form-group.charge-include>textarea').val()){
                swal('请填写费用包含项目!', '', 'error');
                $('.form-group.charge-include>textarea').addClass('error');
                return false;
              }
              if (!$('.form-group.usage>textarea').val()){
                swal('请填写商品使用方法!', '', 'error');
                $('.form-group.usage>textarea').addClass('error');
                return false;
              }
              break;
            };
            case 3: {
              // 预定和退改流程都是必须的
              //if (!$('.form-group.book>textarea').val() || !$('.form-group.unbook>textarea').val()){
              //  // TODO 弹窗提示?还是别的?
              //  return false;
              //}
              if (!$('.form-group.book>textarea').val()){
                swal('请填写预订流程!', '', 'error');
                $('.form-group.book>textarea').addClass('error');
                return false;
              }
              if (!$('.form-group.unbook>textarea').val()){
                swal('请填写退订和改订的相关规定!', '', 'error');
                $('.form-group.unbook>textarea').addClass('error');
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
        if (self.submitLock)
          return;
        else
          self.submitLock = true;
        $('.submit-waiting').show();
        // TODO 验证和提交
        //$(".body:eq(" + newIndex + ") .error", form).removeClass("error")

        // 当前若是在最后一页则无需检查,可以直接提交
        if (currentIndex < 4){
          // 在其它的页面的提交需要做检查

          // 第一页的基本信息的检查
          //if (!$('.form-group.title>input').val()
          //  || $('.gallery-wrap').find('.img-wrap').children('img').length <= 0
          //  || !$('.form-group.cost-time>input').val()
          //  || self.state.plans.length <= 0){
          //  $(".steps>ul>li:eq(0)").addClass("error");
          //  location.hash = "steps-uid-0-t-0";
          //  if (currentIndex != 0)
          //    return true;
          //  else{
          //    $('.submit-waiting').hide();
          //    return false;
          //  }
          //};
          if (!$('.form-group.title>input').val()){
            $('.submit-waiting').hide();
            swal('请填写商品名称!', '', 'error');
            $('.form-group.title>input').addClass('error');
            return false;
          };
          if ($('.gallery-wrap').find('.img-wrap').children('img').length <= 0){
            $('.submit-waiting').hide();
            swal('请添加商品图片!', '', 'error');
            return false;
          };
          if (!$('.form-group.cost-time>input').val()){
            $('.submit-waiting').hide();
            swal('请填写游玩时长!', '', 'error');
            $('.form-group.cost-time>input').addClass('error');
            return false;
          };
          if (self.state.plans.length <= 0){
            $('.submit-waiting').hide();
            swal('请添加套餐信息!', '', 'error');
            return false;
          };

          // 第三页的购买须知的检查
          //if (!$('.form-group.charge-include>textarea').val() || !$('.form-group.usage>textarea').val()){
          //  // TODO 弹窗提示?还是别的?
          //  //$(".steps>ul>li:eq(2)").addClass("error");
          //  //location.hash = "steps-uid-0-t-2";
          //  return false;
          //};
          if (!$('.form-group.charge-include>textarea').val()){
            $('.submit-waiting').hide();
            swal('请填写费用包含项目!', '', 'error');
            $('.form-group.charge-include>textarea').addClass('error');
            return false;
          }
          if (!$('.form-group.usage>textarea').val()){
            $('.submit-waiting').hide();
            swal('请填写商品使用方法!', '', 'error');
            $('.form-group.usage>textarea').addClass('error');
            return false;
          }

          // 第四页的预定退改流程的检查
          //if (!$('.form-group.book>textarea').val() || !$('.form-group.unbook>textarea').val()){
          //  // TODO 弹窗提示?还是别的?
          //  //$(".steps>ul>li:eq(3)").addClass("error");
          //  //location.hash = "steps-uid-0-t-3";
          //  return false;
          //};
          if (!$('.form-group.book>textarea').val()){
            $('.submit-waiting').hide();
            swal('请填写预订流程!', '', 'error');
            $('.form-group.book>textarea').addClass('error');
            return false;
          }
          if (!$('.form-group.unbook>textarea').val()){
            $('.submit-waiting').hide();
            swal('请填写退订和改订的相关规定!', '', 'error');
            $('.form-group.unbook>textarea').addClass('error');
            return false;
          }
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
        const countryIndex = $('.form-group.address>select.country-select').val();
        const countryZh = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).text();
        const countryEn = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).attr('data-en');
        const country = {
          className: 'com.lvxingpai.model.geo.Country',
          zhName: countryZh,
        };
        countryEn && _.extend(country, {enName: countryEn});

        // 获取locality选中的option对应的值
        const localityIndex = $('.form-group.address>select.locality-select').val();
        const localityZh = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).text();
        const localityEn = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).attr('data-en');
        const locality = {
          className: 'com.lvxingpai.model.geo.Locality',
          zhName: localityZh
        };
        localityEn && _.extend(locality, {enName: localityEn});

        // 获取category选中的option对应的值
        const categoryIndex = $('.form-group.category>select').val();
        const category = $($('.form-group.category>select>option')[parseInt(categoryIndex)]).text();

        // 获取RichText
        const um = UM.getEditor('ueContainer');
        const desc = {
          title: '商品介绍',
          //summary: $('.form-group.introduction>textarea').val(),
          body: um.getContent()
        };
        // 截取summary, 保留所有空白符
        const tmp = document.createElement("DIV");
        tmp.innerHTML = desc.body;
        desc.summary = (tmp.textContent || tmp.innerText || "").substring(0, 100);

        // tips: 现在timeRequired默认为true且不可修改
        //const timeRequired = $('.form-group.time-required').find('input').prop('checked');
        const timeRequired = true;

        const commodityInfo = {
          title: $('.form-group.title>input').val(),
          country: country,
          locality: locality,
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
          desc: desc,
          price: priceInfo.price,
          marketPrice: priceInfo.marketPrice,
          plans: self.state.plans.map((plan) => {
            return {
              planId: plan.planId,
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

        // 编辑和添加的不同
        if (self.props.commodityId) {
          Meteor.call('commodity.update', Meteor.userId(), commodityInfo, self.props.commodityId, function(err, res){
            $('.submit-waiting').hide();
            // TODO 回调结果反应
            if (err){
              swal("编辑商品失敗!", "", "error");
            };
            if (res){
              swal({
                title: "成功编辑商品!",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#AEDEF4",
                closeOnConfirm: true
              }, function(){
                FlowRouter.go('commodities');
              })
            };
            // 以免不点击swal导致不跳转
            setTimeout(FlowRouter.go('commodities'), 500);
          });
        } else {
          Meteor.call('commodity.insert', Meteor.userId(), commodityInfo, function(err, res){
            $('.submit-waiting').hide();
            // TODO 回调结果反应
            if (err){
              swal("添加商品失敗!!", "", "error");
            };
            if (res){
              swal({
                title: "成功添加商品!",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#AEDEF4",
                closeOnConfirm: true
              }, function(){
                FlowRouter.go('commodities');
              })
            };
            // 以免不点击swal导致不跳转
            setTimeout(FlowRouter.go('commodities'), 500);
          });
        }

        // steps插件在return false时,title的样式会有不同
        // return true;
        // return false;
      }
    });

    // 初始化desc页面的um插件
    UM.delEditor('ueContainer');
    const um = UM.getEditor('ueContainer');
    um.ready(function(){
      //设置编辑器的内容
      um.setContent((self.props.desc && self.props.desc.body) ? self.props.desc.body : '');
    });

    // datepicker的绑定,要放在steps后,疑似steps改变了DOM结构,待考证
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      language: 'zh',
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      //language: 'en'
      // TODO 待解决 => 希望能够展示中文的月份等信息
    });
  },

  handleChildSubmitState(plans){
    this.setState({
      plans: plans
    });
    return ;
  },

  styles:{
    shadowLayer: {
      opacity: 1.04,
      display: 'block',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 10000
    },
    loadingBoard: {
      display: 'block',
      backgroundColor: 'rgba(255,255,255,.7)',
      width: 220,
      marginTop: -57,
      marginLeft: -130,
      backgroundColor: 'white',
      fontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: 20,
      borderRadius: 5,
      textAlign: 'center',
      position: 'fixed',
      left: '50%',
      top: '50%',
      overflow: 'hidden',
      zIndex: 99999
    },
    loadingLabel: {
      paddingBottom: 15
    },
    spinnerGroup: {
      height: 60,
      width: 70
    },
    spinnerItem: {
      margin: '0 3px'
    }
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
              locality={this.props.locality || {}}
              address={this.props.address || ''}
              timeCost={this.props.timeCost || ''}
              plans={this.props.plans || []}
              price={this.props.price || ''}
              marketPrice={this.props.marketPrice || ''}
            />
          </div>
          <div className="introduction">
            <CommodityModifyIntroduction/>
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
        <div className="submit-waiting" style={{display: 'none'}}>
          <div className="shadow-layer" style={this.styles.shadowLayer}></div>
          <div className="loading-board" style={this.styles.loadingBoard}>
            <div class="loading-label" style={this.styles.loadingLabel}>正在提交中，请稍候...</div>
            <div className="sk-spinner sk-spinner-wave" style={this.styles.spinnerGroup}>
              <div className="sk-rect1" style={this.styles.spinnerItem}></div>
              <div className="sk-rect2" style={this.styles.spinnerItem}></div>
              <div className="sk-rect3" style={this.styles.spinnerItem}></div>
              <div className="sk-rect4" style={this.styles.spinnerItem}></div>
              <div className="sk-rect5" style={this.styles.spinnerItem}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
