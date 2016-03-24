/**
 * 发布活动相关的数据
 *
 * Created by lyn on 16/3/24.
 */

//Meteor.publish('activity.column.bulk', function (filters, {isAdmin, limit, sorting, ...kwargs}) {
Meteor.publish('activity.column.bulk', function ({columnType, limit, ...kwargs}) {
  const collColumn = BraavosCore.Database.Braavos.Column;

  // TODO limit 待支持
  return collColumn.find({columnType: columnType})
})
