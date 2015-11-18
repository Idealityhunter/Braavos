/**
 *
 * Created by zephyre on 11/12/15.
 */

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

  "qiniu.uploadImage": function(data, bucketName, prefix) {
    const crypto = Npm.require('crypto');
    const hash = crypto.createHash('md5').update(data, 'utf5').digest('hex').toString();
    const key = `${prefix || ""}${hash}`;

    const qiniu = BraavosCore.Qiniu;
    const {name: name, domain: domain} = BraavosCore.RootConf.braavos.qiniu.buckets[bucketName];

    // TODO BUG: 获得上传token => 然而并没有起作用
    const returnBody = '{' +
      '"name": $(fname),' +
      '"size": $(fsize),' +
      '"w": $(imageInfo.width),' +
      '"h": $(imageInfo.height),' +
      '"fmt": $(imageInfo.format),' +
      '"cm": $(imageInfo.colorModel),' +
      '"hash": $(etag)' +
      '}';
    const putPolicy = new qiniu.rs.PutPolicy(`${name}:${key}`, undefined, undefined, undefined, returnBody);
    const token = putPolicy.token();

    return {
      token: token,
      key : key,
      url : `http://${domain}/${key}`
    }
  }
});
