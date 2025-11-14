import { useState } from "react";
import { useNavigate, Link } from "react-router";

export const Registro = () => {
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);
    setErrorGeneral(null);
    setLoading(true);

    try {
      console.log("Enviando registro:", values);
      const response = await fetch("http://localhost:3000/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      console.log("Respuesta recibida:", response.status, response.statusText);

      // Verificar si la respuesta es JSON válido
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Datos recibidos:", data);
      } else {
        const text = await response.text();
        console.error("Respuesta no JSON:", text);
        setLoading(false);
        return setErrorGeneral(
          "Error del servidor. Por favor, intente nuevamente."
        );
      }

      if (!response.ok || !data.success) {
        setLoading(false);
        if (response.status === 400) {
          if (data.errores) {
            return setErrores(data.errores);
          }
          return setErrorGeneral(data.error || "Error al registrar usuario");
        }
        return setErrorGeneral(data.error || "Error al registrar usuario");
      }

      // Registro exitoso, redirigir a la página de inicio
      console.log("Registro exitoso, redirigiendo...");
      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al registrar:", error);
      setLoading(false);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setErrorGeneral(
          "Error de conexión. Verifique que el servidor esté corriendo en http://localhost:3000"
        );
      } else {
        setErrorGeneral(`Error de conexión: ${error.message}`);
      }
    }
  };

  return (
    <article>
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "nombre")}
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "nombre")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "email")}
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "email")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Contraseña
            <input
              required
              type="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "password")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "password")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
            <small>
              Mínimo 8 caracteres, al menos una letra minúscula y un número
            </small>
          </label>
          {errorGeneral && <p style={{ color: "red" }}>{errorGeneral}</p>}
        </fieldset>
        <input
          type="submit"
          value={loading ? "Registrando..." : "Registrarse"}
          disabled={loading}
        />
        <p>
          ¿Ya tienes cuenta? <Link to="/">Ingresa aquí</Link>
        </p>
      </form>
    </article>
  );
};
