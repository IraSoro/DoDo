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
  IonReorder, IonAvatar, IonImg, useIonActionSheet
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




const AddingModal = (props: PropsList) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  function dismiss() {
    modal.current?.dismiss();
  }

  const [presentAlert] = useIonAlert();

  const [newList, setNewList] = useState<ListObject>(
    {
      title: "",
      elements: []
    }
  );

  return (
    <IonModal ref={modal} trigger="add-modal" presentingElement={presentingElement!}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => dismiss()}>Close</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton>Config</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonLabel position="stacked"></IonLabel>
        <IonInput ref={inputRef} placeholder="Title list" />

        <IonButton onClick={() => presentAlert({
          header: 'Adding element',
          inputs: [
            {
              placeholder: 'Name'
            },
            {
              type: 'number',
              placeholder: 'Count',
              min: 1,
              max: 10000
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'OK',
              role: 'confirm',
            },
          ],
          onDidDismiss: (e: CustomEvent) => {
            if (e.detail.role === 'confirm') {
              newList.elements.push({name: e.detail.data.values[0], isDone: false});
              setNewList(newList);
              console.log("list = ", newList);
              // console.log("1 = ", e.detail.data.values[0]);
              // console.log("2 = ", e.detail.data.values[1]);
            }
          }
          
        })}>Add element</IonButton>

      </IonContent>
    </IonModal>
  );
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




  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lists</IonTitle>

          <IonButton
            id="add-modal"
            slot="end"
            fill="clear"
            color="dark">
            <IonIcon slot="icon-only" icon={add} />
          </IonButton>
          <AddingModal
            listElem={lists}
            setList={setList}
          />

        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ListElements
          listElem={lists}
          setList={setList}
        />
      </IonContent>
    </IonPage>
  );
}

export default TabPurchases;