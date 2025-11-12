import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Vehiculos() {
  const { fetchAuth } = useAuth();

  const [vehiculos, setVehiculos] = useState([]);

  const fetchVehiculos = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/vehiculos");
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.message);
        return;
      }

      setVehiculos(data.vehiculos);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Desea eliminar el vehículo?")) {
      try {
        const response = await fetchAuth(
          `http://localhost:3000/vehiculos/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al eliminar vehículo");
        }

        await fetchVehiculos();
      } catch (error) {
        window.alert("Error al eliminar vehículo");
      }
    }
  };

  return (
    <article>
      <h2>Vehículos</h2>
      <Link role="button" to="/vehiculos/crear">
        Nuevo vehículo
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th>Capacidad de Carga (kg)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.patente}</td>
              <td>{v.año}</td>
              <td>{v.capacidad_carga}</td>
              <td>
                <div>
                  <Link role="button" to={`/vehiculos/${v.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/vehiculos/${v.id}/modificar`}>
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