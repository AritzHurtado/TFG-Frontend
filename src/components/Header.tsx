import { isLoggedIn, logOut } from "@/api/Auth";
import { notifications } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";
import CustomIcon from "./Icons";

interface data {
    style?: React.CSSProperties;
    onClickLogo?: () => void;
}
export default function Header({ style, onClickLogo }: data) {
    const logedIn = isLoggedIn();
    const location = useLocation();
    const navigator = useNavigate();

    let topRight;

    if (location.pathname != "/login") {
        if (logedIn) {
            if (location.pathname == "/perfil") {
                topRight = <div className="login" onClick={() => {
                    logOut();
                    notifications.show({
                        message: "Sesión cerrada",
                        color: "green"
                    });
                }}>
                    <div className="login-log">
                        <span>Log</span>
                    </div>
                    <div className="login-out">
                        <span>Out</span>
                    </div>
                </div>;
            } else {
                topRight =
                    <div className="perfil" onClick={() => navigator("/perfil")}>
                        <div className="perfil-text">
                            <span>Perfil</span>
                        </div>
                        <div className="perfil-icon">
                            <CustomIcon icon="User" />
                        </div>
                    </div>;
            }
        } else {
            topRight =
                <div className="login" onClick={() => navigator("/login")}>
                    <div className="login-log">
                        <span>Log</span>
                    </div>
                    <div className="login-in">
                        <span>In</span>
                    </div>
                </div>;
        }
    }

    return (
        <header style={style}>
            <div className="header-left">
                <div className="logo" onClick={onClickLogo ? onClickLogo : () => navigator("/")}>
                    <div className="logo-proyect">
                        <span>Proyect</span>
                    </div>
                    <div className="logo-ia">
                        <span>IA</span>
                    </div>
                </div>
            </div>
            {!topRight || <div className="header-right">
                {topRight}
            </div>}
        </header>
    )
}
