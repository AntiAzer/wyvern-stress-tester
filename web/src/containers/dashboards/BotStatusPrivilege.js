import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from '../../helpers/IntlMessages';
import { ThemeColors } from '../../helpers/ThemeColors';

import { PolarAreaChart } from '../../components/charts';

import axios from 'axios';

const colors = ThemeColors();

const BotStatusPrivilege = ({ chartClass = 'chart-container' }) => {
  const [ firstData, setFirstData ] = useState(0);
  const [ secondData, setSecondData ] = useState(0);
  useEffect(() => {
    const update = () => {
      axios
      .get('/api/status/bot?type=privilege', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setFirstData(res.data.value.split('/')[1]);
          setSecondData(res.data.value.split('/')[0]);
        }
        setTimeout(update, 5000);
      })
      .catch(() => {
        setTimeout(update, 5000);
      })
    }
    update();
  }, []);
  const polarAreaChartData = {
    labels: ['Administrator', 'User'],
    datasets: [
      {
        data: [firstData, secondData],
        borderWidth: 2,
        borderColor: [colors.themeColor1, colors.themeColor2],
        backgroundColor: [
          colors.themeColor1_10,
          colors.themeColor2_10,
        ],
      },
    ],
  };
  return (
    <Card className="dashboard-donut-card">
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.bot-privilege" />
        </CardTitle>
        <div className={chartClass}>
          <PolarAreaChart shadow data={polarAreaChartData} />
        </div>
      </CardBody>
    </Card>
  );
};

export default BotStatusPrivilege;
