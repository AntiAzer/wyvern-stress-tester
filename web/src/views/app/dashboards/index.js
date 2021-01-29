import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const BotDefault = React.lazy(() =>
  import('./bot')
);
const ServerDefault = React.lazy(() =>
  import('./server')
);

const Dashboards = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/bot`} />
      <Route
        path={`${match.url}/bot`}
        render={(props) => <BotDefault {...props} />}
      /> 
      <Route
        path={`${match.url}/server`}
        render={(props) => <ServerDefault {...props} />}
      />
      {/* 
      <ProtectedRoute
        path={`${match.url}/default`}
        component={DashboardDefault}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/content`}
        component={ContentDefault}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/ecommerce`}
        component={EcommerceDefault}
        roles={[UserRole.Editor]}
      />
      <ProtectedRoute
        path={`${match.url}/analytics`}
        component={AnalyticsDefault}
        roles={[UserRole.Editor]}
      />
      */}

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Dashboards;
