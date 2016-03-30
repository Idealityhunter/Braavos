/**
 * 活动相关的 schema
 *
 * Created by lyn on 16/3/24.
 */

const Activity = CoreModel.Activity = {};
const Misc = CoreModel.Misc;

// 专区 schema
Activity.Column = new SimpleSchema({
  // 专区分类: slide 是首页的 banner 专区; special 是首页下面的专区; locality 是目的地页面的专区
  columnType: {
    type: String,
    allowedValues: ['slide', 'special', 'locality']
  },

  // 专区ID / 活动编号
  columnId: {
    type: Number
  },

  // 专区名称
  title: {
    type: Number
  },

  // 专区的封面图
  images: {
    type: [Misc.Image]
  },

  // 专区的banner图
  banner: {
    type: Misc.Image
  },

  // 专区的等级 => 以此作为排序的依据
  rank: {
    type: Number
  },

  // 专区中包含的商品
  commodities: {
    type: [Number]
  },

  // pub 表示在线上的活动, disabled 表示已撤销的活动
  status: {
    type: String,
    allowedValues: ['pub', 'disabled']
  },

  // 专区的介绍
  desc: {
    type: String,
    //max: 500
  },

  // 活动创建时间
  createTime: {
    type: Date
  },

  // 活动最后一次修改时间
  updateTime: {
    type: Date,
    optional: true
  },

  // 专区归属地的国家信息,只有 type 为 locality 时才需要
  country: {
    type: CoreModel.Geo.Country,
    optional: true,
    blackbox: true
  },

  // 专区归属地的目的地信息
  locality: {
    type: CoreModel.Geo.Locality,
    optional: true,
    blackbox: true
  }
});


// 城市文章 schema
Activity.Article = new SimpleSchema({
  // 标题
  title: {
    type: String
  },

  // 简介
  desc: {
    type: String
  },

  // 富文本内容
  content: {
    type: String
  },

  // pub 表示已上线, disabled 表示已撤销
  status: {
    type: String,
    allowedValues: ['pub', 'disabled']
  },

  // 文章创建时间
  createTime: {
    type: Date
  },

  // 文章最后一次修改时间
  updateTime: {
    type: Date,
    optional: true
  },

  // 文章归属地的国家信息
  country: {
    type: CoreModel.Geo.Country,
    optional: true,
    blackbox: true
  },

  // 文章归属地的目的地信息
  locality: {
    type: CoreModel.Geo.Locality,
    optional: true,
    blackbox: true
  }
})