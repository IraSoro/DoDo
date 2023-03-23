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

import './InputValue.css';


interface PropsInput {
    value: string;
    setValue: (newValue: string) => void;
    color?: string;
    locale?: string;
    isConvert?: boolean;
    title?: string;
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
        return "The date";
    }

    return (
        <IonItem id="choose-date">
            <IonLabel color={getColor()}>{getTitle()}</IonLabel>
            <IonIcon slot="end" color={getColor()} size="small" icon={calendarClear}></IonIcon>
            <p>{date}</p>
            <IonModal
                id="choose-datetime-modal"
                ref={dateModal}
                trigger="choose-date"
            >
                <IonDatetime
                    ref={datetime}
                    color={getColor()}
                    presentation="date"
                    locale={getLocale()}
                    value={props.value}
                    onIonChange={(e) => {
                        if (e.detail.value) {
                            if (props.isConvert) {
                                console.log("true");
                                setDate(e.detail.value.toString().slice(0, 10));
                                props.setValue(e.detail.value.toString().slice(0, 10));
                            } else {
                                console.log("false");
                                setDate(e.detail.value.toString());
                                props.setValue(e.detail.value.toString());
                            }
                        }
                    }}
                >
                    <IonButtons slot="buttons">
                        <IonButton color={getColor()} onClick={cancelDate}>Cancel</IonButton>
                        <IonButton color={getColor()} onClick={confirmDate}>Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default InputDate;
