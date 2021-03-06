import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import {AUTH_LOGIN} from "../../actions";
import {Link, Redirect} from "react-router-dom";
import {translate} from "react-i18next";
import {Button, Form, Header} from "semantic-ui-react";
import FormField from "../ui/form-field";

import {required} from '../../helpers/validation';
import ErrorMessage from "../ui/error-message";


class Login extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: AUTH_LOGIN,
        data: values,
        resolve,
        reject
      });
    }).catch((error) => {
      throw new SubmissionError({
        ...error.errors,
        _error: error.errors.nonFieldErrors[0] || undefined
      });
    })
  };

  render() {
    const {t, auth, handleSubmit, pristine, submitting, error} = this.props;
    const {from} = this.props.location.state || {from: {pathname: '/'}};
    if (auth.authenticated) {
      return (
        <Redirect to={from}/>
      )
    }
    const urlParams = new URLSearchParams(this.props.location.search);
    const confirmed = urlParams.get('confirmed');

    return (
      <Fragment>
        <Header as='h2'>{t('authentication.title')}</Header>
        {confirmed &&
        <p>{t('registration.confirmEmail.emailConfirmed')}</p>
        }
        <Form onSubmit={handleSubmit(this.submit)} noValidate>
          <Field
            required={true}
            name='username'
            type='text'
            component={FormField}
            as={Form.Input}
            validate={required}
            label={t('authentication.form.username')}
            placeholder='Username'/>

          <Field
            required={true}
            name='password'
            type='password'
            component={FormField}
            as={Form.Input}
            validate={required}
            label={t('authentication.form.password')}
            placeholder='Password'/>

          {error &&
          <ErrorMessage message={error}/>
          }

          <Button
            positive
            loading={submitting}
            disabled={pristine || submitting}>
            {t('authentication.buttons.login')}
          </Button>

          <Button as={Link} to='/forgot-password'>
            {t('authentication.buttons.forgotPassword')}
          </Button>

          {!confirmed &&
          <Button positive as={Link} to='/register'>
            {t('authentication.buttons.register')}
          </Button>
          }

        </Form>
      </Fragment>
    );
  }
}

const mapStateToProps = ({auth}) => ({auth});
const loginForm = reduxForm({form: 'loginForm'})(Login);
export default connect(mapStateToProps)(translate()(loginForm));

