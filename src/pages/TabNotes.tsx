import { useState, useRef, useEffect } from 'react';
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
  IonCard,
  IonCardContent,
  useIonModal,
  IonIcon,
  useIonAlert,
  IonTextarea,
  IonFab,
  IonFabButton,
} from '@ionic/react';

import { create, close, add } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';

import './TabNotes.css';

import { get, set } from '../data/Storage';

import Settings from './SettingsPage';

const InputModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const inputRef = useRef<HTMLIonTextareaElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton color="my-dark" slot="start" fill="clear" onClick={() => onDismiss(null, 'cancel')}>
            Cancel
          </IonButton>
          <IonButton color="my-dark" slot="end" fill="clear" onClick={() => onDismiss(inputRef.current?.value, 'confirm')}>
            Confirm
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        <IonCard>
          <IonItem color="my-light">
            <IonTextarea ref={inputRef} cols={20} rows={25} placeholder="Your note" ></IonTextarea>
          </IonItem>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

interface Props {
  text: string;
  onEdit: (newText: string) => void;
  onDelete: () => void;
}

interface PropsListCards {
  listCards: string[];
  setListCards: (newListCards: string[]) => void;
}

interface PropsEdit {
  text: string;
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const ModalEdit = (props: PropsEdit) => {
  const inputRef = useRef<HTMLIonTextareaElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="my-dark" onClick={() => props.onDismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color="my-dark" onClick={() => props.onDismiss(inputRef.current?.value, 'confirm')}>Confirm</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        <IonCard>
          <IonItem color="my-light">
            <IonTextarea ref={inputRef} cols={20} rows={25} value={props.text} ></IonTextarea>
          </IonItem>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

const Card = (props: Props) => {
  const [presentAlertDelete] = useIonAlert();

  const [present, dismiss] = useIonModal(ModalEdit, {
    onDismiss: (data: string, role: string) => dismiss(data, role), text: props.text,
  });

  function editModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          props.onEdit(ev.detail.data);
        }
      },
    });
  }

  return (
    <IonCard color="my-light">
      <IonToolbar color="my-dark">
        <IonButtons slot="secondary">
          <IonButton slot="end" fill="clear" onClick={() => editModal()}>
            <IonIcon slot="icon-only" color="dark" icon={create} />
          </IonButton>
          <IonButton slot="end" fill="clear" onClick={() => presentAlertDelete({
            header: "Delete note?",
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'alert-button',
              },
              {
                text: 'OK',
                role: 'confirm',
                cssClass: 'alert-button',
              }
            ],
            onDidDismiss: (e: CustomEvent) => {
              if (e.detail.role === 'confirm') {
                props.onDelete();
              }
            }
          })}>
            <IonIcon color="dark" slot="icon-only" icon={close} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonCardContent>{props.text}</IonCardContent>
    </IonCard>
  );
}

const ListCards = (props: PropsListCards) => {
  const components = props.listCards.map((value, index) => {
    return (
      <Card key={index}
        text={value}
        onEdit={(newText) => {
          props.listCards[index] = newText;
          props.setListCards([...props.listCards]);

          get("notes").then(() => {
            set('notes', props.listCards);
          });
        }}
        onDelete={() => {
          props.listCards.splice(index, 1);
          props.setListCards([...props.listCards]);

          get("notes").then(() => {
            set('notes', props.listCards);
          });
        }}
      />
    );
  })
  return (
    <IonList>
      {components}
    </IonList>
  );
}

function TabNodes() {
  const [textValues, setTextValues] = useState<string[]>([]);

  useEffect(() => {
    get("notes").then(result => {
      if (result) {
        setTextValues(result);
        set('notes', result);
      }
    });
  }, []);

  const [present, dismiss] = useIonModal(InputModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });


  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          get('notes').then(() => {
            textValues.unshift(ev.detail.data);
            setTextValues([...textValues]);
            set('notes', textValues);
          });
        }
      },
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="my-dark">
          <IonTitle color="dark">Notes</IonTitle>
          <Settings />
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="fullscreen">
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="my-dark" onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <ListCards listCards={textValues} setListCards={setTextValues} />
      </IonContent>
    </IonPage>
  );
}

export default TabNodes;