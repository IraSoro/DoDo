import { useState} from 'react';
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
import './TabToDo.css';

function TabToDo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ToDo</IonTitle>
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
                <IonLabel position="floating">ToDo</IonLabel>
                <IonInput></IonInput>
              </IonItem>

              <IonItem>
                <IonDatetime color="blue" ></IonDatetime>
              </IonItem>

            </IonList>

            </IonContent>
        </IonModal>


      </IonContent>
    </IonPage>
  );
}

export default TabToDo;