import { API } from "@/api/API";
import { Usuario } from "@/api/remoto/types";
import { cardAñadir, cardProyecto } from "@/components/ProyectoCard";
import { notifications } from "@mantine/notifications";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface data {
  usuario: Usuario | null;
  updateData: () => void;
}
export function PerfilPage({ usuario, updateData }: data) {

  const refNombre = useRef<HTMLInputElement>(null);
  const refContraseñaN = useRef<HTMLInputElement>(null);
  const refContraseñaN2 = useRef<HTMLInputElement>(null);
  const refContraseñaA = useRef<HTMLInputElement>(null);
  const refApiKey = useRef<HTMLInputElement>(null);

  const navigator = useNavigate();
  return (
    <div className="perfil-page">
      <section className="proyectos">
        <h1>Perfil</h1>
        <div className="perfil-editar">
          <form onSubmit={e => {
            e.preventDefault();
            if (usuario && refNombre.current) {
              const nuevoNombre = refNombre.current.value.trim();
              if (nuevoNombre !== usuario.nombre) {
                API.user.setNombre(nuevoNombre)
                  .then((r) => {
                    if (r !== null) {
                      updateData();
                      notifications.show({
                        message: "Nombre cambiado",
                        color: "green"
                      });
                    }
                  });
              } else {
                notifications.show({
                  message: "Ese ya es tu nombre",
                  color: "red"
                });
              }
            }
          }}>
            <label>Cambiar nombre:</label>
            <div className="opciones">
              <input type="text" ref={refNombre} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={40} defaultValue={usuario?.nombre} placeholder="Nuevo nombre" />
            </div>
            <button type="submit">Cambiar</button>
          </form>

          <form onSubmit={e => {
            e.preventDefault();
            if (usuario && refContraseñaN.current && refContraseñaN2.current && refContraseñaA.current) {
              const contraseñaN = refContraseñaN.current.value.trim();
              const contraseñaN2 = refContraseñaN2.current.value.trim();
              const contraseñaA = refContraseñaA.current.value.trim();

              if (contraseñaN === contraseñaN2) {
                API.user.changePassword(contraseñaN, contraseñaA)
                  .then((r) => {
                    if (r !== null) {
                      updateData();
                      notifications.show({
                        message: "Contraseña cambiada",
                        color: "green"
                      });
                      if (refContraseñaN.current?.value) refContraseñaN.current.value = "";
                      if (refContraseñaN2.current?.value) refContraseñaN2.current.value = "";
                      if (refContraseñaA.current?.value) refContraseñaA.current.value = "";
                    }
                  });
              } else {
                refContraseñaN2.current.focus();
                notifications.show({
                  message: "Las contraseñas no coinciden",
                  color: "red"
                });
              }
            }
          }}>
            <label>Cambiar contraseña:</label>
            <div className="opciones">
              <input type="text" name="nombre" hidden autoComplete="username" />
              <input type="password" ref={refContraseñaN} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={200} placeholder="Contraseña nueva" autoComplete="current-password" />
              <input type="password" ref={refContraseñaN2} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={200} placeholder="Repetir contraseña nueva" autoComplete="new-password" />
              <input type="password" ref={refContraseñaA} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={200} placeholder="Contraseña antigua" autoComplete="new-password" />
            </div>
            <button type="submit">Cambiar</button>
          </form>

          <form onSubmit={e => {
            e.preventDefault();
            if (usuario && refApiKey.current) {
              const api = refApiKey.current.value.trim();

              API.user.apiKey(api)
                .then((r) => {
                  if (r !== null) {
                    updateData();
                    notifications.show({
                      message: "API Key cambiada",
                      color: "green"
                    });
                    if (refApiKey.current?.value) refApiKey.current.value = "";
                  }
                });
            }
          }
          }>
            <label>Cambiar API Key:</label>
            <div className="opciones">
              <small>No poner nada para para eliminarla</small>
              <input type="text" ref={refApiKey} pattern="^AIza[0-9A-Za-z\-_]{30,50}$" title="Introduce una API Key de Gemini correcta" placeholder="API Key Gemini" />
            </div>
            <button type="submit">Cambiar</button>
          </form>
        </div>

        <h1>Proyectos
          <div className="todos-proyectos" onClick={() => navigator("/proyectos")}><span>Ver todos</span></div>
        </h1>
        <div className="proyectos-list">
          {cardAñadir(navigator)}
          {
            usuario?.proyectos.sort((a, b) => new Date(b.lastEdit).getTime() - new Date(a.lastEdit).getTime())
              .slice(0, 10)
              .map(proyecto => cardProyecto(proyecto, navigator))
          }
        </div>
      </section>
    </div>
  );
}
