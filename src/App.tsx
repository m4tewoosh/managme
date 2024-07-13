import { useEffect, useState } from 'react';
import appSetup from './appSetup';
import ProjectSelect from './components/ProjectSelect/ProjectSelect';
import Stories from './components/Stories/Stories';
// import StoryForm from './components/StoryForm/StoryForm';
import { ConfigProvider, Layout } from 'antd';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import Auth from './classes/auth';
import { rxjsStore } from './store/rxjsStore';

const layoutStyle = {
  padding: 48,
  minHeight: '100vh',
  alignItems: 'center',
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLogged, setIsLogged] = useState(Auth.isLogged());
  const [activeProjectId, setActiveProjectId] = useState<number | null>();

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

    setIsLogged(Auth.isLogged());

    rxjsStore.getStoreActiveProject().subscribe((id) => {
      setActiveProjectId(id);
    });

    appSetup();
  }, []);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Header
        isLogged={isLogged}
        setIsLogged={setIsLogged}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <Layout style={layoutStyle}>
        {!isLogged ? (
          <LoginForm onSuccess={() => setIsLogged(true)} />
        ) : (
          <>
            {activeProjectId ? (
              <>
                <ProjectSelect />
                <Stories />
              </>
            ) : null}
          </>
        )}
      </Layout>
      {/* <StoryForm /> */}
    </ConfigProvider>
  );
};

export default App;
