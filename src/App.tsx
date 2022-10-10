import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {list, book, bagCheck } from 'ionicons/icons';
import TabLists from './pages/TabLists';
import TabToDo from './pages/TabToDo';
import TabNotes from './pages/TabNotes';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { useEffect } from 'react';
import { createStore} from './data/Storage';

import SettingsPage from './pages/SettingsPage';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {

    const setupStore = () => {
      createStore("MyDB");
    }
    setupStore();
  }, []);

  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tabLists">
            <TabLists />
          </Route>

          <Route exact path="/tabToDo">
            <TabToDo />
          </Route>

          <Route exact path="/tabNotes">
            <TabNotes />
          </Route>

          <Route exact path="/settings">
            <SettingsPage />
          </Route>

          <Route exact path="/">
            <Redirect to="/tabLists" />
          </Route>

        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tabLists" href="/tabLists">
            <IonIcon color="my-dark" icon={bagCheck} />
            <IonLabel color="my-dark">Lists</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tabToDo" href="/tabToDo">
            <IonIcon color="my-dark" icon={list} />
            <IonLabel color="my-dark">ToDo</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tabNotes" href="/tabNotes">
            <IonIcon color="my-dark" icon={book} />
            <IonLabel color="my-dark">Notes</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  );
}

export default App;
