import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { Link, useLocation } from "react-router";

export const Ingresar = () => {
  const { error, login, setError } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Cerrar el diálogo cuando cambia la ruta
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

    // Limpiar error cuando se abre el diálogo
  const handleOpen = () => {
    if (setError) setError(null);
    setOpen(true);
  };

  // Limpiar error cuando cambian los campos
  const handleEmailChange = (e) => {
    if (setError) setError(null);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (setError) setError(null);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      setOpen(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <button onClick={handleOpen}>Ingresar</button>
      <dialog open={open}>
        <article>
          <h2>Ingrese email y contraseña</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="email">Email:</label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
              />
              <label htmlFor="password">Contraseña:</label>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Ingresar" />
              </div>
              <p>
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
              </p>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};