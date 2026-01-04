import { Usuario } from "@/api/remoto/types";
import ProyectoCard, { cardAñadir, cardColors, cardProyecto } from "@/components/ProyectoCard";
import { useNavigate } from "react-router-dom";

interface data {
  usuario: Usuario | null;
}
export function ProyectosPage({ usuario }: data) {

  const navigator = useNavigate();
  return (
    <div className="proyectos-page">
      <h1>Todos los Proyectos</h1>
      <div className="proyectos-list">
        {cardAñadir(navigator)}
        {
          usuario?.proyectos.sort((a, b) => new Date(b.lastEdit).getTime() - new Date(a.lastEdit).getTime())
            .map(proyecto => cardProyecto(proyecto, navigator))}
      </div>
    </div>
  );
}
