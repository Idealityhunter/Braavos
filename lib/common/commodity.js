/**
 * 和商品相关的公共函数
 *
 * Created by zephyre on 2/1/16.
 */

/**
 * 根据filter, 获得MongoDB的查询条件
 *
 * @param filters
 * @param isAdmin 是否要以admin的身份来查询数据
 * @param userId 以什么用户的身份来查询数据
 */
const buildCommodityQuery = (filters, isAdmin, userId) => {
  const logger = BraavosCore.logger;
  logger.debug(`Building MongoDB query for: ${JSON.stringify(filters, null, 4)}`);
  logger.debug(`userId: ${userId}`);

  // 创建查询条件
  const query = {};

  // 假如带有admin标志
  if (isAdmin) {
    if (Meteor.isServer) {
      // 在服务端, 需要检查是否真的是admin
      const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: userId});

      if (!userInfo || _.indexOf(userInfo.roles || [], 10) == -1) {
        isAdmin = false;
      }
    }
  }
  if (!isAdmin) {
    query['seller.sellerId'] = userId;
  }

  const searchWord = (filters.query || '').trim();
  if (searchWord) {
    // 是否为数字
    const v = parseFloat(searchWord);
    if (_.isInteger(v) && v.toString() == searchWord) {
      // 可能是商品编号, 也可能是商户编号
      if (isAdmin) {
        query.$or = [{commodityId: v}, {'seller.sellerId': v}];
      } else {
        query.commodityId = v;
      }
    } else {
      // 说明这是商品名称
      query.title = {$regex: searchWord, $options: 'i'};
    }
  }

  // 商品状态
  const commodityStatus = filters.commodityStatus;
  switch (commodityStatus) {
    case 'review':
      query.status = 'review';
      break;
    case 'disabled':
      query.status = 'disabled';
      break;
    case 'pub':
      query.status = 'pub';
      break;
    default:
      break;
  }

  logger.debug(`Successfully built MongoDB query: ${JSON.stringify(query, null, 4)}`);
  return query;
};

// 将其挂在到server端的BraavosCore.Utils下面
BraavosCore.Utils.buildCommodityQuery = buildCommodityQuery;
