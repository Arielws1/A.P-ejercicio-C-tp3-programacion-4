import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export const DetallesViaje = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViaje = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/viajes/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al cargar viaje");
        }

        setViaje(data.viaje);
        setLoading(false);
      } catch (error) {
        window.alert("Error al cargar viaje");
        setLoading(false);
      }
    };

    fetchViaje();
  }, [id, fetchAuth]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!viaje) {
    return <p>Viaje no encontrado</p>;
  }

  return (
    <article>
      <h2>Detalles del Viaje</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{viaje.id}</td>
          </tr>
          <tr>
            <th>Vehículo</th>
            <td>
              {viaje.marca} {viaje.modelo} ({viaje.patente})
            </td>
          </tr>
          <tr>
            <th>Conductor</th>
            <td>
              {viaje.conductor_nombre} {viaje.conductor_apellido} (DNI:{" "}
              {viaje.dni})
            </td>
          </tr>
          <tr>
            <th>Fecha de Salida</th>
            <td>{new Date(viaje.fecha_salida).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Fecha de Llegada</th>
            <td>{new Date(viaje.fecha_llegada).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Origen</th>
            <td>{viaje.origen}</td>
          </tr>
          <tr>
            <th>Destino</th>
            <td>{viaje.destino}</td>
          </tr>
          <tr>
            <th>Kilómetros</th>
            <td>{viaje.kilometros} km</td>
          </tr>
          {viaje.observaciones && (
            <tr>
              <th>Observaciones</th>
              <td>{viaje.observaciones}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link role="button" to={`/viajes/${id}/modificar`}>
        Modificar
      </Link>
    </article>
  );
};