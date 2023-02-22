import { useState, useRef } from 'react';
import {
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonModal,
    IonButtons,
    IonDatetime,
} from '@ionic/react';
import { calendarClear } from 'ionicons/icons';


interface PropsInput {
    value: string;
    setValue: (newValue: string) => void;
    color: string
}

const InputDate = (props: PropsInput) => {

    const dateModal = useRef<HTMLIonModalElement>(null);
    const [date, setDate] = useState(props.value);
    const datetime = useRef<null | HTMLIonDatetimeElement>(null);
    const inputDate = useRef<HTMLIonInputElement>(null);
    const confirmDate = () => {
        datetime.current?.confirm();
        dateModal.current?.dismiss(inputDate.current?.value, 'confirm');
    }
    const cancelDate = () => {
        datetime.current?.cancel();
        dateModal.current?.dismiss(inputDate.current?.value, 'cancel');
    }

    return (
        <IonItem id="choose-date">
            <IonLabel color={"dark-" + props.color}>The date</IonLabel>
            <IonIcon slot="end" color={"dark-" + props.color} size="small" icon={calendarClear}></IonIcon>
            <p>{date}</p>
            <IonModal
                id="choose-date-modal"
                ref={dateModal}
                trigger="choose-date"
            >
                <IonDatetime
                    ref={datetime}
                    color={"dark-" + props.color}
                    presentation="date"
                    id="datetime"
                    locale="en-GB"
                    value={props.value}
                    onIonChange={(e) => {
                        if (e.detail.value) {
                            setDate(e.detail.value.toString().slice(0, 10));
                            props.setValue(e.detail.value.toString().slice(0, 10));
                        }
                    }}
                >
                    <IonButtons slot="buttons">
                        <IonButton color={"dark-" + props.color} onClick={cancelDate}>Cancel</IonButton>
                        <IonButton color={"dark-" + props.color} onClick={confirmDate}>Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default InputDate;
