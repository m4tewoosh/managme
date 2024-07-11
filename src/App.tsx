import { useEffect, useState } from 'react';
import appSetup from './appSetup';
import ProjectSelect from './components/ProjectSelect/ProjectSelect';
import Stories from './components/Stories/Stories';
// import StoryForm from './components/StoryForm/StoryForm';
import { ConfigProvider, Layout } from 'antd';
import Header from './components/Header/Header';

const layoutStyle = {
  padding: 48,
  minHeight: '100vh',
  alignItems: 'center',
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightTheme = {
    token: { colorPrimary: '#51258f', colorBgLayout: '#ced4da' },
  };

  const darkTheme = {
    token: {
      colorPrimary: '#51258f',
      colorBgLayout: '#141414',
      colorBgContainer: '#111a2c',
      colorBgElevated: '#111a2c',
      colorTextBase: '#e1e1e1',
    },
  };

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode) {
      setIsDarkMode(JSON.parse(darkMode));
    }

    appSetup();
  }, []);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <Layout style={layoutStyle}>
        <ProjectSelect />
        <Stories />
      </Layout>
      {/* <StoryForm /> */}
    </ConfigProvider>
  );
};

export default App;
