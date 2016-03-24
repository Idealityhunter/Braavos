/**
 * 活动相关的 method
 * Created by lyn on 16/3/24.
 */

Meteor.methods({
  'activity.column.getColumnInfo': columnId => {
    const id = parseInt(columnId);
    const collColumn = BraavosCore.Database.Braavos.Column;

    const columnInfo = collColumn.findOne({columnId: id});
    return (columnInfo)
      ? {
        valid: true,
        columnInfo: columnInfo
      }
      : {
        valid: false
      }
  },

  // 生成 columnId
  'activity.column.generateColumnId': () => {
    const client = BraavosCore.Thrift.IdGen.client;
    try {
      const result = client.generate('column');
      if (result.statusCode == 200 && result.data && result.data.id) {
        console.log(result.data);
        return result.data.id
      } else {
        BraavosCore.logger(`Generate columnId failed!`);
        BraavosCore.logger(result);
        return undefined;
      }
    } catch (err) {
      BraavosCore.logger(`Generate columnId failed!`);
      BraavosCore.logger(err);
      return undefined;
    }
  },

  'activity.column.create': columnInfo => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    const columnId = Meteor.call('activity.column.generateColumnId');
    return collColumn.insert(_.extend(columnInfo, {columnId: columnId, columnType: 'special', status: 'pub'}));
  }
})