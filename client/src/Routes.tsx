import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginView from './modules/user/LoginView';
import RegisterView from './modules/user/RegisterView';
import AccountView from './modules/account/AccountView';
import Header from './shared/Header';
import { Section } from './shared/Section';

export class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path='/login' component={LoginView} />
          <Route path='/register' component={RegisterView} />
          <Route path='/account' component={AccountView} />
          <Route exact path='/' render={() => <Section>homepage</Section>} />
        </Switch>
      </BrowserRouter>
    );
  }
}
