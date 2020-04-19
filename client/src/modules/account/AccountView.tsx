import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import UserSubscriptionView from './UserSubscriptionView';
import ChangeCreditCard from './ChangeCreditCard';
import CancelSubscription from './CancelSubscription';
import { MeQuery, DogQuery } from '../../schemaTypes';
import { meQuery } from '../../graphql/queries/me';
import { dogQuery } from '../../graphql/queries/dog';

export default class AccountView extends React.Component {
  render() {
    return (
      <>
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
        <Query<DogQuery> query={dogQuery}>
          {({ data, loading }) => {
            if (loading) return null;
            if (!data) return <div>no data!</div>;
            if (!data.dog) return <div>no Dog!</div>;
            return data.dog.imgUrl ? (
              <div>
                <img src={data.dog.imgUrl} alt='random dog' />
              </div>
            ) : null;
          }}
        </Query>
      </>
    );
  }
}
