import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Redirect } from 'react-router-dom';

import { MeQuery } from '../../schemaTypes';
import UserSubscriptionView from './UserSubscriptionView';

const meQuery = gql`
  query MeQuery {
    me {
      id
      email
      type
    }
  }
`;

export default class AccountView extends React.Component {
  render() {
    return (
      <Query<MeQuery> fetchPolicy='network-only' query={meQuery}>
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

          if (data.me.type === 'free-trial') {
            return <UserSubscriptionView />;
          }

          return <div>Thank you for subscribing!</div>;
        }}
      </Query>
    );
  }
}
