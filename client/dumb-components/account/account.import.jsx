import {AccountBasic} from '/client/dumb-components/account/account-basic';
import {AccountFinance} from '/client/dumb-components/account/account-finance';
import {AccountSecurity} from '/client/dumb-components/account/account-security';
import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var account = React.createClass({
  mixins: [IntlMixin],

  render() {
    const prefix = 'accountInfo.';
    const intlData = _.pick(this.props, 'locales', 'messages', 'format');
    return (
      <div className="account-info-wrap">
        <BraavosBreadcrumb/>
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#tab-1"><FormattedMessage
              message={this.getIntlMessage(prefix + 'basic')}/></a></li>
            <li><a data-toggle="tab" href="#tab-3"><FormattedMessage
              message={this.getIntlMessage(prefix + 'security')}/></a></li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="panel-body">
                <AccountBasic {...intlData} />
              </div>
            </div>
            <div id="tab-3" className="tab-pane">
              <div className="panel-body">
                <AccountSecurity />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const Account = account;
