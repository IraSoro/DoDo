import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createStore, get, set } from './data/Storage';
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { list, book } from 'ionicons/icons';

import TabLists from './pages/TabLists';
import TabToDo from './pages/TabToDo';
import TabNotes from './pages/TabNotes';
import Settings from './pages/SettingsPage';
import { ThemeContext } from './pages/theme-context';

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

setupIonicReact();

const App: React.FC = () => {
  const [tabTitle, setTabTitle] = useState("ToDo");
  const [theme, updateTheme] = useState("green");

  function toggleTheme(newTheme: string) {
    updateTheme(newTheme);
    set("theme", newTheme);
  }

  useEffect(() => {

    const setupStore = () => {
      createStore("MyDB");
    }
    setupStore();

    get("theme").then(result => {
      if (result) {
        updateTheme(result);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <IonApp>
        <IonReactRouter>

          <IonHeader class="ion-no-border">
            <IonToolbar color={"dark-" + theme}>
              <IonTitle color={"light-" + theme}>{tabTitle}</IonTitle>
              <Settings />
            </IonToolbar>
          </IonHeader>

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

              <Route exact path="/">
                <Redirect to="/tabToDo" />
              </Route>

              <Route exact path="/scheduler/">
                <Redirect to="/tabToDo" />
              </Route>

            </IonRouterOutlet>
            <IonTabBar class={theme} slot="bottom">
              <IonTabButton tab="tabToDo" href="/tabToDo" onClick={() => { setTabTitle("ToDo") }}>
                <IonIcon color={"dark-" + theme} icon={list} />
                <IonLabel color={"dark-" + theme}>ToDo</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tabNotes" href="/tabNotes" onClick={() => { setTabTitle("Notes") }}>
                <IonIcon color={"dark-" + theme} icon={book} />
                <IonLabel color={"dark-" + theme}>Notes</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </ThemeContext.Provider>
  );
}

export default App;
