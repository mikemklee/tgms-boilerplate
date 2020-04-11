import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';

import { LoginMutation, LoginMutationVariables } from '../../schemaTypes';

const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export default class LoginView extends React.Component<
  RouteComponentProps<{}>
> {
  state = {
    email: '',
    password: '',
  };

  handleChange = (e: any) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { email, password } = this.state;

    return (
      <Mutation<LoginMutation, LoginMutationVariables> mutation={loginMutation}>
        {(mutate) => (
          <div>
            <div>
              <input
                type='email'
                name='email'
                placeholder='email'
                value={email}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <input
                type='password'
                name='password'
                placeholder='password'
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <button
                onClick={async () => {
                  const response = await mutate({
                    variables: this.state,
                  });
                  console.log('Login mutation response!', response);
                  this.props.history.push('/me');
                }}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}