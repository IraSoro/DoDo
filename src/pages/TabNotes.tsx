import React, { useState } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonCard, IonCardContent
} from '@ionic/react';
import './TabNotes.css';

interface Props {
  text: string;
}

function Card({text}: Props) {
  return (
    <IonCard>
      <IonCardContent>
        Keep close to Nature's heart... and break clear away, once in awhile,
        and climb a mountain or spend a week in the woods. Wash your spirit clean.
        {text}
      </IonCardContent>
    </IonCard>
  );
}

function Cards() {
  const textValues = ["Hello", "Ira", "World"];
  const components = textValues.map((value) => {
    return (
      <IonItem key={value}>
        <Card text={value} />
      </IonItem>
    );
  })
  return (
    <IonList>
      {components}
    </IonList>
  );

}


function TabNotes() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonButton expand="block" onClick={() => setIsOpen(true)}>
          Add
        </IonButton>
        <IonModal isOpen={isOpen}>
          <IonHeader>
            <IonToolbar>

              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpen(false)}>Confirm</IonButton>
              </IonButtons>

              <IonTitle>Adding</IonTitle>

              <IonButtons slot="start">
                <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
              </IonButtons>

            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>

              <IonItem>
                <IonLabel position="floating">Note</IonLabel>
                <IonInput></IonInput>
              </IonItem>

            </IonList>

          </IonContent>
        </IonModal>

        <Cards />

      </IonContent>
    </IonPage>
  );
}

export default TabNotes;