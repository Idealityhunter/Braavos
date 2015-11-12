/**
 *
 * Created by zephyre on 11/12/15.
 */

Meteor.methods({
  // 上传
  "qiniu.uploadAvatar": function(data, hash) {
    const qiniu = BraavosCore.Qiniu;
    const plainData = data.replace(/^data:image\/(png|jpg);base64,/, "");
    const rawData = new Buffer(plainData, "base64");
    // 获得文件名
    const key = `avatar/${hash}`;
    const bucket = BraavosCore.RootConf.braavos.qiniu.avatarBucket;

    // 获得上传token
    const putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${key}`);
    const token = putPolicy.token();

    const extra = new qiniu.io.PutExtra();
    extra.mimeType = "image/png";

    const wrapUpload = Async.wrap(qiniu.io.put);

    return wrapUpload(token, key, rawData, extra);
  }
});
