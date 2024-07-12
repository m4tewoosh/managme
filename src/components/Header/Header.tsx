import { Menu } from 'antd';
import { LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import Auth from '../../classes/auth';

import * as S from './Header.styled';

type HeaderProps = {
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: React.SetStateAction<boolean>) => void;
};

const Header = ({
  isLogged,
  setIsLogged,
  isDarkMode,
  setIsDarkMode,
}: HeaderProps) => {
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

  const logoutItem = {
    label: 'Logout',
    key: 'logout',
    icon: <LogoutOutlined />,
    onClick: () => {
      Auth.logout();
      setIsLogged(false);
    },
  };

  const items = [isLogged ? { ...logoutItem } : null];

  return (
    <S.Header>
      <Menu mode="horizontal" selectable={false} items={themeItems} />
      <Menu mode="horizontal" items={items} />
    </S.Header>
  );
};

export default Header;
