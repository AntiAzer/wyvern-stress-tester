import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ListDefault = React.lazy(() =>
  import('./list')
);
const TaskDefault = React.lazy(() =>
  import('./task')
);

const Bot = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/task`} />
      <Route
        path={`${match.url}/list`}
        render={(props) => <ListDefault {...props} />}
      />
      <Route
        path={`${match.url}/task`}
        render={(props) => <TaskDefault {...props} />}
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
export default Bot;
