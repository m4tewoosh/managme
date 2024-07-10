import { useEffect, useState } from 'react';
import './App.css';
import appSetup from './appSetup';
// import ProjectSelect from './components/ProjectSelect/ProjectSelect';
// import Stories from './components/Stories/Stories';
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
    token: { colorPrimary: '#49aa19', colorBgLayout: '#ced4da' },
  };

  const darkTheme = {
    token: {
      colorPrimary: '#49aa19',
      colorBgLayout: '#1f2125',
      colorBgContainer: '#1f1f1f',
      colorBgElevated: '#1f1f1f',
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
        {/* <ProjectSelect /> */}
        {/* <Stories /> */}
      </Layout>
      {/* <StoryForm /> */}
    </ConfigProvider>
  );
};

export default App;
