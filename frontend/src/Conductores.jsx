import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Conductores() {
  const { fetchAuth } = useAuth();

  const [conductores, setConductores] = useState([]);

  const fetchConductores = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/conductores");
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.message);
        return;
      }

      setConductores(data.conductores);
    } catch (error) {
      console.error("Error al obtener conductores:", error);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchConductores();
  }, [fetchConductores]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Desea eliminar el conductor?")) {
      try {
        const response = await fetchAuth(
          `http://localhost:3000/conductores/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al eliminar conductor");
        }

        await fetchConductores();
      } catch (error) {
        window.alert("Error al eliminar conductor");
      }
    }
  };

  return (
    <article>
      <h2>Conductores</h2>
      <Link role="button" to="/conductores/crear">
        Nuevo conductor
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Licencia</th>
            <th>Vencimiento Licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.dni}</td>
              <td>{c.licencia}</td>
              <td>
                {new Date(c.fecha_vencimiento_licencia).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td>
                <div>
                  <Link role="button" to={`/conductores/${c.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/conductores/${c.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => handleEliminar(c.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
