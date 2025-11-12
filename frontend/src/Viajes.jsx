import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Viajes() {
  const { fetchAuth } = useAuth();

  const [viajes, setViajes] = useState([]);

  const fetchViajes = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/viajes");
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.message);
        return;
      }

      setViajes(data.viajes);
    } catch (error) {
      console.error("Error al obtener viajes:", error);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Desea eliminar el viaje?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al eliminar viaje");
        }

        await fetchViajes();
      } catch (error) {
        window.alert("Error al eliminar viaje");
      }
    }
  };

  return (
    <article>
      <h2>Viajes</h2>
      <Link role="button" to="/viajes/crear">
        Nuevo viaje
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Salida</th>
            <th>Fecha Llegada</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Kilómetros</th>
            <th>Vehículo</th>
            <th>Conductor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{new Date(v.fecha_salida).toLocaleString()}</td>
              <td>{new Date(v.fecha_llegada).toLocaleString()}</td>
              <td>{v.origen}</td>
              <td>{v.destino}</td>
              <td>{v.kilometros}</td>
              <td>
                {v.marca} {v.modelo} ({v.patente})
              </td>
              <td>
                {v.conductor_nombre} {v.conductor_apellido}
              </td>
              <td>
                <div>
                  <Link role="button" to={`/viajes/${v.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/viajes/${v.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => handleEliminar(v.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}