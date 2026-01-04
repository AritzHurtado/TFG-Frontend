import CustomIcon from "@/components/Icons";
import Chat from "@/components/Proyecto/Chat";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Usuario } from "@/api/remoto/types";
import { FormComponent, FormInput, FormNumberInput, FormSelect, FormTextArea, FormTextInput } from "@/interface/tipado";
import { API } from "@/api/API";

interface data {
  usuario: Usuario | null;
  updateData: () => void;
}
export function ProyectoPage({ usuario, updateData }: data) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      setHasApiKey(await API.user.hasApiKey());
    })();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [chatOpen, setChatOpen] = useState(true);

  const [tamañoChat, setTamañoChatRaw] = useState(Math.max(200, Math.min(500, window.innerWidth * 0.4)));
  const [draggingSeparador, setDraggingSeparador] = useState(false);
  const [draggingSeparadorLeft, setDraggingSeparadorLeft] = useState(false);
  const [draggingSeparadorRight, setDraggingSeparadorRight] = useState(false);

  const [ignoreNotKey, setIgnoreNotKey] = useState(false);

  const [loadingEnviar, setLoadingEnviar] = useState(false);
  const [loadingDescargar, setLoadingDescargar] = useState(false);

  const separadorMouseDown = () => setDraggingSeparador(true);
  const mouseUp = () => {
    setDraggingSeparador(false);
    setDraggingSeparadorLeft(false);
    setDraggingSeparadorRight(false);
  }

  const refMessage = useRef<HTMLTextAreaElement>(null);

  const navigator = useNavigate();

  const params = useParams();
  const idProyecto = params["idProyecto"];

  const proyectoRaw = usuario?.proyectos.find(p => String(p.id) === idProyecto);

  const [ideaGenerada, setIdeaGenerada] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!proyectoRaw) {
    return <Navigate to="/proyectos" replace />;
  }

  const proyecto = {
    ...proyectoRaw,
    form: (proyectoRaw.form ? JSON.parse(proyectoRaw.form) : null) as FormComponent[] | null
  }

  const formId = proyecto.mensajes.length;

  const mouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!draggingSeparador) return;

    setTamañoChat(window.innerWidth - e.clientX);
  };

  const setTamañoChat = (tamaño: number) => {
    const adding = tamañoChat <= tamaño
    if (tamaño < 300) {
      setDraggingSeparadorRight(true);
      setDraggingSeparadorLeft(false);
      if (!draggingSeparadorRight) setTamañoChatRaw(adding ? 300 : 0);
    } else if (tamaño > window.innerWidth - 300) {
      setDraggingSeparadorLeft(true);
      setDraggingSeparadorRight(false);
      if (!draggingSeparadorLeft) setTamañoChatRaw(adding ? window.innerWidth : window.innerWidth - 300);
    } else {
      setTamañoChatRaw(tamaño);
      setDraggingSeparadorLeft(false);
      setDraggingSeparadorRight(false);
    }
  }

  const generarIdea = () => {
    setLoadingEnviar(true);
    API.proyecto.generarIdea(proyecto.id).then(res => {
      if (res) {
        setIdeaGenerada(res.idea);
        setLoadingEnviar(false);
      }
    });
  }

  const descargarPDF = async () => {
    try {
      setLoadingDescargar(true);

      const div = document.getElementById("idea-generada");
      if (!div) return;

      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const marginTop = 40;
      const marginBottom = 40;
      const marginLeft = 20;
      const marginRight = 40;
      const availableWidth = pageWidth - marginLeft - marginRight;
      const availableHeight = pageHeight - marginTop - marginBottom;

      const modifiedSections: HTMLElement[] = [];
      const sections = div.querySelectorAll("section");
      sections.forEach((section) => {
        const element = section as HTMLElement;
        element.style.backgroundColor = "#0f0";
        modifiedSections.push(element);

        for (let i = 0; i < element.children.length; i++) {
          const e = element.children.item(i) as HTMLElement;
          e.style.backgroundColor = "#fff"
        }
      });
      div.style.fontSize = "0.5em";


      // Guardar estilos originales
      const originalStyle = {
        width: div.style.width,
        maxWidth: div.style.maxWidth,
        boxSizing: div.style.boxSizing,
      };
      const originalOverflow = document.body.style.overflow;

      div.style.boxSizing = "border-box";
      div.style.width = `${availableWidth}px`;
      div.style.maxWidth = `${availableWidth}px`;
      document.body.style.overflow = "hidden";

      const scale = 2;
      const canvas = await html2canvas(div, {
        scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        windowWidth: availableWidth,
      });

      // Restaurar estilos
      modifiedSections.forEach(element => {
        element.style.backgroundColor = "trasparent";
      });
      div.style.fontSize = "unset";

      div.style.width = originalStyle.width;
      div.style.maxWidth = originalStyle.maxWidth;
      div.style.boxSizing = originalStyle.boxSizing;
      document.body.style.overflow = originalOverflow;

      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const srcW = canvas.width;
      const srcH = canvas.height;
      const pageSrcHeight = Math.floor((availableHeight * srcW) / availableWidth);

      if (srcH / pageSrcHeight > 10) {
        notifications.show({
          message: "Documento demasiado grande, no se puede descargar",
          color: "red"
        })
        setLoadingDescargar(false);
        return;
      }

      let srcY = 0;
      let pageIndex = 0;

      while (srcY < srcH) {
        let cutY = srcY + pageSrcHeight;
        if (srcY < (srcH - pageSrcHeight)) {
          // No cortar una misma sección. Si es muy larga, no cortar una palabra

          let foundY = null;
          for (let y = cutY - 1; y > srcY + 1; y -= 2) {
            const row = ctx.getImageData(0, y, srcW, 1).data;

            let valid = true;
            for (let i = 16; i < row.length - 16; i += 16) {
              const r = row[i];
              const b = row[i + 2];
              if (r < 245 || b < 245) {
                valid = false;
                break;
              }
            }

            if (valid) {
              foundY = y;
              break;
            }
          }

          if (foundY) {
            cutY = foundY;
          } else {
            for (let y = cutY - 1; y > srcY + 1; y -= 2) {
              const row = ctx.getImageData(0, y, srcW, 1).data;

              let valid = true;
              for (let i = 16; i < row.length - 16; i += 16) {
                const g = row[i + 1];
                if (g < 245) {
                  valid = false;
                  break;
                }
              }
              if (valid) {
                foundY = y;
                break;
              }
            }

          }
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data
        for (let i = 16; i < data.length - 16; i += 4) {
          const g = data[i + 1];
          if (g == 255) {
            data[i] = g;
            data[i + 2] = g;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const sliceHeight = Math.min(cutY - srcY, srcH - srcY);

        // Crear canvas temporal
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = srcW;
        pageCanvas.height = sliceHeight;

        const pageCtx = pageCanvas.getContext("2d") as CanvasRenderingContext2D;
        pageCtx.drawImage(canvas, 0, srcY, srcW, sliceHeight, 0, 0, srcW, sliceHeight);

        const imgData = pageCanvas.toDataURL("image/png");
        const pdfImgHeight = (sliceHeight * availableWidth) / srcW;

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", marginLeft, marginTop, availableWidth, pdfImgHeight);

        srcY += sliceHeight;
        pageIndex += 1;
      }

      pdf.save("proyectIA-idea.pdf");
    } catch (err) {
      console.error("Error generando PDF:", err);
    } finally {
      setLoadingDescargar(false);
    }
  };

  const mainStyle: React.CSSProperties = {};
  if (draggingSeparador) {
    mainStyle.cursor = "e-resize";
    mainStyle.userSelect = "none";
  }

  const modal = <Modal centered onClose={() => setIgnoreNotKey(true)} size={"80%"} opened={!ignoreNotKey}>
    <h2>No hay ninguna API Key asociada a tu Perfil</h2>
    <div className="acciones">
      <button onClick={() => {
        window.open('https://aistudio.google.com/api-keys', '_blank', 'noopener,noreferrer');
      }}>Obtener Gemini API Key</button>
      <button onClick={() => {
        navigator("/perfil");
      }}>Ir al Perfil</button>
    </div>
  </Modal>

  const modalIdea = <Modal centered onClose={() => setIdeaGenerada("")} size={isMobile ? "100%" : "80%"} opened={Boolean(ideaGenerada.length)} closeOnClickOutside={false}>
    <div className="final-idea-header">
      <button className="generar-idea" disabled={loadingEnviar} onClick={generarIdea}>{loadingEnviar ?
        <span className="loading">
          <CustomIcon icon="Spinner"></CustomIcon>
        </span>
        : <span>Volver a generar</span>}
      </button>
      <button className="descargar-idea" disabled={loadingDescargar} onClick={descargarPDF}>{loadingDescargar ?
        <span className="loading">
          <CustomIcon icon="Spinner"></CustomIcon>
        </span>
        : <span>Descargar</span>}</button>
    </div>
    <div className={`final-idea ${loadingDescargar ? "hidden" : ""} ${isEditing ? "editing" : ""}`}>
      <div className="editable-mensaje" onClick={() => {
        document.getElementById("idea-generada")?.focus();
      }}>Haz click para editar</div>
      <div id="idea-generada" dangerouslySetInnerHTML={{ "__html": ideaGenerada }} contentEditable suppressContentEditableWarning={true}
        onFocus={() => setIsEditing(true)}
        onBlur={(e) => {
          setIsEditing(false);
          setIdeaGenerada(e.currentTarget.innerHTML);
        }}
      ></div>
    </div>
  </Modal>

  if (hasApiKey === null) {
    return <div></div>;
  } else if (proyecto.mensajes.length > 1) {
    return (
      <>
        <div className="proyecto-header">
          <div className="nombre-proyecto">
            <span>{proyecto.nombre}</span>
            <div className="icon" onClick={() => navigator(`/proyecto/${proyecto.id}/edit`)}>
              <CustomIcon icon="Cog" size={30}></CustomIcon>
            </div>
          </div>
          <button className="generar-idea" disabled={loadingEnviar} onClick={generarIdea}>{loadingEnviar ?
            <span className="loading">
              <CustomIcon icon="Spinner"></CustomIcon>
            </span>
            : <span>Generar idea</span>}
          </button>
        </div>
        <div className="proyecto" onMouseUp={mouseUp} onMouseMove={mouseMove} style={mainStyle}>
          <form style={isMobile ? {} : { width: `calc(100% - ${tamañoChat}px)` }} className={"forms " + (isMobile && chatOpen ? "disabled" : "")} onSubmit={e => {
            e.preventDefault();

            if (proyecto.form?.length) {
              const data = proyecto.form.map((component, n) => {
                if (document.getElementById(`form-${formId}-component-${n}`)) {
                  const element = (document.getElementById(`form-${formId}-component-${n}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
                  if (element) {
                    return {
                      campo: component.name,
                      valor: (document.getElementById(`form-${formId}-component-${n}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value
                    }
                  }
                }
                return false;
              }).filter(e => e);

              setLoadingEnviar(true);
              API.proyecto.enviarMensaje(proyecto.id, {
                "texto": "Formulario enviado",
                "respuestasForm": JSON.stringify(data)
              })
                .then((r) => {
                  if (r !== null) {
                    updateData();
                    setLoadingEnviar(false);
                  }
                });
            }
          }}>
            <div className="components">
              {proyecto.form?.map((component, n) => {
                const componentId = `form-${formId}-component-${n}`;
                const htmlLabel = <label htmlFor={componentId}>{component.name}</label>
                let htmlComponent = <></>;

                if (component.base === "input") {
                  const inputComponent = component as FormInput;

                  if (inputComponent.type === "text") {
                    const inputComponent = component as FormTextInput;
                    htmlComponent = <input id={componentId} key={componentId} type="text" placeholder={inputComponent.placeholder} maxLength={inputComponent.maxLenght} />
                  } else if (inputComponent.type === "number") {
                    const inputComponent = component as FormNumberInput;
                    htmlComponent = <input id={componentId} key={componentId} type="number" defaultValue={inputComponent.default} min={inputComponent.min} max={inputComponent.max} />
                  }
                } else if (component.base === "select") {
                  const selectComponent = component as FormSelect;
                  htmlComponent = <select id={componentId} key={componentId}>
                    {selectComponent.options.map(option => {
                      return <option value={option}>{option}</option>
                    })}
                  </select>
                } else if (component.base === "textarea") {
                  const textareaComponent = component as FormTextArea;
                  htmlComponent = <textarea id={componentId} key={componentId} placeholder={textareaComponent.placeholder} maxLength={textareaComponent.maxLenght} />
                }
                return <div className="component">
                  {htmlLabel}
                  {htmlComponent}
                </div>;
              })}
            </div>
            <div className="submit">
              {!proyecto.form?.length ||
                <button type="submit" disabled={loadingEnviar}>{loadingEnviar ?
                  <span className="loading">
                    <CustomIcon icon="Spinner"></CustomIcon>
                  </span>
                  : "Enviar formulario"}</button>
              }
            </div>
          </form>
          <div className="separador" onMouseDown={separadorMouseDown}>
            <CustomIcon icon="Bars" fill="#fff" />
          </div>
          <Chat isMobile={isMobile} mobileDisabled={!chatOpen} proyectoId={proyecto.id} mensajes={proyecto.mensajes} tamañoChat={tamañoChat} updateData={updateData} loadingEnviar={loadingEnviar} setLoadingEnviar={setLoadingEnviar} generarIdea={generarIdea}></Chat>
        </div>
        <div className="mobileSwap" onClick={() => setChatOpen(!chatOpen)}>
          <CustomIcon icon={chatOpen ? "Clipboard" : "CommentDots"} size={30} fill="#fff" />
        </div>
        {hasApiKey || modal}
        {modalIdea}
      </>
    );
  } else {
    return (
      <>
        <form className="proyecto-first" onSubmit={e => {
          e.preventDefault();
          if (refMessage.current) {
            setLoadingEnviar(true);
            API.proyecto.enviarMensaje(proyecto.id, {
              "texto": refMessage.current.value,
              "respuestasForm": null
            })
              .then((r) => {
                if (r !== null) {
                  updateData();
                  setLoadingEnviar(false);
                }
              });
          }
        }}>
          <h1>¡Hola! ¿Porque no me cuentas a qué te dedicas y qué buscas hacer?</h1>
          <textarea ref={refMessage} minLength={20} maxLength={1000} required />
          <button type="submit" disabled={loadingEnviar}>{loadingEnviar ?
            <span className="loading">
              <CustomIcon icon="Spinner"></CustomIcon>
            </span>
            : "¡Empezar!"}</button>
        </form>
        {hasApiKey || modal}
      </>
    );
  }
}
