import React from 'react';
import {
    IonButton,
    IonIcon,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
} from '@ionic/react';

import { returnDownBack } from 'ionicons/icons';

function SettingsPage() {
    const toggleGreenMode = () => {
        document.body.classList.toggle("orange", false);
        document.body.classList.toggle("blue", false);
        document.body.classList.toggle("green", true);
    };
    const toggleBlueMode = () => {
        document.body.classList.toggle("orange", false);
        document.body.classList.toggle("green", false);
        document.body.classList.toggle("blue", true);
    };
    const toggleOrangeMode = () => {
        document.body.classList.toggle("green", false);
        document.body.classList.toggle("blue", false);
        document.body.classList.toggle("orange", true);
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="my-dark">
                    <IonTitle>Settings</IonTitle>
                    <IonButton slot="end" fill="clear" href="/tabNotes">
                        <IonIcon slot="icon-only" color="dark" icon={returnDownBack} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <IonButton color="my-dark" onClick={toggleGreenMode}>Green mode</IonButton>
                <IonButton color="my-dark" onClick={toggleBlueMode}>Blue mode</IonButton>
                <IonButton color="my-dark" onClick={toggleOrangeMode}>Orange mode</IonButton>
            </IonContent>
        </IonPage>
    );
}

export default SettingsPage;