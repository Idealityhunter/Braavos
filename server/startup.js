/**
 * 服务端的启动代码
 * Created by zephyre on 10/22/15.
 */

/**
 * 获得etcd的数据
 */
const resolveEtcdData = () => {
  const url = `${process.env['ETCD_HOST']}:${process.env['ETCD_PORT']}`;

  const services = new EtcdHelper.EtcdServiceBuilder(url)
    .addEntry(['mongo-dev', 'mongo'])
    .addEntry('yunkai')
    .addEntry('smscenter')
    .addEntry(['hedy-base', 'hedy'])
    .addEntry(['hedy-dev', 'hedy'])
    .build();
  const config = new EtcdHelper.EtcdConfigBuilder(url).addEntry('braavos').build();
  BraavosCore.RootConf = _.extend(services, config);
};

/**
 * 处理和MongoDB相关的设置, 比如MONGO_URL等
 */
const buildMongoConf = () => {
  const conf = BraavosCore.RootConf.braavos;
  const services = BraavosCore.RootConf.backends['mongo'];

  const {db, user, password, replicaSet, readPreference} = conf['mongo'];
  const servers = Object.getOwnPropertyNames(services).map(key=> {
    const {host, port} = services[key];
    return `${host}:${port}`;
  }).join(',');

  const options = {readPreference: readPreference || 'primaryPreferred', authSource: db};
  if (replicaSet) {
    options.replicaSet = replicaSet;
  }
  const optionsStr = Object.getOwnPropertyNames(options).map(key=>`${key}=${options[key]}`).join('&');

  BraavosCore.Database.Braavos = {
    url: `mongodb://${user}:${password}@${servers}/${db}?${optionsStr}`
  };
};

/**
 * 初始化集合
 */
const initColl = () => {
  const Braavos = BraavosCore.Database.Braavos;
  const Schema = BraavosCore.Schema;
  Braavos.Collections = {};
  const Collections = Braavos.Collections;

  const driver = new MongoInternals.RemoteCollectionDriver(Braavos.url);

  // 注册的
  const RegisterToken = new Mongo.Collection('RegisterToken', {_driver: driver});
  RegisterToken.attachSchema(Schema.RegisterToken);
  Collections.RegisterToken = RegisterToken;
};

Meteor.startup(()=> {
  console.log('Server startup');

  // 获取etcd设置
  resolveEtcdData();

  // 数据库设置
  buildMongoConf();
  initColl();
});
