import { useState } from 'react';
import { timeSharp } from 'ionicons/icons';

import WrappedInput from './WrappedInput';

let id = 0;

interface InputTimeProps {
    time: string;
    setTime: (newValue: string) => void;
    color?: string;
    locale?: string;
    title?: string;
    icon?: string;
    sizeIcon?: string;
}

const InputTime = (props: InputTimeProps) => {
    const [ident] = useState((id++).toString());

    return (
        <WrappedInput
            value={props.time}
            setValue={props.setTime}
            ID={`InputTime-${ident}`}
            type={"time"}
            color={props.color ?? "primary"}
            locale={props.locale ?? "en-GB"}
            title={props.title ?? "The time"}
            icon={props.icon ?? timeSharp}
            sizeIcon={props.sizeIcon ?? "small"}
        />
    );
}

export default InputTime;

