var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let commodityModifyBook = React.createClass({
  mixins: [IntlMixin],
  styles: {
    asterisk: {
      color: 'coral',
      verticalAlign: 'text-top',
      paddingLeft: 5,
      fontsize: 18
    }
  },

  placeholders: {
    book: '请输入预定流程',
    unbook: '请输入退订或改订的相关规定'
  },

  _handleClearErrorClass(e){
    $(e.target).removeClass('error');
  },

  render() {
    return (
      <div className="commodity-book-wrap">
        <form className="form-horizontal">
          <div className="form-group book">
            <label className="">预定流程<span style={this.styles.asterisk}>*</span></label>
            <textarea className="form-control placeholder" rows="3"
                      placeholder={this.placeholders.book}
                      defaultValue={(this.props.refundPolicy.length > 0) ? this.props.refundPolicy[0].body : ''}
                      onChange={this._handleClearErrorClass}
            />
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group unbook">
            <label className="">退改规定<span style={this.styles.asterisk}>*</span></label>
            <textarea className="form-control placeholder" rows="3"
                      placeholder={this.placeholders.unbook}
                      defaultValue={(this.props.refundPolicy.length > 0) ? this.props.refundPolicy[1].body : ''}
                      onChange={this._handleClearErrorClass}
            />
          </div>
        </form>
      </div>
    );
  }
});

export const CommodityModifyBook = commodityModifyBook;