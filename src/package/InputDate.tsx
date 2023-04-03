import { useState } from 'react';
import { calendarClear } from 'ionicons/icons';

import WrappedInput from './WrappedInput';

let id = 0;

interface InputDateProps {
    date: string;
    setDate: (newValue: string) => void;
    color?: string;
    locale?: string;
    title?: string;
    icon?: string;
    sizeIcon?: string;
}

const InputDate = (props: InputDateProps) => {
    const [ident] = useState((id++).toString());

    return (
        <WrappedInput
            value={props.date}
            setValue={props.setDate}
            ID={`InputDate-${ident}`}
            type={"date"}
            color={props.color ?? "primary"}
            locale={props.locale ?? "en-GB"}
            title={props.title ?? "The date"}
            icon={props.icon ?? calendarClear}
            sizeIcon={props.sizeIcon ?? "small"}
        />
    );
}

export default InputDate;
