import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearViaje = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);

  const [values, setValues] = useState({
    vehiculo_id: "",
    conductor_id: "",
    fecha_salida: "",
    fecha_llegada: "",
    origen: "",
    destino: "",
    kilometros: "",
    observaciones: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [vehResponse, condResponse] = await Promise.all([
          fetchAuth("http://localhost:3000/vehiculos"),
          fetchAuth("http://localhost:3000/conductores"),
        ]);

        const vehData = await vehResponse.json();
        const condData = await condResponse.json();

        if (vehResponse.ok && vehData.success) {
          setVehiculos(vehData.vehiculos);
        }
        if (condResponse.ok && condData.success) {
          setConductores(condData.conductores);
        }
      } catch (error) {
        console.error("Error al cargar opciones:", error);
      }
    };

    fetchOptions();
  }, [fetchAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrores(null);

    const fechaSalida = new Date(values.fecha_salida).toISOString();
    const fechaLlegada = new Date(values.fecha_llegada).toISOString();

    const response = await fetchAuth("http://localhost:3000/viajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        vehiculo_id: parseInt(values.vehiculo_id),
        conductor_id: parseInt(values.conductor_id),
        fecha_salida: fechaSalida,
        fecha_llegada: fechaLlegada,
        kilometros: parseFloat(values.kilometros),
        observaciones: values.observaciones || null,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        if (data.errores) {
          return setErrores(data.errores);
        }
        return window.alert(data.error || "Error al crear viaje");
      }
      return window.alert("Error al crear viaje");
    }
    navigate("/viajes");
  };

  return (
    <article>
      <h2>Crear viaje</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Vehículo
            <select
              required
              value={values.vehiculo_id}
              onChange={(e) =>
                setValues({ ...values, vehiculo_id: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "vehiculo_id")
              }
            >
              <option value="">Seleccione un vehículo</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} - {v.patente}
                </option>
              ))}
            </select>
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "vehiculo_id")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Conductor
            <select
              required
              value={values.conductor_id}
              onChange={(e) =>
                setValues({ ...values, conductor_id: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "conductor_id")
              }
            >
              <option value="">Seleccione un conductor</option>
              {conductores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido} - DNI: {c.dni}
                </option>
              ))}
            </select>
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "conductor_id")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Fecha y Hora de Salida
            <input
              required
              type="datetime-local"
              value={values.fecha_salida}
              onChange={(e) =>
                setValues({ ...values, fecha_salida: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "fecha_salida")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "fecha_salida")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Fecha y Hora de Llegada
            <input
              required
              type="datetime-local"
              value={values.fecha_llegada}
              onChange={(e) =>
                setValues({ ...values, fecha_llegada: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "fecha_llegada")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "fecha_llegada")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Origen
            <input
              required
              value={values.origen}
              onChange={(e) =>
                setValues({ ...values, origen: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "origen")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "origen")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Destino
            <input
              required
              value={values.destino}
              onChange={(e) =>
                setValues({ ...values, destino: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "destino")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "destino")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Kilómetros
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={values.kilometros}
              onChange={(e) =>
                setValues({ ...values, kilometros: e.target.value })
              }
              aria-invalid={
                errores && errores.some((e) => e.path === "kilometros")
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((e) => e.path === "kilometros")
                  .map((e) => e.msg)
                  .join(", ")}
              </small>
            )}
          </label>
          <label>
            Observaciones
            <textarea
              value={values.observaciones}
              onChange={(e) =>
                setValues({ ...values, observaciones: e.target.value })
              }
              rows="3"
            />
          </label>
        </fieldset>
        <input type="submit" value="Crear viaje" />
      </form>
    </article>
  );
};