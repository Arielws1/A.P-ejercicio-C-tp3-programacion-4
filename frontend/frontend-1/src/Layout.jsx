import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";
import { Ingresar } from "./Ingresar";

export const Layout = () => {
  const { isAuthenticated, logout, nombre } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/vehiculos">Vehículos</Link>
          </li>
          <li>
            <Link to="/conductores">Conductores</Link>
          </li>
          <li>
            <Link to="/viajes">Viajes</Link>
          </li>
        </ul>
        <li>
          {isAuthenticated ? (
            <div>
              <span>Hola, {nombre}</span>
              <button onClick={() => logout()}>Salir</button>
            </div>
          ) : (
            <Ingresar />
          )}
        </li>
      </nav>
      <Outlet />
    </main>
  );
};

