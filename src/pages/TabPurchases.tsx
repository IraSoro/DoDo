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
} from '@ionic/react';
import './TabPurchases.css';

function TabPurchases() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Purchases</IonTitle>
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
                <IonLabel position="floating">Purchase</IonLabel>
                <IonInput></IonInput>
              </IonItem>

            </IonList>


          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
}

export default TabPurchases;