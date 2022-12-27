import { useState, useRef, useEffect, useContext } from 'react';
import React from 'react'
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
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
import { ThemeContext } from './theme-context';

const InputModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const inputRef = useRef<HTMLIonTextareaElement>(null);
  const theme = useContext(ThemeContext).theme;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton color={"dark-" + theme} slot="start" fill="clear" onClick={() => onDismiss(null, 'cancel')}>
            Cancel
          </IonButton>
          <IonButton color={"dark-" + theme} slot="end" fill="clear" onClick={() => onDismiss(inputRef.current?.value, 'confirm')}>
            Confirm
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        <IonCard>
          <IonItem color={"light-" + theme}>
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
  const theme = useContext(ThemeContext).theme;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color={"dark-" + theme} onClick={() => props.onDismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color={"dark-" + theme} onClick={() => props.onDismiss(inputRef.current?.value, 'confirm')}>Confirm</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        <IonCard>
          <IonItem color={"light-" + theme}>
            <IonTextarea ref={inputRef} cols={20} rows={25} value={props.text} ></IonTextarea>
          </IonItem>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

const Card = (props: Props) => {
  const [presentAlertDelete] = useIonAlert();
  const theme = useContext(ThemeContext).theme;

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
    <IonCard color={"light-" + theme}>
      <IonToolbar color={"dark-" + theme}>
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
                cssClass: "alert-button-" + theme,
              },
              {
                text: 'OK',
                role: 'confirm',
                cssClass: "alert-button-" + theme,
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

          set('notes', props.listCards);
        }}
        onDelete={() => {
          props.listCards.splice(index, 1);
          props.setListCards([...props.listCards]);

          set('notes', props.listCards);
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
  const theme = useContext(ThemeContext).theme;

  useEffect(() => {
    get("notes").then(result => {
      if (result) {
        setTextValues(result);
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
          textValues.unshift(ev.detail.data);
          setTextValues([...textValues]);
          set('notes', textValues);
        }
      },
    });
  }

  return (
    <IonPage>
      <IonToolbar></IonToolbar>
      <IonContent color="light" className="fullscreen">
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color={"dark-" + theme} onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <ListCards listCards={textValues} setListCards={setTextValues} />
      </IonContent>
    </IonPage>
  );
}

export default TabNodes;
