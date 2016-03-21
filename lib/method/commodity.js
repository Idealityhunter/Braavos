
// 验证是否仍有可预约时间(今天或以后是否仍然可以预约)
const validateDate = commodityInfo => {
  // 获取所有套餐中的所有pricing中的所有截止日期
  const plans = commodityInfo.plans;
  const endDates = _.reduce(plans, (endDates, plan) => {
    const pricings = plan.pricing;
    return endDates.concat(_.reduce(pricings, (endDates, pricing) => {
      // 此处要求 timeRange 必须为闭区间(即 timeRange[1] 必须存在)
      return endDates.concat(pricing.timeRange[1])
    }, []));
  }, []);

  // 获取 endDates 中最大值
  const lastDate = _.maxBy(endDates, endDate => (new Date(endDate)).getTime());

  // 判断今天是否仍小于可预约时间的最大值
  const nowDate = Date.now();
  if (nowDate > ((new Date(lastDate)).getTime() + 1000 * 60 * 60 * 24)){
    // 因为 endDate 是一个封闭区间,所以应该在此加上一天后再判断
    return false;
  }

  return true;
}

Meteor.methods({
  // 修改商品狀態
  'commodity.status.update': function (commodityId, status) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    return collCommodity.update({'commodityId': commodityId}, {$set: {'status': status}});
  },

  // 检查商品是否满足上架条件
  'commodity.check.publish': function(commodityId){
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    const commodityInfo = collCommodity.findOne({commodityId: commodityId});

    // 检查时间是否满足条件(是否有可预订的时间)
    if (!validateDate(commodityInfo)){
      return {
        status: false,
        errorCode: 'Invalid Date'
      }
    };

    return {status: true};
  }
});

