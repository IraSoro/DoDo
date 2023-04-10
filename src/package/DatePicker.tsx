import { calendarClear } from 'ionicons/icons';

import WrappedPicker from './WrappedPicker';

interface DateProps {
    date: string;
    onChange: (newValue: string) => void;
    color?: string;
    locale?: string;
    title?: string;
    icon?: string;
    sizeIcon?: string;
    format?: string;
}

const DatePicker = (props: DateProps) => {
    return (
        <WrappedPicker
            value={props.date}
            onChange={props.onChange}
            type={"date"}
            color={props.color ?? "primary"}
            locale={props.locale ?? "en-GB"}
            title={props.title ?? "The date"}
            icon={props.icon ?? calendarClear}
            sizeIcon={props.sizeIcon ?? "small"}
            format={props.format ?? "yyyy-MM-dd"}
        />
    );
}

export default DatePicker;
