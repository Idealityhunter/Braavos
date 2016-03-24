/**
 * 活动相关的 schema
 *
 * Created by lyn on 16/3/24.
 */

const Activity = CoreModel.Activity = {};
const Misc = CoreModel.Misc;

Activity.column = new SimpleSchema({
  // 专区分类: slide 是首页的 banner 专区; special 是首页下面的专区
  columnType: {
    type: String,
    allowedValues: ['slide', 'special']
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
  }
})