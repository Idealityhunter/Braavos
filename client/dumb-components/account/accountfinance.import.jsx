var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let accountFinance = React.createClass({
  mixins: [IntlMixin],
  handleClick (){
    // TODO delete the bank account
  },
  render() {
    return (
      <div className="account-finance-wrap">
        <h4>银行卡</h4>
        <ul className="bank-account-list">
          <li>
            <div className="bank-name">渣打银行</div>
            <div className="bank-account">2134 5217 3971 1</div>
            <div className="bank-ID">Lucy</div>
            <a className="delete" href="javascript:void(0)" onclick={this.handleClick}>删除</a>
          </li>
          <li>
            <div className="bank-name">渣打银行</div>
            <div className="bank-account">2134 5217 3971 1</div>
            <div className="bank-ID">Lucy</div>
            <a className="delete" href="javascript:void(0)" onclick={this.handleClick}>删除</a>
          </li>
          <li>
            <div className="bank-name">渣打银行</div>
            <div className="bank-account">2134 5217 3971 1</div>
            <div className="bank-ID">Lucy</div>
            <a className="delete" href="javascript:void(0)" onclick={this.handleClick}>删除</a>
          </li>
        </ul>
        <div className="bank-select-frame">
          <div className="plus">+</div>
          <a href="javascript:void(0)">添加银行卡</a>
        </div>
      </div>
    )
  }
});

export const AccountFinance = accountFinance;
