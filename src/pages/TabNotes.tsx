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

import { create, close, add, colorFill } from 'ionicons/icons';
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
      <IonContent color="light" className="ion-padding">
        <IonCard>
          <IonItem color="my-light">
            <IonTextarea ref={inputRef} cols={20} rows={23} placeholder="Your note" ></IonTextarea>
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

const Card = (props: Props) => {
  const [presentAlertDelete] = useIonAlert();
  const [presentAlertEdit] = useIonAlert();

  return (
    <IonCard color="my-light">
      <IonToolbar color="my-dark">
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
            <IonIcon slot="icon-only" color="dark" icon={create} />
          </IonButton>
          <IonButton onClick={() => presentAlertDelete({
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

  const toggleMode = () => {
    console.log("var = ", document.body.classList);
    if (document.body.classList[0] === "blue" || document.body.classList[1] === "blue") {
      document.body.classList.toggle("blue", false);
      document.body.classList.toggle("green", true);
    } else if (document.body.classList[0] === "green" || document.body.classList[1] === "green") {
      document.body.classList.toggle("green", false);
      document.body.classList.toggle("orange", true);
    } else if (document.body.classList[0] === "orange" || document.body.classList[1] === "orange"){
      document.body.classList.toggle("orange", false);
      document.body.classList.toggle("blue", true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="my-dark">
          <IonButton slot="end" fill="clear" onClick={toggleMode}>
            <IonIcon slot="icon-only" color="dark" icon={colorFill} />
          </IonButton>
          <IonTitle color="dark">Notes</IonTitle>
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