import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// Contexto para compartir el estado de autenticacion/autorizacion
const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const session = await response.json();

      if (!response.ok && response.status === 400) {
        throw new Error(session.error);
      }

      setToken(session.token);
      setEmail(session.email);
      setNombre(session.nombre);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    setNombre(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session");
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

    // Si el token expiró o es inválido, hacer logout automático
    if (response.status === 401) {
      logout();
      // Redirigir a la página de inicio si estamos en una ruta protegida
      if (window.location.pathname !== "/" && !window.location.pathname.includes("/registro")) {
        window.location.href = "/";
      }
      throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        nombre,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Muestra un mensaje si el usuario no esta logeado
export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h2>Ingrese para ver esta pagina</h2>;
  }

  return <>{children}</>;
};

AuthPage.propTypes = {
  children: PropTypes.node.isRequired,
};
