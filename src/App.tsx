import { Redirect, Route } from 'react-router-dom';
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
import { list, book, bagCheck } from 'ionicons/icons';
import TabLists from './pages/TabLists';
import TabToDo from './pages/TabToDo';
import TabNotes from './pages/TabNotes';

import Settings from './pages/SettingsPage';

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

import React from 'react'
import { useEffect, useState } from 'react';
import { createStore, get } from './data/Storage';

setupIonicReact();

const App: React.FC = () => {

  const value: string = "blue";
  const [tabTitle, setTabTitle] = useState("ToDo");

  useEffect(() => {

    const setupStore = () => {
      createStore("MyDB");
    }
    setupStore();

    get("theme").then(result => {
      if (result) {
        document.body.classList.toggle(result, true);
      } else {
        document.body.classList.toggle("green", true);
      }
    });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>

        <IonHeader>
          <IonToolbar color="my-dark">
            <IonTitle color="dark">{tabTitle}</IonTitle>
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
          <IonTabBar slot="bottom">
            <IonTabButton tab="tabToDo" href="/tabToDo" onClick={() => {setTabTitle("ToDo")}}>
              <IonIcon color={"dark-" + value} icon={list} />
              <IonLabel color={"dark-" + value}>ToDo</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tabNotes" href="/tabNotes" onClick={() => {setTabTitle("Notes")}}>
              <IonIcon color={"dark-" + value} icon={book} />
              <IonLabel color={"dark-" + value}>Notes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tabLists" href="/tabLists" onClick={() => {setTabTitle("Lists")}}>
              <IonIcon color={"dark-" + value} icon={bagCheck} />
              <IonLabel color={"dark-" + value}>Lists</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
