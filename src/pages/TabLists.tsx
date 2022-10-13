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
  IonTextarea,
  IonFab,
  IonFabButton,
  useIonModal,
} from '@ionic/react';

import { create, close, add, ellipsisVerticalSharp, trash } from 'ionicons/icons';
import './TabLists.css';

import { get, set } from '../data/Storage';

import Settings from './SettingsPage';

import { OverlayEventDetail } from '@ionic/core/components';

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

interface PropsEdit {
  list: ListObject;
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

interface PropListSettings {
  list: ListObject;
  onEdit: (newText: ListObject) => void;
  onDelete: () => void;
}

interface PropItemSettings {
  item: ElementObject;
  onEdit: (newItem: ElementObject) => void;
  onDelete: () => void;
}

const EditModal = (props: PropsEdit) => {
  const inputRef = useRef<HTMLIonTextareaElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton color="my-dark" slot="start" fill="clear" onClick={() => props.onDismiss(null, 'cancel')}>
            Cancel
          </IonButton>
          <IonButton color="my-dark" slot="end" fill="clear" onClick={() => props.onDismiss(inputRef.current?.value, 'confirm')}>
            Confirm
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        <IonTitle>{props.list.title}</IonTitle>
      </IonContent>
    </IonPage>
  );
};

const ItemListSetting = (props: PropItemSettings) => {
  const textDecorationLines = new Map<boolean, string>([
    [false, "none"],
    [true, "line-through"]
  ]);

  const lineTrough = textDecorationLines.get(props.item.isDone);

  return (
    <IonItem color="my-light">
      <IonLabel>
        <h2 style={{ textDecorationLine: lineTrough }}>{props.item.name}</h2>
        <p>count: {props.item.count}</p>
      </IonLabel>
      <IonCheckbox
        color="my-dark"
        slot="start"
        checked={props.item.isDone}
        onIonChange={(e: CustomEvent) => {
          props.item.isDone = e.detail.checked;
          props.onEdit(props.item);
        }}
      />
    </IonItem>)
}

const ListSettings = (props: PropListSettings) => {
  const [present] = useIonActionSheet();
  const [presentAlertDelete] = useIonAlert();

  const Elem = props.list.elements.map((value, i) => {
    return (
      <>
        <ItemListSetting
          item={value}
          onEdit={(newItem) => {
            props.list.elements[i] = newItem;
            props.onEdit(props.list);
          }}
          onDelete={() => {
            props.list.elements.splice(i, 1);
            props.onEdit(props.list);
          }}
        />
      </>
    )
  })

  const [presentEdit, dismiss] = useIonModal(EditModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role), list: props.list,
  });

  function editModal() {
    presentEdit({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {

        }
      },
    });
  }

  return (
    <IonCard>
      <IonToolbar color="my-dark">
        <IonTitle color="dark">{props.list.title}</IonTitle>
        <IonButtons slot="secondary">
          <IonButton
            fill="clear"
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
                            props.onDelete();
                          }
                        }
                      ],
                    })
                  },
                  {
                    text: 'Edit',
                    icon: create,
                    handler: () => {
                      editModal();
                    }
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
              color="dark"
            />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      {Elem}
    </IonCard>
  );

}

const ListElements = (props: PropsList) => {
  const listElem = props.listElem.map((value, i) => {
    console.log("res[" + i + "] = " + value.title);
    return (
      <ListSettings
        key={i}
        list={value}
        onEdit={(newObject) => {
          props.listElem[i] = newObject;
          props.setList([...props.listElem]);
          set('list', props.listElem);
        }}
        onDelete={() => {
          props.listElem.splice(i, 1);
          props.setList([...props.listElem]);
          set('list', props.listElem);
        }}
      />
    )
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

  const [presentAlertDelete] = useIonAlert();

  const Elements = newList.elements.map((value, index) => {
    return (
      <IonItem color="my-light" key={index}>
        <IonReorder slot="start" />
        <IonLabel>
          <h2>{value.name}</h2>
          <p>count: {value.count}</p>
        </IonLabel>
        <IonButton slot="end" fill="clear" onClick={() => presentAlertDelete({
          header: "Delete item?",
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
              handler: () => {
                newList.elements.splice(index, 1);
                setNewList(Object.assign(Object.create(newList), newList));
              }
            }
          ],
        })}>
          <IonIcon color="dark" slot="icon-only" icon={close} />
        </IonButton>
      </IonItem>
    );
  });

  return (
    <IonModal ref={modal} trigger="add-modal" presentingElement={presentingElement!}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color='my-dark'
              onClick={() => {
                setNewList({
                  title: "",
                  elements: []
                });
                dismiss()
              }
              }>Close</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color='my-dark' onClick={() => {
              newList.title = String(inputRef.current?.value);
              props.listElem.unshift(newList);
              props.setList([...props.listElem]);
              set('list', props.listElem);
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
      <IonContent color="light" className="ion-padding">

        <IonItem>
          <IonTextarea ref={inputRef} cols={20} rows={1} placeholder="Title list" ></IonTextarea>
        </IonItem>

        <IonCard>
          <IonButton
            color="my-dark"
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
                  role: 'cancel',
                },
                {
                  text: 'OK',
                  role: 'confirm',
                },
              ],
              onDidDismiss: (e: CustomEvent) => {
                if (e.detail.role === 'confirm' && e.detail.data.values[0]) {
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
  const [lists, setList] = useState<ListObject[]>([]);

  useEffect(() => {
    get("list").then(result => {
      if (result) {
        setList(result);
        set('list', result);
      }
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="my-dark">
          <Settings />
          <IonTitle color="dark">Lists</IonTitle>
          <AddingModal
            listElem={lists}
            setList={setList}
          />

        </IonToolbar>
      </IonHeader>
      <IonContent color="light">
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="add-modal" color="my-dark">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <ListElements
          listElem={lists}
          setList={setList}
        />
      </IonContent>
    </IonPage>
  );
}

export default TabLists;