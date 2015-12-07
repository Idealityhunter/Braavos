import {CommodityModifyBasic} from '/client/dumb-components/commodity/commodityModifyBasic';
import {CommodityModifyIntroduction} from '/client/dumb-components/commodity/commodityModifyIntroduction';
import {CommodityModifyInstruction} from '/client/dumb-components/commodity/commodityModifyInstruction';
import {CommodityModifyBook} from '/client/dumb-components/commodity/commodityModifyBook';
import {CommodityModifyTraffic} from '/client/dumb-components/commodity/commodityModifyTraffic';
import {Steps} from "/client/components/steps/steps";
import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';

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
    //$(".steps-container").steps({
    //  headerTag: "h3",
    //  bodyTag: "div",
    //  transitionEffect: "fade",
    //  autoFocus: true,
    //  enableCancelButton: false,
    //  enableKeyNavigation: false,
    //  labels: {
    //    finish: "完成",
    //    next: "下一步",
    //    previous: "上一步",
    //    cancel: '取消'
    //  },
    //  onStepChanging: function (event, currentIndex, newIndex) {
    //    if (currentIndex < newIndex) {
    //      // TODO 验证当前tab的必要信息是否填充完毕
    //      switch (currentIndex) {
    //        case 0:
    //        {
    //          // 名称,图片,时长和套餐是必须的
    //          //if (!$('.form-group.title>input').val()
    //          //  || $('.gallery-wrap').find('.img-wrap').children('img').length <= 0
    //          //  || !$('.form-group.cost-time>input').val()
    //          //  || self.state.plans.length <= 0){
    //          //  // TODO 弹窗提示?还是别的?
    //          //  return false;
    //          //}
    //          if (!$('.form-group.title>input').val()) {
    //            swal('请填写商品名称!', '', 'error');
    //            $('.form-group.title>input').addClass('error');
    //            return false;
    //          }
    //          ;
    //          if ($('.gallery-wrap').find('.img-wrap').children('img').length <= 0) {
    //            swal('请添加商品图片!', '', 'error');
    //            return false;
    //          }
    //          ;
    //          if (!$('.form-group.cost-time>input').val()) {
    //            swal('请填写游玩时长!', '', 'error');
    //            $('.form-group.cost-time>input').addClass('error');
    //            return false;
    //          }
    //          ;
    //          if (self.state.plans.length <= 0) {
    //            swal('请添加套餐信息!', '', 'error');
    //            return false;
    //          }
    //          ;
    //          break;
    //        }
    //          ;
    //        case 2:
    //        {
    //          // 费用包含和使用方法是必须的
    //          //if (!$('.form-group.charge-include>textarea').val() || !$('.form-group.usage>textarea').val()){
    //          //  // TODO 弹窗提示?还是别的?
    //          //  return false;
    //          //}
    //          if (!$('.form-group.charge-include>textarea').val()) {
    //            swal('请填写费用包含项目!', '', 'error');
    //            $('.form-group.charge-include>textarea').addClass('error');
    //            return false;
    //          }
    //          if (!$('.form-group.usage>textarea').val()) {
    //            swal('请填写商品使用方法!', '', 'error');
    //            $('.form-group.usage>textarea').addClass('error');
    //            return false;
    //          }
    //          break;
    //        }
    //          ;
    //        case 3:
    //        {
    //          // 预定和退改流程都是必须的
    //          //if (!$('.form-group.book>textarea').val() || !$('.form-group.unbook>textarea').val()){
    //          //  // TODO 弹窗提示?还是别的?
    //          //  return false;
    //          //}
    //          if (!$('.form-group.book>textarea').val()) {
    //            swal('请填写预订流程!', '', 'error');
    //            $('.form-group.book>textarea').addClass('error');
    //            return false;
    //          }
    //          if (!$('.form-group.unbook>textarea').val()) {
    //            swal('请填写退订和改订的相关规定!', '', 'error');
    //            $('.form-group.unbook>textarea').addClass('error');
    //            return false;
    //          }
    //          break;
    //        }
    //          ;
    //        default:
    //          return true;
    //      }
    //    }
    //    return true;
    //  },
    //  onFinishing: function (event, currentIndex) {
    //    if (self.submitLock)
    //      return;
    //    else
    //      self.submitLock = true;
    //    $('.submit-waiting').show();
    //    // TODO 验证和提交
    //    //$(".body:eq(" + newIndex + ") .error", form).removeClass("error")
    //
    //    // 当前若是在最后一页则无需检查,可以直接提交
    //    if (currentIndex < 4) {
    //      // 第一页的基本信息的检查
    //      if (!$('.form-group.title>input').val()) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请填写商品名称!', '', 'error');
    //        $('.form-group.title>input').addClass('error');
    //        return false;
    //      }
    //      if ($('.gallery-wrap').find('.img-wrap').children('img').length <= 0) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请添加商品图片!', '', 'error');
    //        return false;
    //      }
    //      if (!$('.form-group.cost-time>input').val()) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请填写游玩时长!', '', 'error');
    //        $('.form-group.cost-time>input').addClass('error');
    //        return false;
    //      }
    //      if (self.state.plans.length <= 0) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请添加套餐信息!', '', 'error');
    //        return false;
    //      }
    //
    //      // 第三页的购买须知的检查
    //      if (!$('.form-group.charge-include>textarea').val()) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请填写费用包含项目!', '', 'error');
    //        $('.form-group.charge-include>textarea').addClass('error');
    //        return false;
    //      }
    //      if (!$('.form-group.usage>textarea').val()) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请填写商品使用方法!', '', 'error');
    //        $('.form-group.usage>textarea').addClass('error');
    //        return false;
    //      }
    //
    //      // 第四页的预定退改流程的检查
    //      if (!$('.form-group.book>textarea').val()) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请填写预订流程!', '', 'error');
    //        $('.form-group.book>textarea').addClass('error');
    //        return false;
    //      }
    //      if (!$('.form-group.unbook>textarea').val()) {
    //        self.submitLock = false;
    //        $('.submit-waiting').hide();
    //        swal('请填写退订和改订的相关规定!', '', 'error');
    //        $('.form-group.unbook>textarea').addClass('error');
    //        return false;
    //      }
    //    }
    //    ;
    //
    //    // 获取填写的信息
    //    const priceInfo = _.reduce(self.state.plans, function (min, plan) {
    //      if (plan.price < min.price) {
    //        return {
    //          price: plan.price,
    //          marketPrice: plan.marketPrice
    //        };
    //      }
    //      ;
    //      return min;
    //    }, {
    //      price: Number.MAX_VALUE,
    //      marketPrice: Number.MAX_VALUE
    //    });
    //
    //    // 获取上传图片
    //    const imageList = $('.gallery-wrap').find('.img-wrap').children('img');
    //    let images = [];
    //    let cover = {};
    //    for (i = 0; i < imageList.length; i++) {
    //      if ($(imageList[i]).siblings('.fa-heart').length > 0)
    //        cover = {
    //          url: imageList[i].src.split('?')[0]//截取掉imageView等参数
    //        }
    //      images[i] = {
    //        url: imageList[i].src.split('?')[0]
    //      };
    //    }
    //    ;
    //
    //    // 获取country选中的option对应的值
    //    const countryIndex = $('.form-group.address>select.country-select').val();
    //    const countryZh = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).text();
    //    const countryEn = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).attr('data-en');
    //    const country = {
    //      className: 'com.lvxingpai.model.geo.Country',
    //      zhName: countryZh,
    //    };
    //    countryEn && _.extend(country, {enName: countryEn});
    //
    //    // 获取locality选中的option对应的值
    //    const localityIndex = $('.form-group.address>select.locality-select').val();
    //    const localityZh = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).text();
    //    const localityEn = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).attr('data-en');
    //    const locality = {
    //      className: 'com.lvxingpai.model.geo.Locality',
    //      zhName: localityZh
    //    };
    //    localityEn && _.extend(locality, {enName: localityEn});
    //
    //    // 获取category选中的option对应的值
    //    const categoryIndex = $('.form-group.category>select').val();
    //    const category = $($('.form-group.category>select>option')[parseInt(categoryIndex)]).text();
    //
    //    // 获取RichText
    //    const um = UM.getEditor('ueContainer');
    //    const desc = {
    //      title: '商品介绍',
    //      //summary: $('.form-group.introduction>textarea').val(),
    //      body: um.getContent()
    //    };
    //    // 截取summary, 保留所有空白符
    //    const tmp = document.createElement("DIV");
    //    tmp.innerHTML = desc.body;
    //    desc.summary = (tmp.textContent || tmp.innerText || "").substring(0, 100);
    //
    //    // tips: 现在timeRequired默认为true且不可修改
    //    //const timeRequired = $('.form-group.time-required').find('input').prop('checked');
    //    const timeRequired = true;
    //
    //    const commodityInfo = {
    //      title: $('.form-group.title>input').val(),
    //      country: country,
    //      locality: locality,
    //      address: $('.form-group.address>input').val(),
    //      category: [category],
    //      timeCost: $('.form-group.cost-time>input').val(),
    //      //stockInfo: $('.form-group.cost-time>input').val(),
    //      refundPolicy: [
    //        {
    //          // book
    //          title: '预定流程',
    //          summary: $('.form-group.book>textarea').val(),
    //          body: $('.form-group.book>textarea').val()
    //        },
    //        {
    //          // unbook
    //          title: '退改流程',
    //          summary: $('.form-group.unbook>textarea').val(),
    //          body: $('.form-group.unbook>textarea').val()
    //        }
    //      ],
    //      notice: [
    //        {
    //          // chargeInclude
    //          title: '费用包含',
    //          summary: $('.form-group.charge-include>textarea').val(),
    //          body: $('.form-group.charge-include>textarea').val()
    //        },
    //        {
    //          // chargeExcept
    //          title: '费用不含',
    //          summary: $('.form-group.charge-except>textarea').val(),
    //          body: $('.form-group.charge-except>textarea').val()
    //        },
    //        {
    //          // usage
    //          title: '使用方法',
    //          summary: $('.form-group.usage>textarea').val(),
    //          body: $('.form-group.usage>textarea').val()
    //        },
    //        {
    //          // attention
    //          title: '注意事项',
    //          summary: $('.form-group.attention>textarea').val(),
    //          body: $('.form-group.attention>textarea').val()
    //        }
    //      ],
    //      trafficInfo: [{
    //        title: '交通提示',
    //        summary: $('.form-group.traffic>textarea').val(),
    //        body: $('.form-group.traffic>textarea').val()
    //      }],
    //      desc: desc,
    //      price: priceInfo.price,
    //      marketPrice: priceInfo.marketPrice,
    //      plans: self.state.plans.map((plan) => {
    //        return {
    //          planId: plan.planId,
    //          price: plan.price,
    //          marketPrice: plan.marketPrice,
    //          pricing: (timeRequired) ? plan.pricing : [{
    //            price: plan.price,
    //            timeRange: []
    //          }],
    //          title: plan.title,
    //          timeRequired: timeRequired//暂时全部一样
    //        }
    //      }),
    //      cover: cover,
    //      images: images
    //    };
    //
    //    // 编辑和添加的不同
    //    if (self.props.commodityId) {
    //      Meteor.call('commodity.update', Meteor.userId(), commodityInfo, self.props.commodityId, function (err, res) {
    //        $('.submit-waiting').hide();
    //        // TODO 回调结果反应
    //        if (err) {
    //          self.submitLock = false;
    //          swal("编辑商品失敗!", "", "error");
    //          return;
    //        }
    //        ;
    //        if (res) {
    //          self.submitLock = false;
    //          swal({
    //            title: "成功编辑商品!",
    //            type: "success",
    //            showCancelButton: false,
    //            confirmButtonColor: "#AEDEF4",
    //            closeOnConfirm: true
    //          }, function () {
    //            FlowRouter.go('commodities');
    //          });
    //
    //          // 以免不点击swal导致不跳转
    //          setTimeout(FlowRouter.go('commodities'), 500);
    //
    //          return;
    //        }
    //        ;
    //      });
    //    } else {
    //      Meteor.call('commodity.insert', Meteor.userId(), commodityInfo, function (err, res) {
    //        $('.submit-waiting').hide();
    //        // TODO 回调结果反应
    //        if (err) {
    //          self.submitLock = false;
    //          swal("添加商品失敗!!", "", "error");
    //          return;
    //        }
    //        ;
    //        if (res) {
    //          self.submitLock = false;
    //          swal({
    //            title: "成功添加商品!",
    //            type: "success",
    //            showCancelButton: false,
    //            confirmButtonColor: "#AEDEF4",
    //            closeOnConfirm: true
    //          }, function () {
    //            FlowRouter.go('commodities');
    //          });
    //
    //          // 以免不点击swal导致不跳转
    //          setTimeout(FlowRouter.go('commodities'), 500);
    //          return;
    //        }
    //        ;
    //      });
    //    }
    //
    //    // steps插件在return false时,title的样式会有不同
    //    // return true;
    //    // return false;
    //  }
    //});

    // datepicker的绑定,要放在steps后,疑似steps改变了DOM结构,待考证
    //$('.commodity-basic-datepicker .input-daterange').datepicker({
    //  language: 'zh',
    //  format: 'yyyy-mm-dd',
    //  keyboardNavigation: false,
    //  forceParse: false,
    //  autoclose: true,
    //  //language: 'en'
    //  // TODO 待解决 => 希望能够展示中文的月份等信息
    //});
  },

  handleChildSubmitState(plans){
    this.setState({
      plans: plans
    });
  },

  styles: {
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

  // 判断index页面是否填写正确
  _validateCurrent(currentIndex) {
    // TODO 验证当前tab的必要信息是否填充完毕
    switch (currentIndex) {
      case 0:
      {
        // 名称,图片,时长和套餐是必须的s
        if (!$('.form-group.title>input').val()) {
          swal('请填写商品名称!', '', 'error');
          $('.form-group.title>input').addClass('error');
          return false;
        }
        if ($('.gallery-wrap').find('.img-wrap').children('img').length <= 0) {
          swal('请添加商品图片!', '', 'error');
          return false;
        }
        if (!$('.form-group.cost-time>input').val()) {
          swal('请填写游玩时长!', '', 'error');
          $('.form-group.cost-time>input').addClass('error');
          return false;
        }
        if (this.state.plans.length <= 0) {
          swal('请添加套餐信息!', '', 'error');
          return false;
        }
        break;
      }
      case 2:
      {
        // 费用包含和使用方法是必须的
        if (!$('.form-group.charge-include>textarea').val()) {
          swal('请填写费用包含项目!', '', 'error');
          $('.form-group.charge-include>textarea').addClass('error');
          return false;
        }
        if (!$('.form-group.usage>textarea').val()) {
          swal('请填写商品使用方法!', '', 'error');
          $('.form-group.usage>textarea').addClass('error');
          return false;
        }
        break;
      }
      case 3:
      {
        // 预定和退改流程都是必须的
        if (!$('.form-group.book>textarea').val()) {
          swal('请填写预订流程!', '', 'error');
          $('.form-group.book>textarea').addClass('error');
          return false;
        }
        if (!$('.form-group.unbook>textarea').val()) {
          swal('请填写退订和改订的相关规定!', '', 'error');
          $('.form-group.unbook>textarea').addClass('error');
          return false;
        }
        break;
      }
      default:
        break;
    }
    return true;
  },

  willNextStep(current) {
    const result = this._validateCurrent(current);
    return result ? "allow" : "error";
  },

  willPreviousStep(current) {
    const result = this._validateCurrent(current);
    return result ? "allow" : "error";
  },

  willGoStep(current, target) {
    const result = this._validateCurrent(current);
    return result ? "allow" : "error";
  },

  willFinish(current){
    // 加锁 => 禁止连续点击完成
    if (this.submitLock)
      return;
    else
      this.submitLock = true;

    // loading等待动画
    $('.submit-waiting').show();

    // TODO error的样式应该加在error的tab上面
    let valid = true;
    for (let i = 0;i < 5;i++){
      // 验证错误的处理
      if (!this._validateCurrent(i)){
        // 解锁
        this.submitLock = false;
        $('.submit-waiting').hide();

        if (current == i){
          return 'error';
        } else {
          // TODO 第i项应该为error状态
          return 'allow';
        }
      }
    };

    // 获取填写的信息
    const priceInfo = _.reduce(this.state.plans, function (min, plan) {
      if (plan.price < min.price) {
        return {
          price: plan.price,
          marketPrice: plan.marketPrice
        };
      }
      ;
      return min;
    }, {
      price: Number.MAX_VALUE,
      marketPrice: Number.MAX_VALUE
    });

    // 获取上传图片
    const imageList = $('.gallery-wrap').find('.img-wrap').children('img');
    let images = [];
    let cover = {};
    for (i = 0; i < imageList.length; i++) {
      if ($(imageList[i]).siblings('.fa-heart').length > 0)
        cover = {
          url: imageList[i].src.split('?')[0]//截取掉imageView等参数
        }
      images[i] = {
        url: imageList[i].src.split('?')[0]
      };
    }
    ;

    // 获取country选中的option对应的值
    const countryIndex = $('.form-group.address>select.country-select').val();
    const countryZh = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).text();
    const countryEn = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).attr('data-en');
    const countryId = $($('.form-group.address>select.country-select>option')[parseInt(countryIndex)]).attr('data-id');
    const country = {
      _id: new Meteor.Collection.ObjectID(countryId),
      className: 'com.lvxingpai.model.geo.Country',
      zhName: countryZh,
    };
    countryEn && _.extend(country, {enName: countryEn});

    // 获取locality选中的option对应的值
    const localityIndex = $('.form-group.address>select.locality-select').val();
    const localityZh = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).text();
    const localityEn = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).attr('data-en');
    const localityId = $($('.form-group.address>select.locality-select>option')[parseInt(localityIndex)]).attr('data-id');
    const locality = {
      _id: new Meteor.Collection.ObjectID(localityId),
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
      plans: this.state.plans.map((plan) => {
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
      images: images
    };

    // locality不为空时才添加
    !!locality.zhName && (commodityInfo['locality'] = locality);

    // 编辑和添加的不同
    if (this.props.commodityId) {
      const self = this;
      Meteor.call('commodity.update', this.props.seller.sellerId, commodityInfo, this.props.commodityId, function (err, res) {
        // 解锁
        self.submitLock = false;
        $('.submit-waiting').hide();

        // TODO 回调结果反应
        if (err || res == 0) {
          swal("编辑商品失敗!", "", "error");
          return;
        }
        if (res) {
          swal({
            title: "成功编辑商品!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#AEDEF4",
            closeOnConfirm: true
          }, function () {
            FlowRouter.go('commodities');
          });

          // 以免不点击swal导致不跳转
          setTimeout(FlowRouter.go('commodities'), 500);

          return true;
        }
      });
    } else {
      const self = this;
      Meteor.call('commodity.insert', Meteor.userId(), commodityInfo, function (err, res) {
        // 解锁
        self.submitLock = false;
        $('.submit-waiting').hide();

        // TODO 回调结果反应
        if (err) {
          swal("添加商品失敗!!", "", "error");
          return;
        }
        if (res) {
          swal({
            title: "成功添加商品!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#AEDEF4",
            closeOnConfirm: true
          }, function () {
            FlowRouter.go('commodities');
          });

          // 以免不点击swal导致不跳转
          setTimeout(FlowRouter.go('commodities'), 500);
          return true;
        }
      });
    }
  },

  render() {
    const prefix = 'commodities.modify.';

    const basicStep =
      <div className="basic">
        <CommodityModifyBasic
          handleChildSubmitState={this.handleChildSubmitState}
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
      </div>;

    const introductionStep =
      <div className="introduction">
        <CommodityModifyIntroduction desc={this.props.desc || {}}/>
      </div>;

    const instructionStep =
      <div className="instruction">
        <CommodityModifyInstruction notice={this.props.notice || []}/>
      </div>;

    const bookStep =
      <div className="book">
        <CommodityModifyBook refundPolicy={this.props.refundPolicy || []}/>
      </div>;

    const trafficStep =
      <div className="traffic">
        <CommodityModifyTraffic trafficInfo={this.props.trafficInfo || []}/>
      </div>;

    const submitLoading =
      <div className="submit-waiting" style={{display: 'none'}}>
        <div className="shadow-layer" style={this.styles.shadowLayer}></div>
        <div className="loading-board" style={this.styles.loadingBoard}>
          <div className="loading-label" style={this.styles.loadingLabel}>正在提交中，请稍候...</div>
          <div className="sk-spinner sk-spinner-wave" style={this.styles.spinnerGroup}>
            <div className="sk-rect1" style={this.styles.spinnerItem}></div>
            <div className="sk-rect2" style={this.styles.spinnerItem}></div>
            <div className="sk-rect3" style={this.styles.spinnerItem}></div>
            <div className="sk-rect4" style={this.styles.spinnerItem}></div>
            <div className="sk-rect5" style={this.styles.spinnerItem}></div>
          </div>
        </div>
      </div>;
    return (
      <div className="commodity-modify-wrap">
        <BraavosBreadcrumb />
        <br/>
        <Steps steps={[
          {title: this.getIntlMessage(prefix + 'basic'), body: basicStep},
          {title: this.getIntlMessage(prefix + 'introduction'), body: introductionStep},
          {title: this.getIntlMessage(prefix + 'instruction'), body: instructionStep},
          {title: this.getIntlMessage(prefix + 'book'), body: bookStep},
          {title: this.getIntlMessage(prefix + 'traffic'), body: trafficStep}
          ]} willNextStep={this.willNextStep} willPreviousStep={this.willPreviousStep} willGoStep={this.willGoStep} willFinish={this.willFinish}/>
        {submitLoading}
        <br/>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
