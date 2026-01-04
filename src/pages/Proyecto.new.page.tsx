import { API } from "@/api/API";
import { Proyecto, Usuario } from "@/api/remoto/types";
import CustomIcon, { FA_ICONS, FA_ICONS_TYPE } from "@/components/Icons";
import ProyectoCard, { cardColors, CardColorsType } from "@/components/ProyectoCard";
import { Combobox, Select, Slider, useCombobox } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

interface data {
  usuario: Usuario | null;
  updateData: () => void;
  edit: boolean;
}
export function ProyectoNewPage({ usuario, updateData, edit }: data) {

  const [nombreProyecto, setNombreProyecto] = useState("Mi proyecto");
  const [tamañoAutomatico, setTamañoAutomatico] = useState(true);
  const [fontSize, setFontSize] = useState(30);
  const [color, setColor] = useState<CardColorsType>("Magenta");
  const [activarIcono, setActivarIcono] = useState(true);
  const [iconoNombre, setIconoNombre] = useState<FA_ICONS_TYPE>("Paperclip");
  const [iconoTamaño, setIconoTamaño] = useState(50);
  const [iconoPosicion, setIconoPosicion] = useState<"top" | "bottom">("top");
  const [clickOn, setClickOn] = useState(true);

  const combobox = useCombobox();
  const [comboboxTempValue, setComboboxTempValue] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);
  const navigator = useNavigate();

  const params = useParams();

  let proyecto: Proyecto | undefined;
  if (edit) {
    const idProyecto = params["idProyecto"];
    proyecto = usuario?.proyectos.find(p => String(p.id) === idProyecto);

    if (!proyecto) {
      return <Navigate to="/proyectos" replace />
    }
  }

  useEffect(() => {
    if (proyecto) {
      setNombreProyecto(proyecto.nombre);
      setTamañoAutomatico(proyecto.fontSize === null);
      if (proyecto.fontSize) setFontSize(proyecto.fontSize);
      setColor(proyecto.color);
      if (proyecto.icon) {
        setActivarIcono(true);
        setIconoNombre(proyecto.icon as FA_ICONS_TYPE);
      } else {
        setActivarIcono(false);
      }
      if (proyecto.iconSize) setIconoTamaño(proyecto.iconSize);
      if (proyecto.iconPosition) setIconoPosicion(proyecto.iconPosition as "top" | "bottom");
    }
  }, [proyecto]);

  return (
    <div className="nuevo-proyecto">
      <form ref={formRef} onSubmit={(e) => {
        e.preventDefault();
        if (clickOn && usuario) {
          setClickOn(false);

          if (proyecto) {
            API.proyecto.editar(proyecto.id, {
              "nombre": nombreProyecto,
              "color": color,
              "fontSize": tamañoAutomatico ? null : fontSize,
              "icon": activarIcono ? iconoNombre : null,
              "iconSize": activarIcono ? iconoTamaño : null,
              "iconPosition": activarIcono ? iconoPosicion : null
            }).then((r) => {
              if (r !== null) {
                notifications.show({
                  message: "Proyecto editado",
                  color: "green"
                });
                updateData();
                navigator(`/proyectos`);
              }
            })
          } else {
            API.proyecto.crear({
              "nombre": nombreProyecto,
              "color": color,
              "fontSize": tamañoAutomatico ? null : fontSize,
              "icon": activarIcono ? iconoNombre : null,
              "iconSize": activarIcono ? iconoTamaño : null,
              "iconPosition": activarIcono ? iconoPosicion : null
            }).then(() => {
              notifications.show({
                message: "Nuevo proyecto creado",
                color: "green"
              });
              updateData();
              navigator(`/proyectos`);
            })
          }
        }
      }}>
        <section>
          <input type="text" value={nombreProyecto} placeholder="Nombre del proyecto" onChange={e => setNombreProyecto(e.target.value)} maxLength={40} required></input>
        </section>
        <section>
          <div className="font-size">
            <div className="font-head">
              <h2>¿Tamaño del texto</h2>
              <div className="radial-option" onClick={() => setTamañoAutomatico(!tamañoAutomatico)}>
                <label htmlFor="tamaño-automatico">Tamaño automático?</label>
                <input type="radio" id="tamaño-automatico" checked={tamañoAutomatico} readOnly />
              </div>
            </div>
            <Slider
              w={"100%"}
              min={1}
              color="pink"
              size="sm"
              value={fontSize}
              marks={[]}
              disabled={tamañoAutomatico}
              onChange={e => setFontSize(e)}
            />
          </div>
        </section>
        <section>
          <h2>Color de tarjeta</h2>
          <div className="selector-color">
            {Object.keys(cardColors).map((c, n) => {
              return <div key={`select-color-${n}`}>
                <input type="radio" name="colors" id={`color-${n}`} value={c} checked={c === color} onChange={e => {
                  if (e.target.checked) setColor(e.target.value as CardColorsType)
                }}></input>
                <label htmlFor={`color-${n}`}>
                  <ProyectoCard
                    text=""
                    color={c as CardColorsType}
                    specialClass="tamaño-variable"
                  />
                </label>
              </div>
            })}
          </div>
        </section>
        <section>
          <div className="font-head">
            <h2>Icono</h2>
            <div className="radial-option" onClick={() => setActivarIcono(!activarIcono)}>
              <label htmlFor="activar-icono">¿Activar icono?</label>
              <input type="radio" id="activar-icono" checked={activarIcono} readOnly />
            </div>
          </div>
          <div className="opciones-icono" style={{ pointerEvents: activarIcono ? undefined : "none", filter: activarIcono ? undefined : `brightness(0.5)` }}>
            <h3>Elegir icono</h3>
            <Combobox
              store={combobox}
              onOptionSubmit={(r) => {
                setIconoNombre(r as FA_ICONS_TYPE);
                setComboboxTempValue(r);
              }}
            >
              <Combobox.Target>
                <input
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={comboboxTempValue ?? iconoNombre}
                  placeholder="Selecciona un icono"
                  style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                  onChange={v => setComboboxTempValue(v.target.value)}
                />
              </Combobox.Target>

              <Combobox.Dropdown
                className="dropdown"
              >
                <Combobox.Options>
                  {Object.entries(FA_ICONS).filter(([i]) => i.toLowerCase().includes(comboboxTempValue.toLowerCase())).sort(([a], [b]) => a.length - b.length).slice(0, 20).map(([i, icon]) => {
                    const iconkey = i.replace("Fa", "") as FA_ICONS_TYPE;
                    return (
                      <Combobox.Option key={iconkey} value={iconkey}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {icon({})}
                          {iconkey}
                        </span>
                      </Combobox.Option>
                    );
                  })}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <h3>Tamaño</h3>
            <Slider
              w={"100%"}
              color="blue"
              size="sm"
              defaultValue={iconoTamaño}
              marks={[]}
              onChange={e => setIconoTamaño(e)}
            />

            <h3>Posición</h3>
            <Select value={iconoPosicion} data={[
              { label: "Arriba", value: "top" },
              { label: "Abajo", value: "bottom" }
            ]}
              onChange={e => setIconoPosicion(e as "top" | "bottom")}
            />
          </div>
        </section>
      </form>

      <div className="preview">
        <ProyectoCard
          text={nombreProyecto}
          color={color as CardColorsType}
          fontSize={tamañoAutomatico ? undefined : 1 + fontSize * 0.06}
          icon={activarIcono ? {
            "name": iconoNombre,
            "position": iconoPosicion,
            "size": iconoTamaño + 6
          } : undefined}
          onClick={() => {
            if (formRef.current) formRef.current.requestSubmit();
          }}
        />
        <span><CustomIcon icon="ArrowUp" /> {edit ? "¡Haz click para editar!" : "¡Haz click para empezar!"} <CustomIcon icon="ArrowUp" /></span>
      </div>

      {!proyecto ||
        <div className="acciones">
          <button onClick={() => {
            if (proyecto) {
              API.proyecto.eliminar(proyecto.id)
                .then((r) => {
                  if (r !== null) {
                    notifications.show({
                      message: "Proyecto eliminado",
                      color: "green"
                    });
                    updateData();
                    navigator(`/proyectos`);
                  }
                })
            }
          }}>Eliminar proyecto</button>
        </div>
      }
    </div>
  );
}