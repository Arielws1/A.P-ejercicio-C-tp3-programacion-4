import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarConductor = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [errores, setErrores] = useState(null);
  const [loading, setLoading] = useState(true);

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    fecha_vencimiento_licencia: "",
  });

  useEffect(() => {
    const fetchConductor = async () => {
      try {
        const response = await fetchAuth(
          `http://localhost:3000/conductores/${id}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al cargar conductor");
        }

        const fecha = new Date(data.conductor.fecha_vencimiento_licencia)
          .toISOString()
          .split("T")[0];

        setValues({
          nombre: data.conductor.nombre,
          apellido: data.conductor.apellido,
          dni: data.conductor.dni,
          licencia: data.conductor.licencia,
          fecha_vencimiento_licencia: fecha,
        });
        setLoading(false);
      } catch (error) {
        window.alert("Error al cargar conductor");
        setLoading(false);
      }
    };

    fetchConductor();
  }, [id, fetchAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    const response = await fetchAuth(
      `http://localhost:3000/conductores/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        if (data.errores) {
          return setErrores(data.errores);
        }
        return window.alert(data.error || "Error al modificar conductor");
      }
      return window.alert("Error al modificar conductor");
    }
    navigate("/conductores");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <article>
      <h2>Modificar conductor</h2>
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
        <input type="submit" value="Modificar conductor" />
      </form>
    </article>
  );
};