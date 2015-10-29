var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

class accountSecurity extends React.Component {
  render (){
    return (
      <form className="form-horizontal account-security-wrap">
        <label>修改密码</label>
        <div className='account-password-wrap'>
          <div className="form-group">
            <label className="label-text">原密码</label>
            <input className="inline" type='password' placeholder="请输入原密码"/>
          </div>
          <div className="form-group">
            <label className="label-text">新密码</label>
            <input className="inline" type='password' placeholder="请输入新密码"/>
          </div>
          <div className="form-group">
            <label className="label-text">确认新密码</label>
            <input className="inline" type='password' placeholder="请再次输入新密码"/>
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>保存</button>
      </form>
    )
  }
};

export const AccountSecurity = accountSecurity;
