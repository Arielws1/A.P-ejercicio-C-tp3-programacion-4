import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearVehiculo = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    marca: "",
    modelo: "",
    patente: "",
    año: "",
    capacidad_carga: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        año: parseInt(values.año),
        capacidad_carga: parseFloat(values.capacidad_carga),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        if (data.errores) {
          return setErrores(data.errores);
        }
        return window.alert(data.error || "Error al crear vehículo");
      }
      return window.alert("Error al crear vehículo");
    }
    navigate("/vehiculos");
  };

  return (
    <article>
      <h2>Crear vehículo</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Marca
            <input
              required
              value={values.marca}
              onChange={(e) =>
                setValues({ ...values, marca: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "marca")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "marca")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Modelo
            <input
              required
              value={values.modelo}
              onChange={(e) =>
                setValues({ ...values, modelo: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "modelo")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "modelo")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Patente
            <input
              required
              value={values.patente}
              onChange={(e) =>
                setValues({ ...values, patente: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "patente")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "patente")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Año
            <input
              required
              type="number"
              min="1900"
              max="2100"
              value={values.año}
              onChange={(e) =>
                setValues({ ...values, año: e.target.value })
              }
              aria-invalid={errores && errores.some((e) => e.path === "año")}
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "año")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Capacidad de Carga (kg)
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={values.capacidad_carga}
              onChange={(e) =>
                setValues({ ...values, capacidad_carga: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "capacidad_carga")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "capacidad_carga")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
        </fieldset>
        <input type="submit" value="Crear vehículo" />
      </form>
    </article>
  );
};