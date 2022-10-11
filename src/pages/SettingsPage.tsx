import { useState } from 'react';
import {
    IonButton,
    IonHeader,
    IonContent,
    IonToolbar,
    IonItem,
    IonList,
    IonLabel,
    IonIcon,
    IonButtons,
    IonModal,
    IonRadio,
    IonRadioGroup,
} from '@ionic/react';
import { settings } from 'ionicons/icons';

import { set } from '../data/Storage';

const Settings = () => {

    const toggleGreenMode = () => {
        document.body.classList.toggle("orange", false);
        document.body.classList.toggle("blue", false);
        document.body.classList.toggle("pink", false);
        document.body.classList.toggle("green", true);
        set("theme", "green");
    };
    const toggleBlueMode = () => {
        document.body.classList.toggle("orange", false);
        document.body.classList.toggle("green", false);
        document.body.classList.toggle("pink", false);
        document.body.classList.toggle("blue", true);
        set("theme", "blue");
    };
    const toggleOrangeMode = () => {
        document.body.classList.toggle("green", false);
        document.body.classList.toggle("blue", false);
        document.body.classList.toggle("pink", false);
        document.body.classList.toggle("orange", true);
        set("theme", "orange");
    };
    const togglePinkMode = () => {
        document.body.classList.toggle("green", false);
        document.body.classList.toggle("blue", false);
        document.body.classList.toggle("orange", false);
        document.body.classList.toggle("pink", true);
        set("theme", "pink");
    };

    const [isOpen, setIsOpen] = useState(false);

    function getTheme() {
        return document.body.classList[1];
    }

    return (
        <>
            <IonButton slot="end" fill="clear" onClick={() => setIsOpen(true)}>
                <IonIcon color="dark" icon={settings} />
            </IonButton>
            <IonModal isOpen={isOpen}>
                <IonHeader>
                    <IonToolbar color="my-dark">
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonLabel color="my-dark">
                        <h1>Theme</h1>
                    </IonLabel>
                    <IonList>
                        <IonRadioGroup color="my-dark" allowEmptySelection={true} value={getTheme()}>
                            <IonItem>
                                <IonLabel>Green</IonLabel>
                                <IonRadio slot="end" value="green" onClick={toggleGreenMode}></IonRadio>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Blue</IonLabel>
                                <IonRadio slot="end" value="blue" onClick={toggleBlueMode}></IonRadio>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Orange</IonLabel>
                                <IonRadio slot="end" value="orange" onClick={toggleOrangeMode}></IonRadio>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Pink</IonLabel>
                                <IonRadio slot="end" value="pink" onClick={togglePinkMode}></IonRadio>
                            </IonItem>
                        </IonRadioGroup>
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
}

export default Settings;