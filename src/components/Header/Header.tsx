import { Menu } from 'antd';
import { LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';

import * as S from './Header.styled';

type HeaderProps = {
  isDarkMode: boolean;
  setIsDarkMode: (value: React.SetStateAction<boolean>) => void;
};

const Header = ({ isDarkMode, setIsDarkMode }: HeaderProps) => {
  const handleSetDarkMode = () => {
    setIsDarkMode((prev) => !prev);

    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  const themeItems = [
    {
      label: 'Change theme',
      key: 'theme',
      icon: isDarkMode ? <SunOutlined /> : <MoonOutlined />,
      onClick: handleSetDarkMode,
    },
  ];

  const items = [
    {
      label: 'Logout',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Auth.logout();
        window.location.href = '/register';
      },
    },
    {
      label: <span>Register</span>,
      key: 'register',
    },
    {
      label: <span>Login</span>,
      key: 'login',
    },
  ];

  return (
    <S.Header>
      <Menu mode="horizontal" selectable={false} items={themeItems} />
      <Menu mode="horizontal" items={items} />
    </S.Header>
  );
};

export default Header;
