import { useState, useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonPage,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  useIonAlert,
  IonReorder,
  useIonActionSheet,
  IonCheckbox,
  IonFab,
  IonFabButton,
  IonToolbar,
} from '@ionic/react';
import { create, close, add, trash, ellipsisHorizontalSharp } from 'ionicons/icons';

import './TabToDo.css';

import { get, set } from '../data/Storage';

interface ToDoObject {
  name: string,
  isDone: boolean,
  date: string,
  time: string
};

interface PropsListToDo {
  listToDo: ToDoObject[];
  setListToDo: (newListToDo: ToDoObject[]) => void;
}

const AddButton = (props: PropsListToDo) => {
  const [presentAlert] = useIonAlert();

  return (
    <IonFabButton
      color="my-dark"
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
            placeholder: 'Task',
          },
          {
            type: 'date',
          },
          {
            type: 'time',
          }
        ],
        onDidDismiss: (e: CustomEvent) => {
          if (e.detail.role === 'confirm' && e.detail.data.values[0]) {
            props.listToDo.unshift({
              name: e.detail.data.values[0],
              isDone: false,
              date: e.detail.data.values[1],
              time: e.detail.data.values[2]
            });
            props.listToDo.sort(function (a, b) {
              if (a.time > b.time) {
                return 1;
              }
              if (a.time < b.time) {
                return -1;
              }
              return 0;
            });
            props.listToDo.sort(function (a, b) {
              if (a.date > b.date) {
                return 1;
              }
              if (a.date < b.date) {
                return -1;
              }
              return 0;
            });
            props.setListToDo([...props.listToDo]);
            set('ToDo', props.listToDo);
          }
        }
      })}>
      <IonIcon icon={add} />
    </IonFabButton>
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
    const dateTime = () => {
      if (!value.date || !value.time)
        return value.date + value.time;
      return value.time + ", " + value.date;
    }

    return (
      <IonItem color="my-light" key={index} >
        <IonReorder slot="start" />
        <IonLabel>
          <h2 style={{ textDecorationLine: lineTrough }}>{value.name}</h2>
          <p>{dateTime()}</p>
        </IonLabel>
        <IonCheckbox
          color="my-dark"
          slot="start"
          checked={value.isDone}
          onIonChange={(e: CustomEvent) => {
            props.listToDo[index].isDone = e.detail.checked;
            props.setListToDo([...props.listToDo]);
            set('ToDo', props.listToDo);
          }} />
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
                          set('ToDo', props.listToDo);
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
                        value: value.name,
                      },
                      {
                        type: 'date',
                        value: value.date,
                      },
                      {
                        type: 'time',
                        value: value.time,
                      }
                    ],
                    onDidDismiss: (e: CustomEvent) => {
                      if (e.detail.role === 'confirm') {
                        props.listToDo[index].name = e.detail.data.values[0];
                        props.listToDo[index].date = e.detail.data.values[1];
                        props.listToDo[index].time = e.detail.data.values[2];
                        props.listToDo.sort(function (a, b) {
                          if (a.time > b.time) {
                            return 1;
                          }
                          if (a.time < b.time) {
                            return -1;
                          }
                          return 0;
                        });
                        props.listToDo.sort(function (a, b) {
                          if (a.date > b.date) {
                            return 1;
                          }
                          if (a.date < b.date) {
                            return -1;
                          }
                          return 0;
                        });
                        props.setListToDo([...props.listToDo]);
                        set('ToDo', props.listToDo);
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
            color="dark"
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
  const [listToDo, setListToDo] = useState<ToDoObject[]>([]);

  useEffect(() => {
    get("ToDo").then(result => {
      if (result) {
        setListToDo(result);
      }
    });
  }, []);

  return (
    <IonPage>
      <IonToolbar></IonToolbar>
      <IonContent color="light" fullscreen>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <AddButton
            listToDo={listToDo}
            setListToDo={setListToDo}
          />
        </IonFab>
        <ToDoList
          listToDo={listToDo}
          setListToDo={setListToDo}
        />
      </IonContent>
    </IonPage>
  );
}

export default TabToDo;
