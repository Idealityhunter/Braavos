/**
 * 财务管理页面
 *
 * Created by zephyre on 1/31/16.
 */

import {
  connect, Provider, applyMiddleware, thunkMiddleware, createLogger
} from '/lib/redux'
import {Immutable} from '/lib/immutable'
import {store} from '/client/redux/store'

import {Input, Button, Alert} from '/lib/react-bootstrap'
import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';

import {Overview} from '/client/components/finance/overview'
import {TransactionTable} from '/client/components/finance/transactionTable'

const mapStateToProps = (state) => {
  return {
    value: state.getIn(['components', 'finance'], Immutable.fromJS({}))
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const Container = connect(mapStateToProps, mapDispatchToProps)(
  React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
      const sellerId = (() => {
        const v = parseInt(Meteor.userId());
        return (_.isNumber(v) && !_.isNaN(v)) ? v : undefined;
      })();

      // 订阅资金流水记录
      Meteor.subscribe('transactionLog');

      // 自身的商家属性
      const seller = BraavosCore.Database.Braavos.Seller.findOne({sellerId});

      // 资金流水记录
      const transactions = BraavosCore.Database.Braavos.TransactionLog
        .find({sellerId}, {sort: {timestamp: 1}}).fetch();

      return {seller, transactions};
    },

    render() {
      return (
        <div>
          <BraavosBreadcrumb />
          <div className="animated fadeInRight">
            <Overview seller={this.data.seller}/>
          </div>
          <div className="form-horizontal">
            <div className="form-group">
            </div>
          </div>
          <div className="animated fadeInRight">
            <TransactionTable transactions={this.data.transactions}/>
          </div>
        </div>
      );
    }
  })
);

export const Finance = () => <Provider store={store}><Container /></Provider>;
