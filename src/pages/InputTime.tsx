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
            <IonLabel color={"dark-" + props.color}>The time</IonLabel>
            <IonIcon slot="end" color={"dark-" + props.color} size="small" icon={timeSharp}></IonIcon>
            <p>{time}</p>
            <IonModal
                id="choose-date-modal"
                ref={timeModal}
                trigger="choose-time"
            >
                <IonDatetime
                    ref={onlyTime}
                    color={"dark-" + props.color}
                    presentation="time"
                    id="time"
                    locale="en-GB"
                    onIonChange={(e) => {
                        if (e.detail.value) {
                            setTime(e.detail.value.toString().slice(11, 16));
                            props.setValue(e.detail.value.toString().slice(11, 16));
                        }
                    }}
                >
                    <IonButtons slot="buttons">
                        <IonButton color={"dark-" + props.color} onClick={cancelTime}>Cancel</IonButton>
                        <IonButton color={"dark-" + props.color} onClick={confirmTime}>Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default InputTime;
