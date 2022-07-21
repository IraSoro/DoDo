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
  IonLabel,
  IonInput,
  IonCard,
  IonIcon,
  useIonAlert,
  IonModal,
  IonCheckbox,
  IonReorder, 
} from '@ionic/react';

import { create, close, add } from 'ionicons/icons';
import './TabPurchases.css';

interface ElementObject {
  name: string;
  isDone: boolean;
  count: number;
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
          <IonLabel>
            <h2>{valueEl.name}</h2>
            <p>count: {valueEl.count}</p>
          </IonLabel>
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

  const Elements = newList.elements.map((value, index) => {
    return (
      <IonItem key={index}>
        <IonReorder slot="start" />
        <IonLabel>
          <h2>{value.name}</h2>
          <p>count: {value.count}</p>
        </IonLabel>
      </IonItem>
    );
  });

  return (
    <IonModal ref={modal} trigger="add-modal" presentingElement={presentingElement!}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => dismiss()}>Close</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={ () => {
                newList.title = String(inputRef.current?.value);
                props.listElem.push(newList);
                props.setList([...props.listElem]);
                //TODO:do a normal cleanup of the object
                setNewList({
                  title: "",
                  elements: []
                });
                dismiss();
              }
            }>
              Confirm</IonButton>
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
              newList.elements.push({ name: e.detail.data.values[0], isDone: false, count: e.detail.data.values[1] });
              //TODO:change clone object
              setNewList(Object.assign(Object.create(newList), newList));
            }
          }

        })}>Add element</IonButton>
        {Elements}
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
          count: 5,
        },
        {
          name: "Elem 2",
          isDone: false,
          count: 5678,
        },
        {
          name: "Elem 3",
          isDone: true,
          count: 8788,
        }
      ]
    },
    {
      title: "Shop2",
      elements: [
        {
          name: "ELEM 1",
          isDone: true,
          count: 234,
        },
        {
          name: "Elem 2",
          isDone: false,
          count: 34,
        },
        {
          name: "Elem 3",
          isDone: true,
          count: 345432,
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