import * as React from 'react';
import styled from 'styled-components';

import { Input } from './Input';
import { Button } from './Button';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface State {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (data: State) => void;
  buttonText: string;
}

export class Form extends React.PureComponent<Props, State> {
  state = {
    email: '',
    password: '',
  };

  handleChange = (e: any) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    } as any);
  };

  render() {
    const { password, email } = this.state;

    return (
      <FormContainer>
        <Input
          label='EMAIL'
          type='text'
          name='email'
          placeholder='Enter your email address...'
          value={email}
          onChange={this.handleChange}
        />
        <Input
          label='PASSWORD'
          type='password'
          name='password'
          placeholder='Enter your password...'
          value={password}
          onChange={this.handleChange}
        />
        <Button onClick={() => this.props.onSubmit(this.state)}>
          {this.props.buttonText}
        </Button>
      </FormContainer>
    );
  }
}
