import { API_AUTH } from "@/api/Auth";
import CustomIcon from "@/components/Icons";
import { notifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

export function RegisterPage() {

  const refUsuario = useRef<HTMLInputElement>(null);
  const refContraseña = useRef<HTMLInputElement>(null);
  const refContraseña2 = useRef<HTMLInputElement>(null);

  const [registerError, setRegisterError] = useState(false);
  const [goToLogin, setGoToLogin] = useState(false);

  if (goToLogin) return <Navigate to="/login" replace />;

  return (
    <>
      <form className="login-page" onSubmit={e => {
        e.preventDefault();
        if (refUsuario.current && refContraseña.current && refContraseña2.current) {
          const nombre = refUsuario.current.value.trim();
          const contraseña = refContraseña.current.value.trim();
          const contraseña2 = refContraseña2.current.value.trim();

          if (contraseña !== contraseña2) {
            setRegisterError(true);
            refContraseña2.current.focus();
            notifications.show({
              message: "Las contraseñas no coinciden",
              color: "red"
            });
          } else {
            API_AUTH.register(nombre, contraseña)
              .then((r) => {
                if (r !== null) {
                  notifications.show({
                    message: "Cuenta creada",
                    color: "green"
                  });
                }
              });
          }
        }
      }}>
        <h1>Registrate</h1>
        <div className="login-section">
          <input type="text" ref={refUsuario} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={40} placeholder="Usuario" required />
          <CustomIcon icon="User" size={32} />
        </div>
        <div className="login-section">
          <input type="password" ref={refContraseña} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={200} placeholder="Contraseña" required />
          <CustomIcon icon="User" size={32} />
        </div>
        <div className="login-section">
          <input type="password" className={registerError ? "error" : undefined} ref={refContraseña2} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={200} placeholder="Repetir contraseña" required />
          <CustomIcon icon="Key" size={32} />
        </div>
        <button type="submit">Registrarse</button>
        <div className="bottom-login">
          <span>¿Ya tienes cuenta? <a onClick={e => {
            e.preventDefault();
            setGoToLogin(true);
          }}>Inicia Sesión</a></span>
        </div>
      </form>
    </>
  );
}
