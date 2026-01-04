import * as fa_icons from 'react-icons/fa';


interface data {
    icon: FA_ICONS_TYPE;
    fill?: string;
    size?: number;
}
export default function CustomIcon({ icon, fill, size }: data) {
    const svg = fa_icons[`Fa${icon}`]({
        "fill": fill ?? "currentColor",
        size: size ? `${size}px` : undefined
    });
    return svg;
};
export const FA_ICONS = fa_icons;
export type FA_ICONS_TYPE = Exclude<keyof typeof fa_icons, never> extends infer K ? K extends `Fa${infer Rest}` ? Rest : never : never;