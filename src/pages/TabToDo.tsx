import { useState, useEffect, useContext, useRef } from 'react';
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
  IonCard,
  IonModal,
  IonButtons,
  IonHeader,
  IonTitle,
  IonInput,
  IonDatetime,
} from '@ionic/react';
import { create, close, add, trash, ellipsisHorizontalSharp, calendarClear, timeSharp } from 'ionicons/icons';

import './TabToDo.css';

import { get, set } from '../data/Storage';
import { ThemeContext } from './theme-context';

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

interface PropsEdit {
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;

  listToDo: ToDoObject[];
  index: number;
  setListToDo: (newListToDo: ToDoObject[]) => void;
}

interface PropsItem {
  listToDo: ToDoObject[];
  index: number;
  setListToDo: (newListToDo: ToDoObject[]) => void;
}

const EditModal = (props: PropsEdit) => {
  const theme = useContext(ThemeContext).theme;

  const [setting, setSetting] = useState<ToDoObject>(props.listToDo[props.index]);
  console.log("idx = ", props.index);
  // for date-modal
  const dateModal = useRef<HTMLIonModalElement>(null);
  const [date, setDate] = useState(setting.date);
  const datetime = useRef<null | HTMLIonDatetimeElement>(null);
  const inputDate = useRef<HTMLIonInputElement>(null);
  const confirmDate = () => {
    datetime.current?.confirm();
    dateModal.current?.dismiss(inputDate.current?.value, 'confirm');
  }

  //for time modal
  const timeModal = useRef<HTMLIonModalElement>(null);
  const [time, setTime] = useState(setting.time);
  const onlyTime = useRef<null | HTMLIonDatetimeElement>(null);
  const inputTime = useRef<HTMLIonInputElement>(null);
  const confirmTime = () => {
    onlyTime.current?.confirm();
    timeModal.current?.dismiss(inputTime.current?.value, 'confirm');
  }

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader class="ion-no-border">
        <IonToolbar color={"dark-" + theme}>
          <IonButton
            color={"light-" + theme}
            slot="start"
            fill="clear"
            onClick={() => props.setIsOpen(false)}
          >
            <IonIcon color={"light-" + theme} icon={close}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={"dark-" + theme}>
        <div id="add-rectangle-title">
          <IonTitle color="my-light"><h2>Edit ToDo</h2></IonTitle>
        </div>
        <div id="add-rectangle-top">
        </div>
        <div id="add-rectangle">
          <IonList>
            <IonCard class={"add-card-" + theme}>
              {/* todo name */}
              <IonItem class={theme + "-underline"}>
                <IonInput
                  value={setting.name}
                  onIonChange={e => {
                    if (e.detail.value) {
                      setting.name = e.detail.value.toString();
                    }
                  }}
                ></IonInput>
              </IonItem>

              {/* todo date */}
              <IonItem id="choose-date">
                <IonLabel color={"dark-" + theme}>The date</IonLabel>
                <IonIcon slot="end" color={"dark-" + theme} size="small" icon={calendarClear}></IonIcon>
                <p>{date}</p>
                <IonModal
                  id="choose-date-modal"
                  ref={dateModal}
                  trigger="choose-date"
                >
                  <IonDatetime
                    ref={datetime}
                    color={"dark-" + theme}
                    presentation="date"
                    id="datetime"
                    locale="en-GB"
                    value={setting.date}
                    onIonChange={(e) => {
                      if (e.detail.value) {
                        setDate(e.detail.value.toString().slice(0, 10));
                        setting.date = e.detail.value.toString().slice(0, 10);
                        setSetting(setting);
                      }
                    }}
                  >
                    <IonButtons slot="buttons">
                      <IonButton color={"dark-" + theme} onClick={confirmDate}>Confirm</IonButton>
                    </IonButtons>
                  </IonDatetime>
                </IonModal>
              </IonItem>

              {/* todo time */}
              <IonItem id="choose-time">
                <IonLabel color={"dark-" + theme}>The time</IonLabel>
                <IonIcon slot="end" color={"dark-" + theme} size="small" icon={timeSharp}></IonIcon>
                <p>{time}</p>
                <IonModal
                  id="choose-date-modal"
                  ref={timeModal}
                  trigger="choose-time"
                >
                  <IonDatetime
                    ref={onlyTime}
                    color={"dark-" + theme}
                    presentation="time"
                    id="time"
                    locale="en-GB"
                    onIonChange={(e) => {
                      if (e.detail.value) {
                        setTime(e.detail.value.toString().slice(11, 16));
                        setting.time = e.detail.value.toString().slice(11, 16);
                        setSetting(setting);
                      }
                    }}
                  >
                    <IonButtons slot="buttons">
                      <IonButton color={"dark-" + theme} onClick={confirmTime}>Confirm</IonButton>
                    </IonButtons>
                  </IonDatetime>
                </IonModal>
              </IonItem>

            </IonCard>
            <IonItem lines="none" >
              <IonButton
                class="save-button"
                slot="end"
                color={"dark-" + theme}
                size="large"
                onClick={() => {
                  props.listToDo[props.index] = setting;

                  // sort
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
                  props.setIsOpen(false);
                }}
              >Save</IonButton>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonModal>
  )
}

