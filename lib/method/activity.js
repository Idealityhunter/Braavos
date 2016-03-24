/**
 * 定义活动相关的 method
 *
 * Created by lyn on 16/3/24.
 */

Meteor.methods({
  // 编辑专区
  'activity.column.edit': (columnId, columnInfo) => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    return collColumn.update({columnId: columnId}, {
      $set: columnInfo
    });
  },

  // 修改专区的状态
  'activity.column.update.status': (columnId, status) => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    return collColumn.update({columnId: columnId}, {
      $set: {
        status: status
      }
    });
  }
})
