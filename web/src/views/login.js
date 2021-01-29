import React, { useEffect } from 'react';
import {
  Row,
  Card,
  Input,
  FormGroup,
  Label,
  Button,
  Form,
} from 'reactstrap';
import { Colxx } from '../components/common/CustomBootstrap';
import IntlMessages from '../helpers/IntlMessages';
import { NotificationManager } from '../components/common/react-notifications';
import CardBody from 'reactstrap/lib/CardBody';
import { Redirect } from 'react-router-dom';
import axios from "axios";

const createNotification = (type, className, title, content) => {
  const cName = className || '';
  switch (type) {
    case 'primary':
      NotificationManager.primary(
        content,
        title,
        3000,
        null,
        null,
        cName
      );
      break;
    case 'secondary':
      NotificationManager.secondary(
        content,
        title,
        3000,
        null,
        null,
        cName
      );
      break;
    case 'info':
      NotificationManager.info('Info message', '', 3000, null, null, cName);
      break;
    case 'success':
      NotificationManager.success(
        content,
        title,
        3000,
        null,
        null,
        cName
      );
      break;
    case 'warning':
      NotificationManager.warning(
        content,
        title,
        3000,
        null,
        null,
        cName
      );
      break;
    case 'error':
      NotificationManager.error(
        content,
        title,
        5000,
        () => {
          alert('callback');
        },
        null,
        cName
      );
      break;
    default:
      NotificationManager.info('Info message');
      break;
  }
};

const Login = ({ authed, changeAuthed }) => {
  useEffect(() => {
    document.body.classList.add('background');
    document.body.classList.add('no-footer');

    return () => {
      document.body.classList.remove('background');
      document.body.classList.remove('no-footer');
    };
  }, []);

  if (authed) {
    return <Redirect to="/x" />
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const password = data.get('password');
    axios
    .post('/api/user/login',  JSON.stringify({
      password: password
    }), {
      headers: {
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        changeAuthed(true);
        localStorage.setItem('token', res.data.message);
        createNotification('success', null, "Redirecting...", 'Login successful!');
        return <Redirect to="/x" />
      }
    })
    .catch((err) => {
      console.log(err);
      createNotification('error', null, "Failed!", 'Wrong password...');
    });
  }

  return (
    <>
      <main>
        <div className="container">
          <Row className="h-100">
            <Colxx xxs="12" md="4" className="mx-auto my-auto">
              <Card className="auth-card">
                <CardBody>
                  <Form onSubmit={onFormSubmit}>
                    <FormGroup>
                      <Label for="password">
                        <IntlMessages id="forms.password" />
                      </Label>
                      <Input
                        required
                        type="password"
                        name="password"
                        id="password"
                        placeholder=""
                      />
                    </FormGroup>

                    <Button color="primary" className="btn btn-primary btn-shadow btn-lg">
                      <IntlMessages id="forms.login" />
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Colxx>
          </Row>
        </div>
      </main>
    </>
  );
};

export default Login;
