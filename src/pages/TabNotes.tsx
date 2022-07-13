import { useState, useRef } from 'react';
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  useIonModal,
  IonIcon,
  useIonAlert,
} from '@ionic/react';

import { create, close, add } from 'ionicons/icons';
import './TabNotes.css';

import { OverlayEventDetail } from '@ionic/core/components';

const InputModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const inputRef = useRef<HTMLIonInputElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onDismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Adding</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss(inputRef.current?.value, 'confirm')}>Confirm</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Enter note</IonLabel>
          <IonInput ref={inputRef} placeholder="Your note" />
        </IonItem>
      </IonContent>
    </IonPage>
  );
};


function TabNodes() {
  const [present, dismiss] = useIonModal(InputModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });
  const [presentAlertDelete] = useIonAlert();
  const [presentAlertEdit] = useIonAlert();
  const [remoteCard, setRemoteCard] = useState(-1);
  const [editedCard, setEditedCard] = useState(-1);
  const [textValues, setTextValues] = useState(["Hello1", "Ira1", "World1"]);

  interface Props {
    text: string;
    idx: number;
  }

  function addNote(text: string) {
    let temp: string[] = textValues;
    temp.push(text);
    setTextValues(temp);
  }

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          addNote(ev.detail.data);
        }
      },
    });
  }

  function deleteCard(idx: number) {
    let temp: string[] = textValues;
    delete temp[idx];
    setTextValues(temp);
  }

  function editCard(text: string, idx: number) {
    let temp: string[] = textValues;
    temp[idx] = text;
    setTextValues(temp);
  }

  function Card(props: Props) {
    return (
      <IonCard>
        <IonToolbar color="tertiary">
          <IonButtons slot="secondary">
            <IonButton onClick={() => presentAlertEdit({
              header: 'Note editing',
              buttons: ['OK'],
              inputs: [
                {
                  type: 'textarea',
                  value: props.text,
                }
              ],
              onDidDismiss: (e: CustomEvent) => {
                var newText: string = e.detail.data.values[0];
                editCard(newText, props.idx);
                setEditedCard(props.idx);
              }
            })}>
              <IonIcon slot="icon-only" icon={create} />
            </IonButton>
            <IonButton onClick={() => presentAlertDelete({
              header: "Delete note " + (props.idx + 1) + "?",
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'OK',
                  role: 'confirm',
                }
              ],
              onDidDismiss: (e: CustomEvent) => {
                if (e.detail.role === 'confirm') {
                  deleteCard(props.idx);
                  setRemoteCard(props.idx);
                }
              }
            })}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Note {props.idx + 1}</IonTitle>
        </IonToolbar>
        <IonCardContent>
          Keep close to Nature's heart... and break clear away, once in awhile,
          and climb a mountain or spend a week in the woods. Wash your spirit clean.
          {props.text}
        </IonCardContent>
      </IonCard>
    );
  }

  function Cards() {
    const components = textValues.map((value, index) => {
      return (
        <IonItem key={index}>
          <Card text={value} idx={index} />
        </IonItem>
      );
    })
    return (
      <IonList>
        {components}
      </IonList>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="end" onClick={() => openModal()}>
            <IonIcon slot="icon-only" icon={add} />
          </IonButton>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="fullscreen">

        <Cards />
      </IonContent>
    </IonPage>
  );
}

export default TabNodes;