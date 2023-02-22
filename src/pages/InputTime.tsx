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
import { timeSharp } from 'ionicons/icons';

import './InputValue.css';


interface PropsInput {
    value: string;
    setValue: (newValue: string) => void;
    color: string
}

const InputTime = (props: PropsInput) => {

    const timeModal = useRef<HTMLIonModalElement>(null);
    const [time, setTime] = useState(props.value);
    const onlyTime = useRef<null | HTMLIonDatetimeElement>(null);
    const inputTime = useRef<HTMLIonInputElement>(null);
    const confirmTime = () => {
        onlyTime.current?.confirm();
        timeModal.current?.dismiss(inputTime.current?.value, 'confirm');
    }
    const cancelTime = () => {
        onlyTime.current?.cancel();
        timeModal.current?.dismiss(inputTime.current?.value, 'cancel');
    }

    return (
        <IonItem id="choose-time">
            <IonLabel color={props.color}>The time</IonLabel>
            <IonIcon slot="end" color={props.color} size="small" icon={timeSharp}></IonIcon>
            <p>{time}</p>
            <IonModal
                id="choose-datetime-modal"
                ref={timeModal}
                trigger="choose-time"
            >
                <IonDatetime
                    ref={onlyTime}
                    color={props.color}
                    presentation="time"
                    locale="en-GB"
                    onIonChange={(e) => {
                        if (e.detail.value) {
                            setTime(e.detail.value.toString().slice(11, 16));
                            props.setValue(e.detail.value.toString().slice(11, 16));
                        }
                    }}
                >
                    <IonButtons slot="buttons">
                        <IonButton color={props.color} onClick={cancelTime}>Cancel</IonButton>
                        <IonButton color={props.color} onClick={confirmTime}>Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default InputTime;
