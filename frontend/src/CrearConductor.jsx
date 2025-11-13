import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearConductor = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    fecha_vencimiento_licencia: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    try {
      const response = await fetchAuth("http://localhost:3000/conductores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 400) {
          if (data.errores) {
            return setErrores(data.errores);
          }
          return window.alert(data.error || "Error al crear conductor");
        }
        return window.alert(
          data.error || data.message || "Error al crear conductor"
        );
      }
      navigate("/conductores");
    } catch (error) {
      console.error("Error al crear conductor:", error);
      window.alert("Error al crear conductor: " + error.message);
    }
  };

  return (
    <article>
      <h2>Crear conductor</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) =>
                setValues({ ...values, nombre: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "nombre")
              }
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
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) =>
                setValues({ ...values, apellido: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "apellido")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "apellido")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            DNI
            <input
              required
              value={values.dni}
              onChange={(e) =>
                setValues({ ...values, dni: e.target.value })
              }
              aria-invalid={errores && errores.some((e) => e.path === "dni")}
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "dni")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Licencia
            <input
              required
              value={values.licencia}
              onChange={(e) =>
                setValues({ ...values, licencia: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "licencia")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "licencia")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Fecha de Vencimiento de Licencia
            <input
              required
              type="date"
              value={values.fecha_vencimiento_licencia}
              onChange={(e) =>
                setValues({
                  ...values,
                  fecha_vencimiento_licencia: e.target.value,
                })
              }
              aria-invalid={
                errores &&
                errores.some((e) => e.path === "fecha_vencimiento_licencia")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "fecha_vencimiento_licencia")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
        </fieldset>
        <input type="submit" value="Crear conductor" />
      </form>
    </article>
  );
};