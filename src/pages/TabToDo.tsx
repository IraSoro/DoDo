import { useState } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonList,
  IonLabel,
  IonInput,
  IonDatetime,
  IonIcon,
  useIonAlert,
  IonReorder,
  IonSelect, IonSelectOption,
} from '@ionic/react';
import { create, close, add, trash } from 'ionicons/icons';

import './TabToDo.css';

interface PropsListToDo {
  listToDo: string[];
  setListToDo: (newListCards: string[]) => void;
}

interface PropsListToDo {
  listToDo: string[];
  setListToDo: (newListCards: string[]) => void;
}

const AddButton = (props: PropsListToDo) => {
  const [presentAlert] = useIonAlert();

  return (
    <IonButton slot="end" onClick={() => presentAlert({
      header: 'Task enter',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm'
        }
      ],
      inputs: [
        {
          type: 'textarea',
          placeholder: 'Task'
        }
      ],
      onDidDismiss: (e: CustomEvent) => {
        if (e.detail.role === 'confirm') {
          props.listToDo.push(e.detail.role);
          props.setListToDo([...props.listToDo]);
        }
      }
    })}>
      <IonIcon slot="icon-only" icon={add} />
    </IonButton>
  )
}

const ToDoList = (props: PropsListToDo) => {
  const [presentAlertEdit] = useIonAlert();
  const [presentAlertDelete] = useIonAlert();

  const toDoList = props.listToDo.map((value, index) => {
    return (
      <IonItem key={index} >
        <IonReorder slot="start" />
        <IonLabel>
          {value}
        </IonLabel>
        <IonSelect
          interface="popover"
          value=" "
          onIonChange={(e) => {
            if (e.detail.value === "edit") {
              presentAlertEdit({
                header: 'Task editing',
                buttons: ['OK'],
                inputs: [
                  {
                    type: 'textarea',
                    value: value,
                  }
                ],
                onDidDismiss: (e: CustomEvent) => {
                  props.listToDo[index] = e.detail.data.values[0];
                  props.setListToDo([...props.listToDo]);
                }
              })
            }
            if (e.detail.value === "delete") {
              presentAlertDelete({
                header: "Delete task?",
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
                    props.listToDo.splice(index, 1);
                    props.setListToDo([...props.listToDo]);
                  }
                }
              })
            }
          }}>
          <IonSelectOption value="edit">Edit</IonSelectOption>
          <IonSelectOption value="delete">Delete</IonSelectOption>
        </IonSelect>
        {/* <IonButton
          color="light"
          size="small"          
          onClick={() => presentAlertEdit({
            header: 'Task editing',
            buttons: ['OK'],
            inputs: [
              {
                type: 'textarea',
                value: value,
              }
            ],
            onDidDismiss: (e: CustomEvent) => {
              props.listToDo[index] = e.detail.data.values[0];
              props.setListToDo([...props.listToDo]);
            }
          })}>
          <IonIcon slot="icon-only" icon={create} />
        </IonButton>
        <IonButton
          color="light"
          size="small"
          onClick={() => presentAlertDelete({
            header: "Delete task?",
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
                props.listToDo.splice(index, 1);
                props.setListToDo([...props.listToDo]);
              }
            }
          })}>
          <IonIcon slot="icon-only" icon={trash} />
        </IonButton> */}
      </IonItem>
    );
  })

  return (
    <IonList>
      {toDoList}
    </IonList>
  );
}

function TabToDo() {
  const [listToDo, setListToDo] = useState(["Task1", "Task2", "Task3"]);
  console.log("listToDo = ", listToDo);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <AddButton listToDo={listToDo} setListToDo={setListToDo} />
          <IonTitle>ToDo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ToDoList listToDo={listToDo} setListToDo={setListToDo} />
      </IonContent>
    </IonPage>
  );
}

export default TabToDo;