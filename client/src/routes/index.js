import React from 'react';
import Home from '../pages/home';
import { Route, Switch } from 'react-router';
import Sandbox from '../pages/sandbox';
import Login from '../pages/login';

function Router() {
  return (
    <Switch>
      <Route path='/sandbox/:id' component={Sandbox} />
      <Route path='/login' component={Login} />
      <Route path='/' component={Home} />
    </Switch>
  );
}

export default Router;
