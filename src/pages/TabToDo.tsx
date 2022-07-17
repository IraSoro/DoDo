import { useState } from 'react';
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  useIonAlert,
  IonReorder,
  useIonActionSheet,
} from '@ionic/react';
import { create, close, add, trash, ellipsisHorizontal } from 'ionicons/icons';

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
  const [present] = useIonActionSheet();

  const [presentAlertDelete] = useIonAlert();
  const [presentAlertEdit] = useIonAlert();

  const toDoList = props.listToDo.map((value, index) => {
    return (
      <IonItem key={index} >
        <IonReorder slot="start" />
        <IonLabel>
          {value}
        </IonLabel>
        <IonButton
          expand="block"
          onClick={() =>
            present({
              buttons: [
                {
                  text: 'Delete',
                  icon: trash,
                  handler: () => presentAlertDelete({
                    header: "Delete task?",
                    buttons: [
                      {
                        text: 'Cancel',
                      },
                      {
                        text: 'OK',
                        handler: () => {
                          props.listToDo.splice(index, 1);
                          props.setListToDo([...props.listToDo]);
                        }
                      }
                    ],
                  })
                },
                {
                  text: 'Edit',
                  icon: create,
                  handler: () => presentAlertEdit({
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
                },
                {
                  text: 'Cancel',
                  icon: close,
                }
              ],
            })
          }
          
          color="light"
        >
          <IonIcon 
          slot="icon-only" 
          icon={ellipsisHorizontal}
          />
        </IonButton>
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