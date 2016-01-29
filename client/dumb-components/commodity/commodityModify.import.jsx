import {CommodityModifyBasic} from '/client/dumb-components/commodity/commodityModifyBasic';
import {CommodityModifyIntroduction} from '/client/dumb-components/commodity/commodityModifyIntroduction';
import {CommodityModifyInstruction} from '/client/dumb-components/commodity/commodityModifyInstruction';
import {CommodityModifyBook} from '/client/dumb-components/commodity/commodityModifyBook';
import {CommodityModifyTraffic} from '/client/dumb-components/commodity/commodityModifyTraffic';
import {Steps} from "/client/components/steps/steps";
import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {PageLoading} from '/client/common/pageLoading';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityModify = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],
  proptypes: {
    title: React.PropTypes.String,
    cover: React.PropTypes.Object,
    images: React.PropTypes.Array,
    category: React.PropTypes.Array,
    country: React.PropTypes.Object,
    locality: React.PropTypes.Object,
    address: React.PropTypes.String,
    timeCost: React.PropTypes.String,
    plans: React.PropTypes.Array,
    marketPrice: React.PropTypes.Number,
    price: React.PropTypes.Number,
    desc: React.PropTypes.Object,
    notice: React.PropTypes.Array,
    refundPolicy: React.PropTypes.Array,
    trafficInfo: React.PropTypes.Array
  },

  // 控制'完成'动作
  submitLock: false,

  getInitialState(){
    return {
      plans: this.props.commodityInfo && this.props.commodityInfo.plans || [],
      images: this.props.commodityInfo && this.props.commodityInfo.images || [],
      cover: this.props.commodityInfo && this.props.commodityInfo.cover || ''
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

  // 添加图片
  _handleAddImage(image){
    let copyImages = this.state.images.slice();
    if (copyImages.length == 0){
      this.setState({
        cover: image
      });
    };

    copyImages.push(image);
    this.setState({
      images: copyImages
    });
  },

  // 修改主图
  _handleChangeCover(imageIndex){
    // TODO 假如有两张一模一样的image在images,然后后一张被选为主图,则会出错
    this.setState({
      cover: this.state.images[imageIndex]
    })
  },

  // 删除图片
  _handleDeleteImage(imageIndex){
    let copyImages = this.state.images.slice();

    // 当为主图时的逻辑
    if (_.isEqual(copyImages[imageIndex], this.state.cover)) {
      if (copyImages.length > 1){
        if (imageIndex != 0){
          this.setState({
            cover: copyImages[0]
          });
        } else{
          this.setState({
            cover: copyImages[1]
          });
        }
      }else{
        // 只有一张图时,cover也置空
        this.setState({
          cover: {}
        })
      }
    }

    copyImages.splice(imageIndex, 1);
    this.setState({
      images: copyImages
    })
  },

  // 提交套餐信息的修改
  handleChildSubmitState(plans){
    this.setState({
      plans: plans
    });
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
    $('.page-loading-wrap').removeClass('hidden');

    // TODO error的样式应该加在error的tab上面
    let valid = true;
    for (let i = 0;i < 5;i++){
      // 验证错误的处理
      if (!this._validateCurrent(i)){
        // 解锁
        this.submitLock = false;
        $('.page-loading-wrap').addClass('hidden');

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


    // 调整images的顺序 => 将cover抽离出来,放在第一张
    const copyImages = this.state.images.slice();
    const coverIndex = _.findIndex(copyImages, image => _.isEqual(image, this.state.cover));
    copyImages.splice(coverIndex, 1);
    const images = [this.state.cover].concat(copyImages);

    // tips: 现在timeRequired默认为true且不可修改
    //const timeRequired = $('.form-group.time-required').find('input').prop('checked');
    const timeRequired = true;

    const modCommodityInfo = {
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
      price: parseInt(priceInfo.price * 100),
      marketPrice: parseInt(priceInfo.marketPrice * 100),
      plans: this.state.plans.map((plan) => {
        return {
          planId: plan.planId,
          price: parseInt(plan.price * 100),
          marketPrice: parseInt(plan.marketPrice * 100),
          pricing: (timeRequired)
            ? plan.pricing.map(pricing => _.extend(pricing, {
              price: parseInt(pricing.price * 100)
            }))
            : [{
              price: parseInt(plan.price * 100),
              timeRange: []
            }],
          title: plan.title,
          timeRequired: timeRequired//暂时全部一样
        }
      }),
      cover: this.state.cover,
      images: images
    };

    // locality不为空时才添加
    !!locality.zhName && (modCommodityInfo['locality'] = locality);

    // 获取未被修改的数据
    const restCommodityInfo = this.props.commodityInfo && _.omit(this.props.commodityInfo, Object.keys(modCommodityInfo)) || {};

    // 编辑和添加的不同
    if (this.props.commodityInfo) {
      const self = this;
      Meteor.call('commodity.update', modCommodityInfo, restCommodityInfo, function (err, res) {
        // 解锁
        self.submitLock = false;
        $('.page-loading-wrap').addClass('hidden');

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
          Meteor.setTimeout(() => FlowRouter.go('commodities'), 500);

          return true;
        }
      });
    } else {
      const self = this;
      Meteor.call('commodity.insert', modCommodityInfo, function (err, res) {
        // 解锁
        self.submitLock = false;
        $('.page-loading-wrap').addClass('hidden');

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
          Meteor.setTimeout(() => FlowRouter.go('commodities'), 500);
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
          addImage={this._handleAddImage}
          changeCover={this._handleChangeCover}
          deleteImage={this._handleDeleteImage}
          handleChildSubmitState={this.handleChildSubmitState}
          cover={this.state.cover || ''}
          images={this.state.images || []}
          title={this.props.commodityInfo && this.props.commodityInfo.title || []}
          category={this.props.commodityInfo && this.props.commodityInfo.category || []}
          country={this.props.commodityInfo && this.props.commodityInfo.country || {}}
          locality={this.props.commodityInfo && this.props.commodityInfo.locality || {}}
          address={this.props.commodityInfo && this.props.commodityInfo.address || ''}
          timeCost={this.props.commodityInfo && this.props.commodityInfo.timeCost || ''}
          plans={this.props.commodityInfo && this.props.commodityInfo.plans || []}
          price={this.props.commodityInfo && this.props.commodityInfo.price || ''}
          marketPrice={this.props.commodityInfo && this.props.commodityInfo.marketPrice || ''}
        />
      </div>;

    const introductionStep =
      <div className="introduction">
        <CommodityModifyIntroduction desc={this.props.commodityInfo && this.props.commodityInfo.desc || {}}/>
      </div>;

    const instructionStep =
      <div className="instruction">
        <CommodityModifyInstruction notice={this.props.commodityInfo && this.props.commodityInfo.notice || []}/>
      </div>;

    const bookStep =
      <div className="book">
        <CommodityModifyBook refundPolicy={this.props.commodityInfo && this.props.commodityInfo.refundPolicy || []}/>
      </div>;

    const trafficStep =
      <div className="traffic">
        <CommodityModifyTraffic trafficInfo={this.props.commodityInfo && this.props.commodityInfo.trafficInfo || []}/>
      </div>;

    return (
      <div className="commodity-modify-wrap">
        <BraavosBreadcrumb />
        <br/>
        <Steps steps={[
          {title: this.getIntlMessage(`${prefix}basic`), body: basicStep},
          {title: this.getIntlMessage(`${prefix}introduction`), body: introductionStep},
          {title: this.getIntlMessage(`${prefix}instruction`), body: instructionStep},
          {title: this.getIntlMessage(`${prefix}book`), body: bookStep},
          {title: this.getIntlMessage(`${prefix}traffic`), body: trafficStep}
          ]} willNextStep={this.willNextStep} willPreviousStep={this.willPreviousStep} willGoStep={this.willGoStep} willFinish={this.willFinish}/>
        <br/>
        <PageLoading labelText='正在提交中，请稍候...' alpha={1}/>
      </div>
    );
  }
});

export const CommodityModify = commodityModify;
