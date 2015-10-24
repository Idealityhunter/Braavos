import {Breadcrumb} from 'client/dumb-components/common/breadcrumb';
import {AccountBasic} from 'client/dumb-components/account/account-basic';
import {AccountFinance} from 'client/dumb-components/account/account-finance';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var account = React.createClass({
  mixins: [IntlMixin],

  render() {
    const prefix = 'accountInfo.';
    const intlData = _.pick(this.props, 'locales', 'messages', 'format');
    return (
      <div className="account-info-wrap">
        <Breadcrumb />
        <div className="tabs-container">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#tab-1"><FormattedMessage message={this.getIntlMessage(prefix + 'basic')}/></a></li>
            <li><a data-toggle="tab" href="#tab-2"><FormattedMessage message={this.getIntlMessage(prefix + 'finance')} /></a></li>
            <li><a data-toggle="tab" href="#tab-3"><FormattedMessage message={this.getIntlMessage(prefix + 'password')} /></a></li>
          </ul>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <div className="panel-body">
                <AccountBasic {...intlData} />
              </div>
            </div>
            <div id="tab-2" className="tab-pane">
              <div className="panel-body">
                <AccountFinance />
              </div>
            </div>
            <div id="tab-3" className="tab-pane">
              <div className="panel-body">
                <strong>Donec quam felis</strong>

                <p>Thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects
                  and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath </p>

                <p>I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite
                  sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const Account = account;
