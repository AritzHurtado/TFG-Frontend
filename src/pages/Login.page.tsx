import { API_AUTH } from "@/api/Auth";
import CustomIcon from "@/components/Icons";
import { notifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

export function LoginPage() {

  const refUsuario = useRef<HTMLInputElement>(null);
  const refContraseña = useRef<HTMLInputElement>(null);

  const [loginError, setLoginError] = useState(false);
  const [goToRegister, setGoToRegister] = useState(false);

  if (goToRegister) return <Navigate to="/register" replace />;

  return (
    <>
      <form className="login-page" onSubmit={e => {
        e.preventDefault();
        if (refUsuario.current && refContraseña.current) {
          const nombre = refUsuario.current.value.trim();
          const contraseña = refContraseña.current.value.trim();

          API_AUTH.logIn(nombre, contraseña)
            .catch(() => {
              notifications.show({
                message: "Usuario o contraseña incorrectos",
                color: "red"
              });
              if (refContraseña.current) {
                refContraseña.current.value = "";
                refContraseña.current.focus();
                setLoginError(true);
              }
            });
        }
      }}>
        <h1>Inicia sesión</h1>
        <div className="login-section">
          <input type="text" ref={refUsuario} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={40} placeholder="Usuario" required />
          <CustomIcon icon="User" size={32} />
        </div>
        <div className="login-section">
          <input type="password" className={loginError ? "error" : undefined} ref={refContraseña} pattern="^\S+$" title="No pueden haber espacios" minLength={4} maxLength={200} placeholder="Contraseña" required />
          <CustomIcon icon="Key" size={32} />
        </div>
        <button type="submit">Login</button>
        <div className="bottom-login">
          <span>¿No tienes cuenta? <a onClick={e => {
            e.preventDefault();
            setGoToRegister(true);
          }}>Registrate</a></span>
        </div>
      </form>
    </>
  );
}
