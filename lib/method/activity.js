/**
 * 定义活动相关的 method
 *
 * Created by lyn on 16/3/24.
 */

Meteor.methods({
  // 编辑专区
  'activity.column.edit': (columnId, columnInfo) => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    return collColumn.update({columnId}, {
      $set: {
        ...columnInfo,
        updateTime: new Date()
      }
    });
  },

  // 修改专区的状态
  'activity.column.update.status': (columnId, status) => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    return collColumn.update({columnId}, {$set: {status}});
  },

  // 删除专区
  'activity.column.delete': columnId => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    return collColumn.remove({columnId});
  },

  // 编辑城市文章
  'activity.article.edit': (articleId, articleInfo) => {
    const collArticle = BraavosCore.Database.Braavos.LocalityArticle;
    return collArticle.update({articleId}, {
      $set: {
        ...articleInfo,
        updateTime: new Date()
      }
    });
  },

  // 修改城市文章的状态
  'activity.article.update.status': (articleId, status) => {
    const collArticle = BraavosCore.Database.Braavos.LocalityArticle;
    return collArticle.update({articleId}, {$set: {status}});
  },

  // 删除城市文章
  'activity.article.delete': articleId => {
    const collArticle = BraavosCore.Database.Braavos.LocalityArticle;
    return collArticle.remove({articleId});
  }
})
