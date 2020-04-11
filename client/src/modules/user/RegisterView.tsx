import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';

import { RegisterMutation, RegisterMutationVariables } from '../../schemaTypes';

const registerMutation = gql`
  mutation RegisterMutation($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export class RegisterView extends React.Component<RouteComponentProps<{}>> {
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
      <Mutation<RegisterMutation, RegisterMutationVariables>
        mutation={registerMutation}
      >
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
                  console.log('Register mutation response!', response);
                  this.props.history.push('/login');
                }}
              >
                Register
              </button>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}
