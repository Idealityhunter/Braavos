/**
 * 财务相关的发布
 *
 * Created by zephyre on 2/27/16.
 */


/**
 * 发布资金流水记录
 */
Meteor.publish('transactionLog', function () {
  const sellerId = (() => {
    const v = parseInt(this.userId);
    return _.isNumber(v) && !_.isNaN(v) ? v : undefined;
  })();

  if (sellerId) {
    BraavosCore.logger.debug(`Subscribing transaction logs of seller ${sellerId}`);

    const coll = BraavosCore.Database.Braavos.TransactionLog;
    return coll.find({sellerId});
  }
});
