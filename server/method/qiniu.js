/**
 *
 * Created by zephyre on 11/12/15.
 */

/**
 * 生成七牛上传的token
 * @param bucketKey
 * @param key
 * @param options
 * @returns {{token, key: *, url: *}}
 */
function getUploadToken(bucketKey, key, options) {
  const qiniu = BraavosCore.Qiniu;
  const {name: name, domain: domain} = BraavosCore.RootConf.braavos.qiniu.buckets[bucketKey];

  const returnBody = '{' +
    '"key": $(key),' +
    '"name": $(fname),' +
    '"size": $(fsize),' +
    '"w": $(imageInfo.width),' +
    '"h": $(imageInfo.height),' +
    '"fmt": $(imageInfo.format),' +
    '"cm": $(imageInfo.colorModel),' +
    '"hash": $(etag)' +
    '}';
  const putPolicy = new qiniu.rs.PutPolicy(`${name}:${key}`, undefined, undefined, undefined, returnBody);
  _.extend(putPolicy, options || {});
  putPolicy.insertOnly = 1;
  const token = putPolicy.token();

  return {
    token: token,
    key: key,
    url: `http://${domain}/${key}`
  }
}

Meteor.methods({
  // Deprecated 上传
  //"qiniu.uploadAvatar": function(data, bucketName, prefix) {
  //
  //  // TODO hash should be calculated from the raw data (binary format)
  //  const crypto = Npm.require('crypto');
  //  const hash = crypto.createHash('md5').update(data, 'utf5').digest('hex').toString();
  //
  //  // TODO pass the following arguments: prefix / bucket
  //  const qiniu = BraavosCore.Qiniu;
  //  const plainData = data.replace(/^data:image\/(png|jpg);base64,/, "");
  //  const rawData = new Buffer(plainData, "base64");
  //
  //  // 获得文件名
  //  const key = `${prefix || ""}${hash}`;
  //  const {name: name, domain: domain} = BraavosCore.RootConf.braavos.qiniu.buckets[bucketName];
  //
  //  // 获得上传token
  //  const putPolicy = new qiniu.rs.PutPolicy(`${name}:${key}`);
  //  const token = putPolicy.token();
  //
  //  const extra = new qiniu.io.PutExtra();
  //  extra.mimeType = "image/png";
  //
  //  // TODO qiniu.io.put返回值中, 有ret和err. 在ret里面需要返回完整的url
  //
  //  const wrapUpload = Async.wrap(qiniu.io.put);
  //  // TODO 获取wrapUpload的结果,并返回给client端
  //
  //  return wrapUpload(token, key, rawData, extra);
  //},

  /**
   *
   * @param key
   //* @param data datauri的形式
   * @param bucketKey 存放在哪个bucket中. 对应于braavis.qiniu.buckets中的一个key
   //* @param prefix 上传图像的key的前缀
   * @param options
   * @returns {{token, key: *, url: *}}
   */
  "qiniu.getUploadToken": function (bucketKey, key, options) {
    return getUploadToken(bucketKey, key, options);
  }
});
