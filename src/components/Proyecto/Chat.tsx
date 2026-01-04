import MensajeComponent from "./Mensaje";
import { useEffect, useRef, useState } from "react";
import CustomIcon from "../Icons";
import { notifications } from "@mantine/notifications";
import { Modal } from "@mantine/core";
import { Mensaje } from "@/api/remoto/types";
import { API } from "@/api/API";


interface data {
    isMobile: boolean;
    mobileDisabled: boolean;
    proyectoId: number;
    mensajes: Mensaje[];
    tamañoChat: number;
    updateData: () => void;
    loadingEnviar: boolean;
    setLoadingEnviar: React.Dispatch<React.SetStateAction<boolean>>;
    generarIdea: () => void;
}
export default function Chat({ isMobile, mobileDisabled, proyectoId, mensajes, tamañoChat, updateData, loadingEnviar, setLoadingEnviar, generarIdea }: data) {
    const [mensaje, setMensaje] = useState("");
    const [inputExtended, setInputExtended] = useState(false);

    const [formInfo, setFormInfo] = useState("");

    const refMensajes = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (refMensajes.current) {
            refMensajes.current.scrollTop = refMensajes.current.scrollHeight;
        }
    }, [mensajes.length]);

    const inputHeight = inputExtended ? 200 : (isMobile ? 90 : 68);

    return (
        <>
            <div className={"chat " + (isMobile && mobileDisabled ? "disabled" : "")} style={isMobile ? {} : { width: `${tamañoChat}px` }}>
                <div ref={refMensajes} className="mensajes" style={{ height: `calc(100% - ${inputHeight}px)` }}>
                    <MensajeComponent emisor="IA" texto="¡Hola! ¿Porque no me cuentas a qué te dedicas y qué buscas hacer?" setFormInfo={setFormInfo} generarIdea={generarIdea} loadingEnviar={loadingEnviar} setLoadingEnviar={setLoadingEnviar} />
                    {mensajes.map(m => <MensajeComponent emisor={m.emisor} texto={m.texto} setFormInfo={setFormInfo} respuestasForm={m.respuestasForm ?? undefined} generarIdea={generarIdea} loadingEnviar={loadingEnviar} setLoadingEnviar={setLoadingEnviar}></MensajeComponent>)}
                </div>
                <div className="input-user" style={{ height: `${inputHeight}px` }} onFocus={() => setInputExtended(true)} onBlur={() => setInputExtended(false)}>
                    {!loadingEnviar || <div className="loading-container"><div className="loading">
                        <CustomIcon icon="Spinner" size={32}></CustomIcon>
                    </div></div>}
                    <textarea value={mensaje} placeholder="Habla directamente con tu asistente..." maxLength={1000} onChange={(e) => {
                        if (e.target.value.length <= 1000) {
                            setMensaje(e.target.value);
                        }
                    }}></textarea>
                    <div onClick={() => {
                        if (!loadingEnviar && mensaje.length) {
                            setLoadingEnviar(true);
                            API.proyecto.enviarMensaje(proyectoId, {
                                "texto": mensaje,
                                "respuestasForm": null
                            })
                                .then(r => {
                                    updateData();
                                    setMensaje("");
                                    setLoadingEnviar(false);
                                });
                        }
                    }} className={`chat-send ${!mensaje.length ? "disabled" : ""}`}>
                        <CustomIcon icon="PaperPlane" size={28} fill="#fff"></CustomIcon>
                    </div>
                    {inputHeight != 200 || <small>{mensaje.length} / 1000</small>}
                </div>
            </div>
            <Modal onClose={() => setFormInfo("")} size={"80%"} centered opened={Boolean(formInfo.length)}>
                {JSON.parse(formInfo || "[]").map((f: { campo: string; valor: string; }) => (<p>
                    {f.campo}<br></br><b>{f.valor}</b>
                </p>))}
            </Modal>
        </>
    )
}

//mensajes.map(m => `${m.emisor}: ${m.texto}${m.respuestasForm ? ` => ${m.respuestasForm}` : ""}`)