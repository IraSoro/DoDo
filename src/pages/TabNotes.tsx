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
          <IonButton slot="start" fill="clear" onClick={() => onDismiss(null, 'cancel')}>
            Cancel
          </IonButton>
          <IonTitle>Adding</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => onDismiss(inputRef.current?.value, 'confirm')}>Confirm</IonButton>
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

interface Props {
  text: string;
  idx: number;
  onEdit: (newText: string) => void;
  onDelete: () => void;
}

interface PropsListCards {
  listCards: string[];
  setListCards: (newListCards: string[]) => void;
}

const Card = (props: Props) => {
  const [presentAlertDelete] = useIonAlert();
  const [presentAlertEdit] = useIonAlert();

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
              props.onEdit(e.detail.data.values[0]);
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
                props.onDelete();
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

const ListCards = (props: PropsListCards) => {
  const components = props.listCards.map((value, index) => {
    return (
      <IonItem key={index}>
        <Card
          text={value}
          idx={index}
          onEdit={(newText) => {
            props.listCards[index] = newText;
            props.setListCards([...props.listCards]);
          }}
          onDelete={() => {
            props.listCards.splice(index, 1);
            props.setListCards([...props.listCards])
          }}
        />
      </IonItem>
    );
  })
  return (
    <IonList>
      {components}
    </IonList>
  );
}


function TabNodes() {
  const [textValues, setTextValues] = useState(["Hello1", "Ira1", "World1"]);

  const [present, dismiss] = useIonModal(InputModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });


  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          textValues.push(ev.detail.data);
          setTextValues([...textValues]);
        }
      },
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="end" fill="clear" color="dark" onClick={() => openModal()}>
            <IonIcon slot="icon-only" icon={add} />
          </IonButton>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="fullscreen">
        <ListCards listCards={textValues} setListCards={setTextValues} />
      </IonContent>
    </IonPage>
  );
}

export default TabNodes;