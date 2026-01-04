import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CustomIcon from "../Icons";

interface data {
    emisor: "IA" | "USER";
    texto: string;
    setFormInfo: React.Dispatch<React.SetStateAction<string>>;
    respuestasForm?: string;
    generarIdea: () => void;
    loadingEnviar: boolean;
    setLoadingEnviar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MensajeComponent({ emisor, texto, setFormInfo, respuestasForm, generarIdea, loadingEnviar, setLoadingEnviar }: data) {
    const generarIdeaButton = texto.startsWith("!!!Generar idea!!!");
    const mostrarTexto = emisor === "IA" ? texto.replace('!!!Generar idea!!!', "") : texto;

    return (
        <div className={`mensaje mensaje-${emisor}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {mostrarTexto}
            </ReactMarkdown>{
                emisor == "IA" ?
                    !generarIdeaButton ||
                    <button className="generar-idea-mensaje" onClick={generarIdea} disabled={loadingEnviar}>{loadingEnviar ?
                        <span className="loading">
                            <CustomIcon icon="Spinner"></CustomIcon>
                        </span>
                        : "Generar idea"}
                    </button>
                    :
                    !respuestasForm ||
                    <div className="icon" onClick={() => setFormInfo(respuestasForm)}>
                        <CustomIcon icon="InfoCircle" fill="#BE3455" size={24}></CustomIcon>
                    </div>
            }
        </div>
    )
}
