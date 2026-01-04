import { NavigateFunction } from "react-router-dom";
import CustomIcon, { FA_ICONS_TYPE } from "./Icons";
import { Proyecto } from "@/api/remoto/types";

export const cardColors = {
    "Blanco": ["#666", "#ccc"],
    "Naranja": ["#c30", "#fc6"],
    "Rojo": ["#c00", "#f96"],
    "Violeta": ["#309", "#c9f"],
    "Azul": ["#036", "#69f"],
    "Verde": ["#060", "#6f6"],

    "Marrón": ["#630", "#c96"],
    "Amarillo": ["#c90", "#ff3"],
    "Rosa": ["#c33", "#f99"],
    "Magenta": ["#c06", "#f9f"],
    "Cian": ["#069", "#9cf"],
    "Lima": ["#390", "#9f3"],
}

export type CardColorsType = keyof typeof cardColors;

interface data {
    text: string;
    color: CardColorsType;
    icon?: {
        name: FA_ICONS_TYPE;
        size: number;
        position: "top" | "bottom";
    } | null;
    fontSize?: number | null;
    onClick?: () => void;
    specialClass?: string
}

export default function ProyectoCard({ text, color: colorName, icon, fontSize, onClick, specialClass }: data) {

    const textSpan = <span key={`text`}>{text}</span>;

    const iconSVG = icon ? <CustomIcon icon={icon.name} size={icon.size} /> : null;

    const final = [];
    if (icon) {
        if (icon.position === "top") final.push(<div key={`icon`} className="icon">{iconSVG}</div>);
        final.push(textSpan);
        if (icon.position === "bottom") final.push(<div key={`icon`} className="icon">{iconSVG}</div>);
    } else {
        final.push(textSpan);
    }

    const color = cardColors[colorName];
    return <div className={`proyecto-card ${specialClass ?? ""}`}
        style={{
            background: `linear-gradient(0deg, ${color[0]}, ${color[1]})`,
            fontSize: `${fontSize ?? (4 - 0.12 * Math.min(text.length, 12)).toFixed(2)}em`
        }}
        onClick={onClick}
    >
        <div className="card-content">
            {final}
        </div>
    </div >
}

export const cardAñadir = (navigator: NavigateFunction) =>
    <ProyectoCard
        text="Nuevo proyecto"
        color="Blanco"
        fontSize={1.8}
        icon={{
            "name": "Plus",
            "position": "top",
            "size": 72
        }}
        specialClass="add-card"
        onClick={() => navigator("/proyecto/new")}
    />;

export const cardProyecto = (proyecto: Proyecto, navigator: NavigateFunction, specialClass?: string) =>
    <ProyectoCard
        key={`card-${proyecto.id}`}
        text={proyecto.nombre}
        color={proyecto.color}
        fontSize={proyecto.fontSize ? 1 + proyecto.fontSize * 0.06 : undefined}
        icon={proyecto.icon && proyecto.iconPosition && proyecto.iconSize ? {
            name: proyecto.icon as FA_ICONS_TYPE,
            position: proyecto.iconPosition as "top" | "bottom",
            size: proyecto.iconSize + 6
        } : undefined}

        onClick={() => navigator(`/proyecto/${proyecto.id}`)}
        specialClass={specialClass}
    />;