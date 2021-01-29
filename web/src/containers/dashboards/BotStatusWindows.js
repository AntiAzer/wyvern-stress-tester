import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from '../../helpers/IntlMessages';
import { ThemeColors } from '../../helpers/ThemeColors';

import { PolarAreaChart } from '../../components/charts';

import axios from "axios";

const colors = ThemeColors();

const BotStatusWindows = ({ chartClass = 'chart-container' }) => {
  const [ firstData, setFirstData ] = useState(0);
  const [ secondData, setSecondData ] = useState(0);
  const [ thridData, setThridData ] = useState(0);
  useEffect(() => {
    const update = () => {
      axios
      .get('/api/status/bot?type=os', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setFirstData(res.data.value.split('/')[0]);
          setSecondData(res.data.value.split('/')[1]);
          setThridData(res.data.value.split('/')[2]);
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
    labels: ['Win 10', 'Win 7', 'Other'],
    datasets: [
      {
        data: [firstData, secondData, thridData],
        borderWidth: 2,
        borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3],
        backgroundColor: [
          colors.themeColor1_10,
          colors.themeColor2_10,
          colors.themeColor3_10,
        ],
      },
    ],
  };
  return (
    <Card className="dashboard-donut-card">
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.bot-windows" />
        </CardTitle>
        <div className={chartClass}>
          <PolarAreaChart shadow data={polarAreaChartData} />
        </div>
      </CardBody>
    </Card>
  );
};

export default BotStatusWindows;
