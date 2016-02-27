/**
 * 处理和用户相关的发布
 *
 * Created by zephyre on 2/27/16.
 */


/**
 * 发布指定的用户信息
 * userIds: [userId]
 */
Meteor.publish("userInfo", function (value) {
  // 获得userId列表
  const userIdList = [parseInt(this.userId)];
  const pushId = (value) => {
    if (_.isNumber(value) && !_.isNaN(value)) {
      userIdList.push(value);
    }
  };
  if (_.isArray(value)) {
    for (let v of value) {
      pushId(v);
    }
  } else {
    pushId(value);
  }

  BraavosCore.logger.debug(`Subscribing users: ${_.join(userIdList, ', ')}`);

  const coll = BraavosCore.Database.Yunkai.UserInfo;
  const allowedFields = ['nickName', 'gender', 'alias', 'userId', 'avatar', 'roles'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  return coll.find({userId: {$in: userIdList}}, {fields: fields});
});


/**
 * 发布商户信息
 */
Meteor.publish('sellerInfo', function (value) {
  // 获得userId列表
  const sellerIdList = [parseInt(this.userId)];
  const pushId = (value) => {
    if (_.isNumber(value) && !_.isNaN(value)) {
      sellerIdList.push(value);
    }
  };
  if (_.isArray(value)) {
    for (let v of value) {
      pushId(v);
    }
  } else {
    pushId(value);
  }

  BraavosCore.logger.debug(`Subscribing sellers: ${_.join(sellerIdList, ', ')}`);

  const coll = BraavosCore.Database.Braavos.Seller;
  const allowedFields = ['sellerId', 'desc', 'images', 'lang', 'serviceZone', 'services', 'name', 'address',
    'email', 'phone', 'balance', 'sales'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  return coll.find({sellerId: {$in: sellerIdList}}, {fields: fields});
});