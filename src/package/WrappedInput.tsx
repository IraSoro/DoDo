import { useRef } from 'react';
import {
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonModal,
    IonButtons,
    IonDatetime,
} from '@ionic/react';
import { DatetimePresentation } from "@ionic/core/components";

import './WrappedInput.css';

interface WrappedProps {
    value: string;
    setValue: (newValue: string) => void;
    ID: string;
    type: DatetimePresentation;
    color: string;
    locale: string;
    title: string;
    icon: string;
    sizeIcon: string;
}

const WrappedInput = (props: WrappedProps) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const datetimeRef = useRef<null | HTMLIonDatetimeElement>(null);
    const inputRef = useRef<HTMLIonInputElement>(null);

    return (
        <IonItem id={props.ID}>
            <IonLabel color={props.color}>{props.title}</IonLabel>
            <IonIcon slot="end" color={props.color} size={props.sizeIcon} icon={props.icon}></IonIcon>
            <p>{props.value}</p>
            <IonModal
                id="choose-datetime-modal"
                ref={modalRef}
                trigger={props.ID}
            >
                <IonDatetime
                    ref={datetimeRef}
                    color={props.color}
                    presentation={props.type}
                    locale={props.locale}
                    onIonChange={(e) => {
                        if (!e.detail.value) {
                            return;
                        }
                        if (props.type === "date") {
                            props.setValue(e.detail.value.toString().slice(0, 10));
                        } else {
                            props.setValue(e.detail.value.toString().slice(11, 16));
                        }
                    }}
                >
                    <IonButtons slot="buttons">
                        <IonButton
                            color={props.color}
                            onClick={() => {
                                datetimeRef.current?.cancel();
                                modalRef.current?.dismiss(inputRef.current?.value, 'cancel');
                            }}
                        >Cancel</IonButton>
                        <IonButton
                            color={props.color}
                            onClick={() => {
                                datetimeRef.current?.confirm();
                                modalRef.current?.dismiss(inputRef.current?.value, 'confirm');
                            }}
                        >Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default WrappedInput;
