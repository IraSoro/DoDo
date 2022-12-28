import React, { useState, useContext } from 'react';
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
import { ThemeContext } from './theme-context';

const Settings = () => {

    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <>
            <IonButton slot="end" fill="clear" onClick={() => setIsOpen(true)}>
                <IonIcon color="dark" icon={settings} />
            </IonButton>
            <IonModal isOpen={isOpen}>
                <IonHeader class="ion-no-border">
                    <IonToolbar color={"dark-" + theme}>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonLabel color={"dark-" + theme}>
                        <h1>Theme</h1>
                    </IonLabel>
                    <IonList>
                        <IonRadioGroup allowEmptySelection={true} value={theme}>
                            <IonItem>
                                <IonLabel>Green</IonLabel>
                                <IonRadio color="dark-green" slot="end" value="green" onClick={() => { toggleTheme("green") }}></IonRadio>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Blue</IonLabel>
                                <IonRadio color="dark-blue" slot="end" value="blue" onClick={() => { toggleTheme("blue") }}></IonRadio>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Orange</IonLabel>
                                <IonRadio color="dark-orange" slot="end" value="orange" onClick={() => { toggleTheme("orange") }}></IonRadio>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Pink</IonLabel>
                                <IonRadio color="dark-pink" slot="end" value="pink" onClick={() => { toggleTheme("pink") }}></IonRadio>
                            </IonItem>
                        </IonRadioGroup>
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
}

export default Settings;
