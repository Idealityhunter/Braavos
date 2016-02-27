/**
 * 账户资金总览
 *
 * Created by zephyre on 2/27/16.
 */

import {Input, Button, Alert} from '/lib/react-bootstrap'

const styles = {
  calendar: {
    marginLeft: -20,
    marginTop: 11,
    verticalAlign: 'top'
  },
  datepickerInput: {
    height: 35,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  btnGroup: {
    marginTop: 25,
    marginRight: 30,
    float: 'right'
  },
  amount: {
    fontSize: 20
  },
  statistic: {
    backgroundColor: 'aliceblue',
    padding: '5px 15px 10px',
    border: '1px solid #ddd',
    margin: '20px 10px 0'
  },
  marginLeft: {
    marginLeft: 30
  },
  hr: {
    borderColor: '#ddd'
  },
  marginRight: {
    marginRight: 30
  },
  label: {
    marginRight: 20,
    marginBottom: 10
  }
};

/**
 * 财务总览
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export const Overview = (props) => {
  const seller = (props.seller || {});
  // 账户余额
  const balance = seller.balance || 0;
  // 交易总额
  const sales = seller.sales || 0;

  return (
    <div style={styles.statistic}>
      <h2>账户总览</h2>
      <hr style={{borderColor: '#ddd'}}/>
      <div style={{maxWidth: 600}}>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              账户余额：
            </label>
            <label className="col-xs-3 col-sm-2 col-md-1 control-label">
              {`¥${balance / 100.0}`}
            </label>
            <div className="col-xs-3 col-sm-2 col-md-2">
              <Button bsSize="small" bsStyle="success">申请提现</Button>
            </div>
          </div>
        </div>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-xs-4 col-sm-3 col-md-2 control-label">
              销售额：
            </label>
            <label className="col-xs-3 col-sm-2 col-md-1 control-label">
              {`¥${sales / 100.0}`}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
