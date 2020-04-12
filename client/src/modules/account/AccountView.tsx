import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import UserSubscriptionView from './UserSubscriptionView';
import ChangeCreditCard from './ChangeCreditCard';
import CancelSubscription from './CancelSubscription';
import { MeQuery } from '../../schemaTypes';
import { meQuery } from '../../graphql/queries/me';

export default class AccountView extends React.Component {
  render() {
    return (
      <Query<MeQuery> query={meQuery}>
        {({ data, loading }) => {
          if (loading) {
            return null;
          }

          if (!data) {
            return <div>data is undefined</div>;
          }

          if (!data.me) {
            return <Redirect to='/login' />;
          }

          if (data.me.type === 'trial') {
            return <UserSubscriptionView />;
          }

          return (
            <div>
              <div>your current last 4 digits: ${data.me.ccLast4}</div>
              <ChangeCreditCard />;
              <CancelSubscription />;
            </div>
          );
        }}
      </Query>
    );
  }
}
