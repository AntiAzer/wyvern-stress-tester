import React, { useEffect, useState } from 'react';

import IntlMessages from '../../helpers/IntlMessages';
import GradientCard from '../../components/cards/GradientCard';

import axios from "axios";

const BotStatusCount = () => {
  const [ onlineBotCount, setOnlineBotCount ] = useState(0);
  const [ offlineBotCount, setOfflineBotCount ] = useState(0);
  const [ deadBotCount, setDeadBotCount ] = useState(0);
  useEffect(() => {
    const update = () => {
      axios
      .get('/api/status/bot?type=status', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setOnlineBotCount(res.data.value.split('/')[0]);
          setOfflineBotCount(res.data.value.split('/')[1]);
          setDeadBotCount(0);
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
    <GradientCard>
      <span className="badge badge-pill badge-theme-3 align-self-start mb-3">
        <IntlMessages id="menu.home" />
      </span>
      <p className="lead text-white">
        <IntlMessages 
          id="dashboards.activate-bot-count" 
          values={{
            onlineCount: onlineBotCount,
          }}
        />
      </p>
      <p className="text-white">
        <IntlMessages 
          id="dashboards.deactivate-bot-count" 
          values={{
            offlineCount: offlineBotCount,
            deadCount: deadBotCount,
          }}
        />
      </p>
    </GradientCard>
  );
};
export default BotStatusCount;
