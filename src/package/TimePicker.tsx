import { timeSharp } from 'ionicons/icons';

import WrappedPicker from './WrappedPicker';

interface TimeProps {
    time: string;
    onChange: (newValue: string) => void;
    color?: string;
    locale?: string;
    title?: string;
    icon?: string;
    sizeIcon?: string;
    format?: string;
}

const TimePicker = (props: TimeProps) => {
    return (
        <WrappedPicker
            value={props.time}
            onChange={props.onChange}
            type={"time"}
            color={props.color ?? "primary"}
            locale={props.locale ?? "en-GB"}
            title={props.title ?? "The time"}
            icon={props.icon ?? timeSharp}
            sizeIcon={props.sizeIcon ?? "small"}
            format={props.format ?? "HH:mm"}
        />
    );
}

export default TimePicker;

