import { useEffect } from 'react';
import './App.css';
import appSetup from './appSetup';
import ProjectSelect from './components/ProjectSelect/ProjectSelect';
import Stories from './components/Stories/Stories';
// import StoryForm from './components/StoryForm/StoryForm';

function App() {
  useEffect(() => {
    appSetup();
  }, []);

  return (
    <>
      <ProjectSelect />
      <Stories />
      {/* <StoryForm /> */}
    </>
  );
}

export default App;
