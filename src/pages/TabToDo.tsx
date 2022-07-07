import React, { useState, useRef } from 'react';
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
  IonDatetime,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import './TabToDo.css';

function TabToDo() {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const [message, setMessage] = useState(
    'Adding'
  );

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Todo added!`);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ToDo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonButton id="open-modal" expand="block">
          Add
        </IonButton>
        <p>{message}</p>
        <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>New ToDo</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="fullscreen">
            <IonList>

              <IonItem>
                <IonLabel position="floating">ToDo</IonLabel>
                <IonInput /* value={text} onIonChange={e => setText(e.detail.value!)} */></IonInput>
              </IonItem>

              <IonItem>
                <IonDatetime color="blue" /*value={date} onIonChange={e => setDate(e.detail.value!)}*/></IonDatetime>
              </IonItem>

            </IonList>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
}

export default TabToDo;