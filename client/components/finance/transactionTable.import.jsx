/**
 * 资金流水
 *
 * Created by zephyre on 2/27/16.
 */


import {Table} from '/lib/react-bootstrap'

/**
 * 单条资金流水
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
const Transaction = (props) => {
  const transaction = props.transaction;

  const date = moment(transaction.timestamp).format('YYYY-MM-DD HH:mm:ss');

  const func = (value) => {
    const v = value / 100.0;
    return v >= 0 ? `¥${v}` : `-¥${-v}`;
  };
  const amount = func(transaction.amount);
  const balance = func(transaction.balance);

  const contents = (() => {
    switch (transaction.type) {
      case 'orderIncome':
        // 订单交易
        return (() => {
          const orderId = transaction.details.orderId;
          return `完成订单。订单编号：${orderId}`;
        })();
      case 'orderRedeem':
        // 订单退款
        return (() => {
          const orderId = transaction.details.orderId;
          return `订单已退款。订单编号：${orderId}`;
        })();
      case 'withdrawal':
        return '商户提现';
      case 'misc':
        return `其它`;
      default:
        return '';
    }
  })();
  const memo = transaction.memo || '';

  return (
    <tr>
      <td>{props.id}</td>
      <td>{date}</td>
      <td>{amount}</td>
      <td>{contents}</td>
      <td>{memo}</td>
      <td>{balance}</td>
    </tr>
  );
};

/**
 * 资金流水表格
 * @param props
 * @returns {XML}
 * @constructor
 */
export const TransactionTable = (props) => {
  // 资金流水
  const t = props.transactions;
  // 序号
  const ids = _.range(1, t.length + 1);

  const transactions = _.map(_.zip(t, ids), ([transaction, id]) => {
    return <Transaction id={id} transaction={transaction} key={transaction._id}/>;
  });
  return (
    <div style={{
      backgroundColor: 'aliceblue',
      padding: '5px 15px 10px',
      border: '1px solid #ddd',
      margin: '20px 10px 0'
    }}>
      <Table>
        <thead>
        <tr>
          <th>#</th>
          <th>日期</th>
          <th>金额</th>
          <th>内容</th>
          <th>备注</th>
          <th>账户余额</th>
        </tr>
        </thead>
        <tbody>
        {transactions}
        </tbody>
      </Table>
    </div>
  );
};
