import {Breadcrumb} from '/client/dumb-components/common/breadcrumb';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var finance = React.createClass({
  mixins: [IntlMixin],

  componentDidMount () {
    //$("#form").steps();
    $("#form").steps({
      bodyTag: "fieldset",
      onStepChanging: function (event, currentIndex, newIndex)
      {
        // Always allow going backward even if the current step contains invalid fields!
        if (currentIndex > newIndex)
        {
          return true;
        }

        // Forbid suppressing "Warning" step if the user is to young
        if (newIndex === 3 && Number($("#age").val()) < 18)
        {
          return false;
        }

        var form = $(this);

        // Clean up if user went backward before
        if (currentIndex < newIndex)
        {
          // To remove error styles
          $(".body:eq(" + newIndex + ") label.error", form).remove();
          $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
        }

        // Disable validation on fields that are disabled or hidden.
        form.validate().settings.ignore = ":disabled,:hidden";

        // Start validation; Prevent going forward if false
        return form.valid();
      },
      onStepChanged: function (event, currentIndex, priorIndex)
      {
        // Suppress (skip) "Warning" step if the user is old enough.
        if (currentIndex === 2 && Number($("#age").val()) >= 18)
        {
          $(this).steps("next");
        }

        // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
        if (currentIndex === 2 && priorIndex === 3)
        {
          $(this).steps("previous");
        }
      },
      onFinishing: function (event, currentIndex)
      {
        var form = $(this);

        // Disable validation on fields that are disabled.
        // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
        form.validate().settings.ignore = ":disabled";

        // Start validation; Prevent form submission if false
        return form.valid();
      },
      onFinished: function (event, currentIndex)
      {
        var form = $(this);

        // Submit form input
        form.submit();
      }
    }).validate({
      errorPlacement: function (error, element)
      {
        element.before(error);
      },
      rules: {
        confirm: {
          equalTo: "#password"
        }
      }
    });
  },
  render() {
    return (
      <div className="finance-mngm-wrap">
        <Breadcrumb />
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Wizard with Validation</h5>
                  {/*{>iboxTools}*/}
                </div>
                <div className="ibox-content">
                  <h2>
                    Validation Wizard Form
                  </h2>
                  <p>
                    This example show how to use Steps with jQuery Validation plugin.
                  </p>

                  <form id="form" action="#" className="wizard-big">
                    <h1>Account</h1>
                    <fieldset>
                      <h2>Account Information</h2>
                      <div className="row">
                        <div className="col-lg-8">
                          <div className="form-group">
                            <label>Username *</label>
                            <input id="userName" name="userName" type="text" className="form-control required"/>
                          </div>
                          <div className="form-group">
                            <label>Password *</label>
                            <input id="password" name="password" type="text" className="form-control required"/>
                          </div>
                          <div className="form-group">
                            <label>Confirm Password *</label>
                            <input id="confirm" name="confirm" type="text" className="form-control required"/>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="text-center">
                            <div style={{marginTop: '20px'}}>
                              <i className="fa fa-sign-in" style={{fontSize: '180px', color: '#e5e5e5'}}></i>
                            </div>
                          </div>
                        </div>
                      </div>

                    </fieldset>
                    <h1>Profile</h1>
                    <fieldset>
                      <h2>Profile Information</h2>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label>First name *</label>
                            <input id="name" name="name" type="text" className="form-control required"/>
                          </div>
                          <div className="form-group">
                            <label>Last name *</label>
                            <input id="surname" name="surname" type="text" className="form-control required"/>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label>Email *</label>
                            <input id="email" name="email" type="text" className="form-control required email"/>
                          </div>
                          <div className="form-group">
                            <label>Address *</label>
                            <input id="address" name="address" type="text" className="form-control"/>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <h1>Warning</h1>
                    <fieldset>
                      <div className="text-center" style={{marginTop: '120px'}}>
                        <h2>You did it Man :-)</h2>
                      </div>
                    </fieldset>

                    <h1>Finish</h1>
                    <fieldset>
                      <h2>Terms and Conditions</h2>
                      <input id="acceptTerms" name="acceptTerms" type="checkbox" className="required"/>
                      <label for="acceptTerms">I agree with the Terms and Conditions.</label>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
});

export const Finance = finance;

