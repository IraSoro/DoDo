import { useState, useRef, useEffect, useContext } from 'react';
import React from 'react'
import {
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
  IonTitle,
  useIonActionSheet,
  IonCardHeader,
} from '@ionic/react';

import { create, close, add, trash, ellipsisHorizontal } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';

import './TabNotes.css';

import { get, set } from '../data/Storage';
import { ThemeContext } from './theme-context';

const AddModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const inputRef = useRef<HTMLIonTextareaElement>(null);
  const theme = useContext(ThemeContext).theme;

  return (
    <IonPage>
      <IonHeader class="ion-no-border">
        <IonToolbar color={"dark-" + theme}>
          <IonButton color={"light-" + theme} slot="start" fill="clear" onClick={() => onDismiss(null, 'cancel')}>
            <IonIcon color={"light-" + theme} icon={close}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={"dark-" + theme}>
        <div id="add-rectangle-title">
          <IonTitle color="my-light"><h2>Add Note</h2></IonTitle>
        </div>
        <div id="add-rectangle-top">
        </div>
        <div id="add-rectangle">
          <IonList>
            <IonCard class={"add-card-" + theme}>
              <IonItem lines="none" color={"light-" + theme}>
                <IonTextarea ref={inputRef} cols={100} rows={19} placeholder="Your note" ></IonTextarea>
              </IonItem>
            </IonCard>
            <IonItem lines="none" >
              <IonButton
                class="save-button"
                slot="end"
                color={"dark-" + theme}
                size="large"
                onClick={() => onDismiss(inputRef.current?.value, 'confirm')}
              >Save</IonButton>
            </IonItem>
          </IonList>
        </div>
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

const EditModal = (props: PropsEdit) => {
  const inputRef = useRef<HTMLIonTextareaElement>(null);
  const theme = useContext(ThemeContext).theme;

  return (
    <IonPage>
      <IonHeader class="ion-no-border">
        <IonToolbar color={"dark-" + theme}>
          <IonButton color={"light-" + theme} slot="start" fill="clear" onClick={() => props.onDismiss(null, 'cancel')}>
            <IonIcon color={"light-" + theme} icon={close}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={"dark-" + theme}>
        <div id="add-rectangle-title">
          <IonTitle color="my-light"><h2>Edit Note</h2></IonTitle>
        </div>
        <div id="add-rectangle-top">
        </div>
        <div id="add-rectangle">
          <IonList>
            <IonCard class={"add-card-" + theme}>
              <IonItem lines="none" color={"light-" + theme}>
                <IonTextarea ref={inputRef} cols={100} rows={19} value={props.text} ></IonTextarea>
              </IonItem>
            </IonCard>
            <IonItem lines="none" >
              <IonButton
                class="save-button"
                slot="end"
                color={"dark-" + theme}
                size="large"
                onClick={() => props.onDismiss(inputRef.current?.value, 'confirm')}
              >Save</IonButton>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

const Card = (props: Props) => {
  const [presentAlertDelete] = useIonAlert();
  const theme = useContext(ThemeContext).theme;
  const [presentSetting] = useIonActionSheet();

  const [present, dismiss] = useIonModal(EditModal, {
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
    <>
      <IonCard class={"add-card-" + theme} color={"light-" + theme}>
        <IonCardHeader>
          <IonButton
            fill="clear"
            class="setting-note-button"
            onClick={() => {
              presentSetting({
                buttons: [
                  {
                    text: 'Delete',
                    icon: trash,
                    handler: () => presentAlertDelete({
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
                    })
                  },
                  {
                    text: 'Edit',
                    icon: create,
                    handler: () => editModal(),
                  },
                  {
                    text: 'Cancel',
                    icon: close,
                    cssClass: "alert-button-" + theme,
                  },
                ],
              })
            }}
          >
            <IonIcon
              color={"dark-" + theme}
              icon={ellipsisHorizontal}
            ></IonIcon>
          </IonButton>
        </IonCardHeader>
        <IonCardContent onClick={() => editModal()}>{props.text}</IonCardContent>
      </IonCard>
    </>
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

  const [present, dismiss] = useIonModal(AddModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });


  function addModal() {
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
      <IonContent color="my-light" className="fullscreen">
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color={"dark-" + theme} onClick={() => addModal()}>
            <IonIcon color="my-light" icon={add} />
          </IonFabButton>
        </IonFab>
        <ListCards listCards={textValues} setListCards={setTextValues} />
      </IonContent>
    </IonPage>
  );
}

export default TabNodes;
