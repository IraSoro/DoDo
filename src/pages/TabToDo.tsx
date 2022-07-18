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
  IonCheckbox,
} from '@ionic/react';
import { create, close, add, trash, ellipsisHorizontalSharp } from 'ionicons/icons';

import './TabToDo.css';

interface ToDoObject {
  name: string,
  isDone: boolean
};

interface PropsListToDo {
  listToDo: ToDoObject[];
  setListToDo: (newListToDo: ToDoObject[]) => void;
}

const AddButton = (props: PropsListToDo) => {
  const [presentAlert] = useIonAlert();

  return (
    <IonButton
      slot="end"
      fill="clear"
      color="dark"
      onClick={() => presentAlert({
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
            props.listToDo.push({
              name: e.detail.data.values[0],
              isDone: false
            });
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

  let textDecorationLines = new Map<boolean, string>([
    [false, "none"],
    [true, "line-through"]
  ]);

  const toDoList = props.listToDo.map((value, index) => {
    const lineTrough = textDecorationLines.get(value.isDone);

    return (
      <IonItem key={index} >
        <IonReorder slot="start" />
        <IonLabel style={{ textDecorationLine: lineTrough }} >
          {value.name}
        </IonLabel>
        <IonCheckbox
          slot="start"
          checked={value.isDone}
          onIonChange={(e: CustomEvent) => {
            props.listToDo[index].isDone = e.detail.checked;
            props.setListToDo([...props.listToDo]);
          }} />
        <IonButton
          fill="clear"
          color="dark"
          disabled={false}
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
                        value: value.name,
                      }
                    ],
                    onDidDismiss: (e: CustomEvent) => {
                      props.listToDo[index].name = e.detail.data.values[0];
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
        >
          <IonIcon
            slot="icon-only"
            icon={ellipsisHorizontalSharp}
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
  const [listToDo, setListToDo] = useState([
    {
      name: "Task1",
      isDone: false
    },
    {
      name: "Task2",
      isDone: true
    },
    {
      name: "Task3",
      isDone: true
    }
  ]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <AddButton
            listToDo={listToDo}
            setListToDo={setListToDo}
          />
          <IonTitle>ToDo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ToDoList
          listToDo={listToDo}
          setListToDo={setListToDo}
        />
      </IonContent>
    </IonPage>
  );
}

export default TabToDo;