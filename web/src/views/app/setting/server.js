import React from 'react';
import {
  Row,
  Card,
  CardBody,
  Input,
  CardTitle,
  FormGroup,
  Label,
  Button,
  Form,
} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import { NotificationManager } from '../../../components/common/react-notifications';
import axios from 'axios';

const onBotFormSubmit = (e) => {
  const data = new FormData(e.target);
  axios
    .post('/api/setting/update', JSON.stringify({
      name: 'interval',
      value: data.get('botInterval')
    }), {
      headers: {
        "Token": localStorage.getItem('token'),
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        createNotification('success', null, 'Updated!', res.data.message);
      }
    })
    .catch((error) => {
      createNotification('error', null, "Failed!", error.response.data.message);
    })
  axios
    .post('/api/setting/update', JSON.stringify({
      name: 'user-agent',
      value: data.get('allowedUserAgent')
    }), {
      headers: {
        "Token": localStorage.getItem('token'),
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        createNotification('success', null, 'Updated!', res.data.message);
      }
    })
    .catch((error) => {
      createNotification('error', null, "Failed!", error.response.data.message);
    })
  e.preventDefault();
}

const onSolverFormSubmit = (e) => {
  const data = new FormData(e.target);
  axios
    .post('/api/setting/update', JSON.stringify({
      name: 'api-key',
      value: data.get('apiKey')
    }), {
      headers: {
        "Token": localStorage.getItem('token'),
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        createNotification('success', null, 'Updated!', res.data.message);
      }
    })
    .catch((error) => {
      createNotification('error', null, "Failed!", error.response.data.message);
    })
  e.preventDefault();
}

const onAuthFormSubmit = (e) => {
  const data = new FormData(e.target);
  axios
    .post('/api/setting/update', JSON.stringify({
      name: 'password',
      value: data.get('password')
    }), {
      headers: {
        "Token": localStorage.getItem('token'),
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        createNotification('success', null, 'Updated!', res.data.message);
        window.location.reload(false);
      }
    })
    .catch((error) => {
      createNotification('error', null, "Failed!", error.response.data.message);
    })
  e.preventDefault();
}

const onSolverFormSubmit = (e) => {
  const data = new FormData(e.target);
  axios
    .post('/api/setting/update', JSON.stringify({
      name: 'ip',
      value: data.get('ip')
    }), {
      headers: {
        "Token": localStorage.getItem('token'),
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      if (res.data.code === 200) {
        createNotification('success', null, 'Updated!', res.data.message);
      }
    })
    .catch((error) => {
      createNotification('error', null, "Failed!", error.response.data.message);
    })
  e.preventDefault();
}

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

const ServerDefault = ({ match }) => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.setting.server" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="mb-4">
        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.bot-docking" />
              </CardTitle>
              <Form onSubmit={onBotFormSubmit}>
                <FormGroup>
                  <Label for="allowedUserAgent">
                    <IntlMessages id="forms.allowed-user-agent" />
                  </Label>
                  <Input
                    type="text"
                    name="allowedUserAgent"
                    id="allowedUserAgent"
                    placeholder="Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="botInterval">
                    <IntlMessages id="forms.bot-interval" />
                  </Label>
                  <Input
                    type="number"
                    name="botInterval"
                    id="botInterval"
                    placeholder="300"
                  />
                </FormGroup>

                <Button color="primary" className="mt-4">
                  <IntlMessages id="forms.update" />
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Colxx>

        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.captcha-solver" />
              </CardTitle>
              <Form onSubmit={onSolverFormSubmit}>
                <FormGroup>
                  <Label for="apiKey">
                    <IntlMessages id="forms.api-key" />
                  </Label>
                  <Input
                    type="text"
                    name="apiKey"
                    id="apiKey"
                    placeholder="YOUR_API_KEY"
                  />
                </FormGroup>

                <Button color="primary" className="mt-4">
                  <IntlMessages id="forms.update" />
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      <Row className="mb-4">
        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.password" />
              </CardTitle>
              <Form onSubmit={onAuthFormSubmit}>
                <FormGroup>
                  <Label for="password">
                    <IntlMessages id="forms.new-password" />
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="THIS_IS_LONGEST_PASSWORD"
                  />
                </FormGroup>

                <Button color="primary" className="mt-4">
                  <IntlMessages id="forms.update" />
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Colxx>

        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.server-ip" />
              </CardTitle>
              <Form onSubmit={onAuthFormSubmit}>
                <FormGroup>
                  <Label for="ip">
                    <IntlMessages id="forms.ip" />
                  </Label>
                  <Input
                    type="text"
                    name="ip"
                    id="ip"
                    placeholder="1.1.1.1"
                  />
                </FormGroup>

                <Button color="primary" className="mt-4">
                  <IntlMessages id="forms.update" />
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default ServerDefault;
