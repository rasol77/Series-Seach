import { useState } from "react";

const SeriesSearch = () => {
  const [name, setName] = useState("");
  const [, setStatus] = useState("");

  const [page, setPage] = useState(null);
  const [prevPag] = useState(null);
  const [nextPag] = useState(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Vaciamos el array.
    setData(null);

    //Dejamos el valor de cargar a 'true'.
    setLoading(true);

    //Vaciamos el error.
    setError(null);

    try {
      //Función de respuesta.
      let response;

      if (e.target.matches("form")) {
        response = await fetch(
          `https://www.episodate.com/api/search?q=${name}&page=${page}`
        );
        //La página en su valor inicial
        setPage(1);
      } else if (e.target.matches("button.prevPag")) {
        response = await fetch(prevPag);

        setPage(page - 1);
      } else if (e.target.matches("button.nextPag")) {
        response = await fetch(nextPag);

        setPage(page - 1);
      }
      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        setError(data?.error || "Unknown error");
      }
    } catch (error) {
      setError(error.message || "Uknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name "
          name="name"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="name">Estado:</label>
        <select
          id="status "
          name="status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Cualquiera</option>
          <option value="Running">Emisión</option>
          <option value="Endend">Terminada</option>
          <option value="Canceled/Ended">Cancelada</option>
          <option value="To Be Determined"> Pendiente de Continuar</option>
        </select>

        <button disabled={loading}>{loading ? "Cargando..." : "Cargar"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      {data && (
        <>
          {" "}
          <div className="grid"></div>
          <ul>
            {data.tv_shows.map((shows) => {
              return (
                <li key={shows.id}>
                  <img
                    src={shows.image_thumbnail_path}
                    alt="Imagen de una serie"
                  />
                  <p> {shows.name}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
};

export default SeriesSearch;
