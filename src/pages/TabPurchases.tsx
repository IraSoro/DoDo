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
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  useIonModal,
  IonIcon,
  useIonAlert,
  IonModal,
  IonCheckbox,
  IonReorder,
} from '@ionic/react';

import { create, close, add } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';
import './TabPurchases.css';
import { Interface } from 'readline';

interface ElementObject {
  name: string;
  isDone: boolean
}

interface ListObject {
  title: string,
  elements: ElementObject[]
};

interface PropsList {
  listElem: ListObject[];
  setList: (newListToDo: ListObject[]) => void;
}

const ListElements = (props: PropsList) => {
  const [presentAlertDelete] = useIonAlert();
  const [presentAlertEdit] = useIonAlert();

  const listElem = props.listElem.map((value, i) => {
    const Elem = value.elements.map((valueEl, j) => {

      return (
        <IonItem key={j} >
          <IonLabel>{valueEl.name}</IonLabel>          
          <IonCheckbox
            slot="start"
            checked={valueEl.isDone}
            onIonChange={(e: CustomEvent) => {
              props.listElem[i].elements[j].isDone = e.detail.checked;
              props.setList([...props.listElem]);
            }} />
        </IonItem>
      )
    })

    return (
      <IonCard key={i}>
        <IonToolbar color="tertiary">
          <IonTitle>{value.title}</IonTitle>
          <IonButtons slot="secondary">
          <IonButton onClick={() => presentAlertEdit({
            header: 'Editing',
            buttons: ['OK'],
            inputs: [
              {
                type: 'textarea',
                // value: props.text,
              }
            ],
            onDidDismiss: (e: CustomEvent) => {
              // props.onEdit(e.detail.data.values[0]);
            }
          })}>
            <IonIcon slot="icon-only" icon={create} />
          </IonButton>
          <IonButton onClick={() => presentAlertDelete({
            header: "Delete " + value.title + " ?",
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
                props.listElem.splice(i, 1);
                props.setList([...props.listElem])
              }
            }
          })}>
            <IonIcon slot="icon-only" icon={close} />
          </IonButton>
        </IonButtons>
        </IonToolbar>
        {Elem}
      </IonCard>
    );
  })

  return (
    <>{listElem}</>
  )
}

function TabPurchases() {
  const [lists, setList] = useState([
    {
      title: "Shop",
      elements: [
        {
          name: "ELEM 1",
          isDone: true,
        },
        {
          name: "Elem 2",
          isDone: false,
        },
        {
          name: "Elem 3",
          isDone: true,
        }
      ]
    },
    {
      title: "Shop2",
      elements: [
        {
          name: "ELEM 1",
          isDone: true,
        },
        {
          name: "Elem 2",
          isDone: false,
        },
        {
          name: "Elem 3",
          isDone: true,
        }
      ]
    },

  ]);

  // const modal = useRef<HTMLIonModalElement>(null);
  // const inputRef = useRef<HTMLIonInputElement>(null);
  // const page = useRef(undefined);

  // const [canDismiss, setCanDismiss] = useState(false);
  // const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  // useEffect(() => {
  //   setPresentingElement(page.current);
  // }, []);

  // function dismiss() {
  //   modal.current?.dismiss();
  // }

  return (
    <IonPage /*ref={page}*/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent /*className="ion-padding"*/>
        {/* <IonButton id="open-modal" expand="block">
          Add
        </IonButton> */}
        <ListElements
          listElem={lists}
          setList={setList}
        />
        {/* <IonModal ref={modal} trigger="open-modal" canDismiss={canDismiss} presentingElement={presentingElement}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>New list</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => dismiss()}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            /* <p className="ion-padding-horizontal"></p> */
            /* <IonItem>
              <IonInput ref={inputRef} placeholder="Title list" />
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap" {...{ for: 'terms' }}>
                Do you accept the terms and conditions?
              </IonLabel>
              <IonCheckbox
                id="terms"
                checked={canDismiss}
                onIonChange={(ev) => {
                  setCanDismiss(ev.detail.checked);
                }}
              ></IonCheckbox>
            </IonItem> 
          </IonContent>
        </IonModal> */}
      </IonContent>
    </IonPage>
  );
}

export default TabPurchases;