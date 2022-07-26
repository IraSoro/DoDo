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
  IonCard,
  IonIcon,
  useIonAlert,
  IonModal,
  IonCheckbox,
  IonReorder,
  useIonActionSheet,
  IonTextarea
} from '@ionic/react';

import { create, close, add, ellipsisVerticalSharp, trash } from 'ionicons/icons';
import './TabLists.css';

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
  const [present] = useIonActionSheet();
  const [presentAlertDelete] = useIonAlert();
  const [presentAlertEdit] = useIonAlert();
  const [presentAlertAddItem] = useIonAlert();

  const textDecorationLines = new Map<boolean, string>([
    [false, "none"],
    [true, "line-through"]
  ]);

  const listElem = props.listElem.map((value, i) => {
    const Elem = value.elements.map((valueEl, j) => {
      const lineTrough = textDecorationLines.get(valueEl.isDone);

      return (
        <IonItem key={j + i} >
          <IonLabel>
            <h2 style={{ textDecorationLine: lineTrough }}>{valueEl.name}</h2>
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
            <IonButton
              fill="clear"
              color="light"
              disabled={false}
              expand="block"
              onClick={() =>
                present({
                  buttons: [
                    {
                      text: 'Delete',
                      icon: trash,
                      handler: () => presentAlertDelete({
                        header: "Delete list?",
                        buttons: [
                          {
                            text: 'Cancel',
                          },
                          {
                            text: 'OK',
                            handler: () => {
                              props.listElem.splice(i, 1);
                              props.setList([...props.listElem])
                            }
                          }
                        ],
                      })
                    },
                    {
                      text: 'Edit title',
                      icon: create,
                      handler: () => presentAlertEdit({
                        header: 'Title change',
                        buttons: ['OK'],
                        inputs: [
                          {
                            type: 'textarea',
                            value: value.title,
                          }
                        ],
                        onDidDismiss: (e: CustomEvent) => {
                          props.listElem[i].title = e.detail.data.values[0];
                          props.setList([...props.listElem]);
                        }
                      })
                    },
                    {
                      text: 'Add list item',
                      icon: add,
                      handler: () => presentAlertAddItem({
                        header: 'Title change',
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
                            props.listElem[i].elements.push(
                              {
                                name: e.detail.data.values[0],
                                isDone: false,
                                count: e.detail.data.values[1]
                              });
                            props.setList([...props.listElem]);
                          }
                        }
                      })
                    },
                    {
                      text: 'Cancel',
                      icon: close,
                    }
                  ],
                })
              }
            >
              <IonIcon
                slot="icon-only"
                icon={ellipsisVerticalSharp}
              />
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
  const inputRef = useRef<HTMLIonTextareaElement>(null);

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
            <IonButton onClick={() => {
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

        <IonItem color="light">
          <IonTextarea ref={inputRef} cols={20} rows={1} placeholder="Title list" ></IonTextarea>
        </IonItem>

        <IonCard>
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => presentAlert({
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
        </IonCard>
      </IonContent>
    </IonModal>
  );
}


function TabLists() {
  const [lists, setList] = useState([
    {
      title: "Shop",
      elements: [
        {
          name: "ITEM 1",
          isDone: true,
          count: 5,
        },
        {
          name: "Item 2",
          isDone: false,
          count: 5678,
        },
        {
          name: "ITEM 3",
          isDone: false,
          count: 8788,
        }
      ]
    },
    {
      title: "Shop2",
      elements: [
        {
          name: "ITEM 1",
          isDone: true,
          count: 234,
        },
        {
          name: "Item 2",
          isDone: false,
          count: 34,
        },
        {
          name: "Item 3",
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

export default TabLists;