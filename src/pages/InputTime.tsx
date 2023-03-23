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
    color?: string;
    locale?: string;
    isConvert?: boolean;
    title?: string;
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

    function getColor() {
        if (props.color) {
            return props.color;
        }
        return "primary";
    }

    function getLocale() {
        if (props.locale) {
            return props.locale;
        }
        return "en-GB";
    }

    function getTitle() {
        if (props.title) {
            return props.title;
        }
        return "The time";
    }

    return (
        <IonItem id="choose-time">
            <IonLabel color={getColor()}>{getTitle()}</IonLabel>
            <IonIcon slot="end" color={getColor()} size="small" icon={timeSharp}></IonIcon>
            <p>{time}</p>
            <IonModal
                id="choose-datetime-modal"
                ref={timeModal}
                trigger="choose-time"
            >
                <IonDatetime
                    ref={onlyTime}
                    color={getColor()}
                    presentation="time"
                    locale={getLocale()}
                    onIonChange={(e) => {
                        if (e.detail.value) {
                            if (props.isConvert) {
                                setTime(e.detail.value.toString().slice(11, 16));
                                props.setValue(e.detail.value.toString().slice(11, 16));
                            }
                            else {
                                setTime(e.detail.value.toString());
                                props.setValue(e.detail.value.toString());
                            }
                        }
                    }}
                >
                    <IonButtons slot="buttons">
                        <IonButton color={getColor()} onClick={cancelTime}>Cancel</IonButton>
                        <IonButton color={getColor()} onClick={confirmTime}>Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default InputTime;