const Item = (props: PropsItem) => {
  const theme = useContext(ThemeContext).theme;
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [present] = useIonActionSheet();
  const [presentAlertDelete] = useIonAlert();

  let textDecorationLines = new Map<boolean, string>([
    [false, "none"],
    [true, "line-through"]
  ]);

  const index = props.index;
  const value = props.listToDo[index];
  const lineTrough = textDecorationLines.get(value.isDone);
  const dateTime = () => {
    if (!value.date || !value.time)
      return value.date + value.time;
    return value.time + ", " + value.date;
  }


  return (
    <IonItem color={"light-" + theme} key={index} >
      <IonReorder slot="start" />
      <IonLabel>
        <h2 style={{ textDecorationLine: lineTrough }}>{value.name}</h2>
        <p>{dateTime()}</p>
      </IonLabel>
      <IonCheckbox
        color={"dark-" + theme}
        slot="start"
        checked={value.isDone}
        onIonChange={(e: CustomEvent) => {
          props.listToDo[index].isDone = e.detail.checked;
          props.setListToDo([...props.listToDo]);
          set('ToDo', props.listToDo);
        }} />
      <EditModal
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        listToDo={props.listToDo}
        index={index}
        setListToDo={props.setListToDo}
      />
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
                      cssClass: "alert-button-" + theme,
                    },
                    {
                      text: 'OK',
                      cssClass: "alert-button-" + theme,
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
                handler: () => { setIsOpenEdit(true); }
              },
              {
                text: 'Cancel',
                icon: close,
                cssClass: "alert-button-" + theme,
              }
            ],
          })
        }
      >
        <IonIcon
          color={"dark-" + theme}
          slot="icon-only"
          icon={ellipsisHorizontalSharp}
        />
      </IonButton>
    </IonItem>
  );
}

const ToDoList = (props: PropsListToDo) => {


  const toDoList = props.listToDo.map((value, index) => {
    return <Item
      listToDo={props.listToDo}
      setListToDo={props.setListToDo}
      index={index}
    />;
  });

  return (
    <IonList>
      {toDoList}
    </IonList>
  );
}

