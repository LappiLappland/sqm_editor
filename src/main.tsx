import { useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import ThemeComponent from './components/ThemeContext';
import './fonts/audreyshand.ttf';
import IndexPage from './pages';
import BriefingPage from './pages/briefing.html';
import { BriefingObjectivesPage } from './pages/briefing.html/objectives';
import BriefingShowCodePage from './pages/briefing.html/showCode';
import DescriptionPage from './pages/description.ext';
import DescriptionCameraEffectsPage from './pages/description.ext/cfgCameraEffects';
import DescriptionIdentitiesPage from './pages/description.ext/cfgIdentities';
import DescriptionMusicPage from './pages/description.ext/cfgMusic';
import DescriptionRadioPage from './pages/description.ext/cfgRadio';
import DescriptionSFXPage from './pages/description.ext/cfgSFX';
import DescriptionSoundsPage from './pages/description.ext/cfgSounds';
import DescriptionGearPage from './pages/description.ext/gear';
import DescriptionShowCodePage from './pages/description.ext/showCode';
import ErrorPage from './pages/error';
import OverviewPage from './pages/overview.html';
import OverviewShowCodePage from './pages/overview.html/showCode';
import './styles/index.css';
import './styles/reset.css';

export const PAGE_PATH = '';

const router = createHashRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/",
    element: <DescriptionPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/cfgSounds/",
    element: <DescriptionSoundsPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/cfgIdentities/",
    element: <DescriptionIdentitiesPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/cfgMusic/",
    element: <DescriptionMusicPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/cfgRadio/",
    element: <DescriptionRadioPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/cfgSFX/",
    element: <DescriptionSFXPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/cfgCameraEffects/",
    element: <DescriptionCameraEffectsPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/gear/",
    element: <DescriptionGearPage />,
  },
  {
    path: PAGE_PATH+"/description.ext/showCode/",
    element: <DescriptionShowCodePage />,
  },
  {
    path: PAGE_PATH+"/briefing.html/",
    element: <BriefingPage />
  },
  {
    path: PAGE_PATH+"/briefing.html/objectives/",
    element: <BriefingObjectivesPage />
  },
  {
    path: PAGE_PATH+"/briefing.html/showCode/",
    element: <BriefingShowCodePage />
  },
  {
    path: PAGE_PATH+"/overview.html/",
    element: <OverviewPage />
  },
  {
    path: PAGE_PATH+"/overview.html/showCode/",
    element: <OverviewShowCodePage />
  }
]);

export default function Main() {

  useEffect(() => {
    const unloadCallback = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
  
    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, []);

  return (
    <ThemeComponent>
      <RouterProvider router={router} />
    </ThemeComponent>

  );
}