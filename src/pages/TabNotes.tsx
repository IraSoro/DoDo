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
  IonTextarea
} from '@ionic/react';

import { create, close, add } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';

import './TabNotes.css';

import { get, set } from '../data/Storage';

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
      <IonContent className="ion-padding">
        <IonCard>
          <IonItem color="my-light">
            <IonTextarea ref={inputRef} cols={20} rows={29} placeholder="Your note" ></IonTextarea>
          </IonItem>
        </IonCard>
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
    <IonCard color="my-light">
      <IonToolbar color="my-dark">
        <IonTitle>Note {props.idx + 1}</IonTitle>
        <IonButtons slot="secondary">
          <IonButton onClick={() => presentAlertEdit({
            header: 'Note editing',
            buttons: ['OK'],
            inputs: [
              {
                type: 'textarea',
                value: props.text,
                attributes: { "rows": 5 },

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
            <IonIcon slot="icon-only" icon={close} />
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
        idx={index}
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
  const [textValues, setTextValues] = useState<string[]>([""]);

  useEffect(() => {
    get("notes").then(result => {
      setTextValues(result);
      set('notes', result);
    });
  }, []);

  const [present, dismiss] = useIonModal(InputModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });


  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          get('notes').then(result => {
            textValues.push(ev.detail.data);
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
          <IonButton slot="end" fill="clear" color="dark" onClick={() => openModal()}>
            <IonIcon slot="icon-only" icon={add} />
          </IonButton>
          <IonTitle color="dark">Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="fullscreen">
        <ListCards listCards={textValues} setListCards={setTextValues} />
      </IonContent>
    </IonPage>
  );
}

export default TabNodes;