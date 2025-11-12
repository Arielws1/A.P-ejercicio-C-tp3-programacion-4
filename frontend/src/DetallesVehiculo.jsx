import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export const DetallesVehiculo = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState(null);
  const [kilometros, setKilometros] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAuth(
          `http://localhost:3000/vehiculos/${id}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al cargar vehículo");
        }

        setVehiculo(data.vehiculo);

        // Cargar historial
        const histResponse = await fetchAuth(
          `http://localhost:3000/viajes/vehiculo/${id}`
        );
        const histData = await histResponse.json();
        if (histResponse.ok && histData.success) {
          setHistorial(histData);
        }

        // Cargar kilómetros totales
        const kmResponse = await fetchAuth(
          `http://localhost:3000/viajes/vehiculo/${id}/kilometros`
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

  if (!vehiculo) {
    return <p>Vehículo no encontrado</p>;
  }

  return (
    <article>
      <h2>Detalles del Vehículo</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{vehiculo.id}</td>
          </tr>
          <tr>
            <th>Marca</th>
            <td>{vehiculo.marca}</td>
          </tr>
          <tr>
            <th>Modelo</th>
            <td>{vehiculo.modelo}</td>
          </tr>
          <tr>
            <th>Patente</th>
            <td>{vehiculo.patente}</td>
          </tr>
          <tr>
            <th>Año</th>
            <td>{vehiculo.año}</td>
          </tr>
          <tr>
            <th>Capacidad de Carga</th>
            <td>{vehiculo.capacidad_carga} kg</td>
          </tr>
          {kilometros !== null && (
            <tr>
              <th>Total de Kilómetros</th>
              <td>{kilometros.toFixed(2)} km</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link role="button" to={`/vehiculos/${id}/modificar`}>
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
                <th>Conductor</th>
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
                    {viaje.conductor_nombre} {viaje.conductor_apellido}
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