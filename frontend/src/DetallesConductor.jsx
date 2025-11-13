import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export const DetallesConductor = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [conductor, setConductor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState(null);
  const [kilometros, setKilometros] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAuth(
          `http://localhost:3000/conductores/${id}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al cargar conductor");
        }

        setConductor(data.conductor);

        // Cargar historial
        const histResponse = await fetchAuth(
          `http://localhost:3000/viajes/conductor/${id}`
        );
        const histData = await histResponse.json();
        if (histResponse.ok && histData.success) {
          setHistorial(histData);
        }

        // Cargar kilómetros totales
        const kmResponse = await fetchAuth(
          `http://localhost:3000/viajes/conductor/${id}/kilometros`
        );
        const kmData = await kmResponse.json();
        if (kmResponse.ok && kmData.success) {
          setKilometros(kmData.total_kilometros);
        }

        setLoading(false);
      } catch (error) {
        window.alert("Error al cargar datos");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, fetchAuth]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!conductor) {
    return <p>Conductor no encontrado</p>;
  }

  return (
    <article>
      <h2>Detalles del Conductor</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{conductor.id}</td>
          </tr>
          <tr>
            <th>Nombre</th>
            <td>{conductor.nombre}</td>
          </tr>
          <tr>
            <th>Apellido</th>
            <td>{conductor.apellido}</td>
          </tr>
          <tr>
            <th>DNI</th>
            <td>{conductor.dni}</td>
          </tr>
          <tr>
            <th>Licencia</th>
            <td>{conductor.licencia}</td>
          </tr>
          <tr>
            <th>Vencimiento de Licencia</th>
            <td>
              {new Date(conductor.fecha_vencimiento_licencia).toLocaleDateString()}
            </td>
          </tr>
          {kilometros !== null && (
            <tr>
              <th>Total de Kilómetros</th>
              <td>{kilometros.toFixed(2)} km</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link role="button" to={`/conductores/${id}/modificar`}>
        Modificar
      </Link>

      {historial && historial.viajes && historial.viajes.length > 0 && (
        <div>
          <h3>Historial de Viajes</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha Salida</th>
                <th>Fecha Llegada</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Kilómetros</th>
                <th>Vehículo</th>
              </tr>
            </thead>
            <tbody>
              {historial.viajes.map((viaje) => (
                <tr key={viaje.id}>
                  <td>{new Date(viaje.fecha_salida).toLocaleString()}</td>
                  <td>{new Date(viaje.fecha_llegada).toLocaleString()}</td>
                  <td>{viaje.origen}</td>
                  <td>{viaje.destino}</td>
                  <td>{viaje.kilometros}</td>
                  <td>
                    {viaje.marca} {viaje.modelo} ({viaje.patente})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
};