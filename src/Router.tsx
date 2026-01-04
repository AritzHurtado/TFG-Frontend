import { createBrowserRouter, RouterProvider, Outlet, Navigate, RouteObject } from 'react-router-dom';
import Header from './components/Header';
import { ProyectoPage } from './pages/Proyecto.page';
import { WelcomePage } from './pages/Welcome.page';
import { LoginPage } from './pages/Login.page';
import { PerfilPage } from './pages/Perfil.page';
import { API_AUTH, getRefreshToken, isLoggedIn, logOut, useAuthenticated } from './api/Auth';
import { useEffect, useState } from 'react';
import { ProyectosPage } from './pages/Proyectos.page';
import { RegisterPage } from './pages/Register.page';
import { ProyectoNewPage } from './pages/Proyecto.new.page';
import { API } from './api/API';
import { Usuario } from './api/remoto/types';

export function Router() {

  const [usuario, setUsuario] = useState<Usuario | -1 | null>(-1);
  const [updateDataNumber, setUpdateDataNumber] = useState(0);

  const auth = useAuthenticated();

  useEffect(() => {
    const refreshToken = getRefreshToken();

    const updateUser = () => {
      API.user.getSelf()
        .then(u => setUsuario(u))
        .catch(() => {
          setUsuario(null);
          if (isLoggedIn()) logOut();
        });
    }

    if (isLoggedIn()) {
      updateUser();
    } else if (refreshToken) {
      (async () => {
        if (await API_AUTH.refresh()) {
          updateUser();
        } else {
          setUsuario(null);
          logOut();
        }
        updateData();
      })();
    } else if(usuario !== null) {
      setUsuario(null);
      logOut();
    }
  }, [auth, updateDataNumber]);

  const updateData = () => {
    setUpdateDataNumber(updateDataNumber + 1);
  }

  if (usuario === -1) {
    return;
  }

  const pages = {
    "welcome": <WelcomePage usuario={usuario} />,

    "login": <LoginPage />,

    "register": <RegisterPage />,

    "perfil": <PerfilPage usuario={usuario} updateData={updateData} />,

    "proyectos": <ProyectosPage usuario={usuario} />,

    "proyectoNew": <ProyectoNewPage usuario={usuario} updateData={updateData} edit={false} />,

    "proyectoEdit": <ProyectoNewPage usuario={usuario} updateData={updateData} edit={true} />,

    "proyecto": <ProyectoPage usuario={usuario} updateData={updateData} />
  }

  const notLogedRoutes: RouteObject[] = [
    {
      path: "/login",
      element: pages.login
    },

    {
      path: "/register",
      element: pages.register
    },

    // Redirecciones
    {
      path: "/perfil",
      element: <Navigate to="/login" replace />,
    }
  ];
  const logedRoutes: RouteObject[] = [
    {
      path: "/perfil",
      element: pages.perfil,
    },
    {
      path: "/proyectos",
      element: pages.proyectos,
    },
    {
      path: "/proyecto/new",
      element: pages.proyectoNew,
    },
    {
      path: "/proyecto/:idProyecto",
      element: pages.proyecto,
    },
    {
      path: "/proyecto/:idProyecto/edit",
      element: pages.proyectoEdit,
    },


    // Redirecciones
    {
      path: "/login",
      element: <Navigate to="/perfil" replace />,
    },
    {
      path: "/register",
      element: <Navigate to="/perfil" replace />,
    },
    {
      path: "/proyecto",
      element: <Navigate to="/proyectos" replace />,
    }
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: pages.welcome
    },
    {
      element: <>
        <Header />
        <div className='page'>
          <Outlet />
        </div>
      </>,
      children: isLoggedIn() ? logedRoutes : notLogedRoutes,
    },

    // Redirecciones
    {
      path: "*",
      element: <Navigate to="/" replace />,
    }
  ]);

  return <RouterProvider router={router} />;
}
