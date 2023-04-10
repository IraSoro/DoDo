import { useRef, useState } from 'react';
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

import './WrappedPicker.css';

let id = 0;

interface WrappedProps {
    value: string;
    onChange: (newValue: string) => void;
    type: DatetimePresentation;
    color: string;
    locale: string;
    title: string;
    icon: string;
    sizeIcon: string;
    format: string;
}

const WrappedPicker = (props: WrappedProps) => {
    const [ident] = useState((id++).toString());
    const [value, setValue] = useState(props.value);

    const modalRef = useRef<HTMLIonModalElement>(null);
    const datetimeRef = useRef<null | HTMLIonDatetimeElement>(null);
    const inputRef = useRef<HTMLIonInputElement>(null);

    return (
        <IonItem id={props.type + ident}>
            <IonLabel color={props.color}>{props.title}</IonLabel>
            <IonIcon slot="end" color={props.color} size={props.sizeIcon} icon={props.icon}></IonIcon>
            <p>{value}</p>
            <IonModal
                id="choose-datetime-modal"
                ref={modalRef}
                trigger={props.type + ident}
                onWillDismiss={(ev) => {
                    const formattedValue = format(parseISO(ev.detail.data?.toString()), props.format);
                    setValue(formattedValue);
                    props.onChange(formattedValue);
                }}
            >
                <IonDatetime
                    ref={datetimeRef}
                    color={props.color}
                    presentation={props.type}
                    locale={props.locale}
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
                                modalRef.current?.dismiss(datetimeRef.current?.value, 'confirm');
                            }}
                        >Confirm</IonButton>
                    </IonButtons>
                </IonDatetime>
            </IonModal>
        </IonItem>
    );
}

export default WrappedPicker;
