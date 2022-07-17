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

interface PropsListToDo {
  listToDo: string[];
  setListToDo: (newListCards: string[]) => void;
  listOnChange: boolean[];
  setOnChange: (newOnChange: boolean[]) => void;
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
            props.listToDo.push(e.detail.data.values[0]);
            props.setListToDo([...props.listToDo]);
            props.listOnChange.push(false);
            props.setOnChange([...props.listOnChange]);
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
    return (
      <IonItem key={index} >
        <IonReorder slot="start" />
        <IonLabel style={{ textDecorationLine: textDecorationLines.get(props.listOnChange[index]) }} >
          {value}
        </IonLabel>
        <IonCheckbox
          slot="start"
          checked={props.listOnChange[index]}
          onIonChange={(e: CustomEvent) => {
            props.listOnChange[index] = e.detail.checked;
            props.setOnChange([...props.listOnChange]);
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
                          props.listOnChange.splice(index, 1);
                          props.setOnChange([...props.listOnChange]);
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
    "Task1",
    "Task2",
    "Task3",
  ]);
  const [onChange, setOnChange] = useState([
    false,
    true,
    true,
  ]);
  // console.log("listToDo = ", listToDo);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <AddButton
            listToDo={listToDo}
            setListToDo={setListToDo}
            listOnChange={onChange}
            setOnChange={setOnChange}
          />
          <IonTitle>ToDo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ToDoList
          listToDo={listToDo}
          setListToDo={setListToDo}
          listOnChange={onChange}
          setOnChange={setOnChange}
        />
      </IonContent>
    </IonPage>
  );
}

export default TabToDo;