const AddingModal = (props: PropsListToDo) => {
  const addingModal = useRef<HTMLIonModalElement>(null);
  const theme = useContext(ThemeContext).theme;

  const [setting, setSetting] = useState<ToDoObject>(
    {
      name: "",
      isDone: false,
      date: "",
      time: ""
    });

  // for date-modal
  const dateModal = useRef<HTMLIonModalElement>(null);
  const [date, setDate] = useState("");
  const datetime = useRef<null | HTMLIonDatetimeElement>(null);
  const inputDate = useRef<HTMLIonInputElement>(null);
  const confirmDate = () => {
    datetime.current?.confirm();
    dateModal.current?.dismiss(inputDate.current?.value, 'confirm');
  }

  //for time modal
  const timeModal = useRef<HTMLIonModalElement>(null);
  const [time, setTime] = useState("");
  const onlyTime = useRef<null | HTMLIonDatetimeElement>(null);
  const inputTime = useRef<HTMLIonInputElement>(null);
  const confirmTime = () => {
    onlyTime.current?.confirm();
    timeModal.current?.dismiss(inputTime.current?.value, 'confirm');
  }

  return (
    <IonModal ref={addingModal} trigger="add-modal">
      <IonHeader class="ion-no-border">
        <IonToolbar color={"dark-" + theme}>
          <IonButton color={"light-" + theme} slot="start" fill="clear" onClick={() => addingModal.current?.dismiss()}>
            <IonIcon color={"light-" + theme} icon={close}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color={"dark-" + theme}>
        <div id="add-rectangle-title">
          <IonTitle color="my-light"><h2>Add ToDo</h2></IonTitle>
        </div>
        <div id="add-rectangle-top">
        </div>
        <div id="add-rectangle">
          <IonList>
            <IonCard class={"add-card-" + theme}>
              {/* todo name */}
              <IonItem class={theme + "-underline"}>
                <IonInput
                  placeholder="to do"
                  onIonChange={e => {
                    if (e.detail.value) {
                      setting.name = e.detail.value.toString();
                    }
                  }}
                ></IonInput>
              </IonItem>

              {/* todo date */}
              <IonItem id="choose-date">
                <IonLabel color={"dark-" + theme}>The date</IonLabel>
                <IonIcon slot="end" color={"dark-" + theme} size="small" icon={calendarClear}></IonIcon>
                <p>{date}</p>
                <IonModal
                  id="choose-date-modal"
                  ref={dateModal}
                  trigger="choose-date"
                >
                  <IonDatetime
                    ref={datetime}
                    color={"dark-" + theme}
                    presentation="date"
                    id="datetime"
                    locale="en-GB"
                    value={setting.date}
                    onIonChange={(e) => {
                      if (e.detail.value) {
                        setDate(e.detail.value.toString().slice(0, 10));
                        setting.date = e.detail.value.toString().slice(0, 10);
                        setSetting(setting);
                      }
                    }}
                  >
                    <IonButtons slot="buttons">
                      <IonButton color={"dark-" + theme} onClick={confirmDate}>Confirm</IonButton>
                    </IonButtons>
                  </IonDatetime>
                </IonModal>
              </IonItem>

              {/* todo time */}
              <IonItem id="choose-time">
                <IonLabel color={"dark-" + theme}>The time</IonLabel>
                <IonIcon slot="end" color={"dark-" + theme} size="small" icon={timeSharp}></IonIcon>
                <p>{time}</p>
                <IonModal
                  id="choose-date-modal"
                  ref={timeModal}
                  trigger="choose-time"
                >
                  <IonDatetime
                    ref={onlyTime}
                    color={"dark-" + theme}
                    presentation="time"
                    id="time"
                    locale="en-GB"
                    onIonChange={(e) => {
                      if (e.detail.value) {
                        setTime(e.detail.value.toString().slice(11, 16));
                        setting.time = e.detail.value.toString().slice(11, 16);
                        setSetting(setting);
                      }
                    }}
                  >
                    <IonButtons slot="buttons">
                      <IonButton color={"dark-" + theme} onClick={confirmTime}>Confirm</IonButton>
                    </IonButtons>
                  </IonDatetime>
                </IonModal>
              </IonItem>

            </IonCard>
            <IonItem lines="none" >
              <IonButton
                class="save-button"
                slot="end"
                color={"dark-" + theme}
                size="large"
                onClick={() => {
                  if (setting.name) {
                    props.listToDo.unshift(setting);

                    // sort
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
                  setDate("");
                  setTime("");
                  addingModal.current?.dismiss();
                }}
              >Save</IonButton>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonModal>
  )
}

function TabToDo() {
  const [listToDo, setListToDo] = useState<ToDoObject[]>([]);
  const theme = useContext(ThemeContext).theme;

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
      <IonContent color="my-light" fullscreen>
        <IonCard class={"todo-card-" + theme}>
          <ToDoList
            listToDo={listToDo}
            setListToDo={setListToDo}
          />
        </IonCard>
        <AddingModal
          listToDo={listToDo}
          setListToDo={setListToDo}
        />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton id="add-modal" color={"dark-" + theme}>
            <IonIcon color="my-light" icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default TabToDo;
