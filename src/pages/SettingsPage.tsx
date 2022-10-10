import React from 'react';
import {
    IonButton,
    IonIcon,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonToggle,
    IonPage,
} from '@ionic/react';

import { returnDownBack } from 'ionicons/icons';

function SettingsPage() {

    const toggleDarkModeHandler = () => {
        document.body.classList.toggle("orange");
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
                <IonItem>
                    <IonLabel>Orange Mode</IonLabel>
                    <IonToggle
                        slot="end"
                        name="darkMode"
                        color="my-dark"
                        onIonChange={toggleDarkModeHandler}
                    />
                </IonItem>
            </IonContent>
        </IonPage>
    );
}

export default SettingsPage;