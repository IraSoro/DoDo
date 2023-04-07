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
import { format, parseISO } from 'date-fns';

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
    format: string;
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
                        props.setValue(format(parseISO(e.detail.value.toString()), props.format));
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
