import { Button, Form, Input } from 'antd';
import * as S from './LoginForm.styled';
import Auth from '../../classes/auth';

type FormValues = {
  login: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};
const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const handleSubmit = async (values: FormValues) => {
    try {
      const { login, password } = values;

      const response = await fetch('http://localhost:3000/login', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
      });

      const { token } = await response.json();

      Auth.login(token);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <S.Wrapper title="Sign In">
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Login"
          name="login"
          rules={[
            {
              required: true,
              message: 'Please input login!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input password!',
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </Form>
    </S.Wrapper>
  );
};

export default LoginForm;
