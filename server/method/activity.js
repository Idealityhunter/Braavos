/**
 * 活动相关的 method
 * Created by lyn on 16/3/24.
 */

Meteor.methods({
  // 获取专区的详细信息
  'activity.column.getColumnInfo': columnId => {
    const id = parseInt(columnId);
    const collColumn = BraavosCore.Database.Braavos.Column;

    const columnInfo = collColumn.findOne({columnId: id});
    return (columnInfo)
      ? {
        columnInfo,
        valid: true
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

  // 创建新专区
  'activity.column.create': columnInfo => {
    const collColumn = BraavosCore.Database.Braavos.Column;
    const columnId = Meteor.call('activity.column.generateColumnId');
    return collColumn.insert({
      ...columnInfo,
      columnId: columnId,
      createTime: new Date(),
      status: 'pub'
    });
  },

  // 获取城市文章的详细信息
  'activity.article.getArticleInfo': articleId => {
    const id = parseInt(articleId);
    const collArticle = BraavosCore.Database.Braavos.LocalityArticle;

    const articleInfo = collArticle.findOne({articleId: id});
    return (articleInfo)
      ? {
        articleInfo,
        valid: true
      }
        : {
        valid: false
      }
  },

  // 生成 articleId
  'activity.article.generateArticleId': () => {
    const client = BraavosCore.Thrift.IdGen.client;
    try {
      const result = client.generate('article');
      if (result.statusCode == 200 && result.data && result.data.id) {
        return result.data.id
      } else {
        BraavosCore.logger(`Generate articleId failed!`);
        BraavosCore.logger(result);
        return undefined;
      }
    } catch (err) {
      BraavosCore.logger(`Generate articleId failed!`);
      BraavosCore.logger(err);
      return undefined;
    }
  },

  // 创建新的城市文章
  'activity.article.create': articleInfo => {
    const collArticle = BraavosCore.Database.Braavos.LocalityArticle;
    const articleId = Meteor.call('activity.article.generateArticleId');
    return collArticle.insert({
      ...articleInfo,
      articleId: articleId,
      createTime: new Date(),
      status: 'pub'
    });
  },

})