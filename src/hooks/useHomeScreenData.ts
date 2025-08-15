import { useState, useEffect, useContext } from 'react';
import { PerfilContext } from '../context/PerfilContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { HistoryContext }from '../context/HistoryContext';
import {
  getLiveCategories,
  getVodCategories,
  getSeriesCategories,
} from '../services/xtreamService';

// Este hook agora é responsável por buscar apenas os dados iniciais
// e as listas de categorias, não mais o conteúdo de dentro delas.
const useHomeScreenData = () => {
  const { perfilAtivo } = useContext(PerfilContext);
  const { favorites } = useContext(FavoritesContext);
  const { history } = useContext(HistoryContext);

  // Estados para armazenar as categorias
  const [liveCategories, setLiveCategories] = useState([]);
  const [vodCategories, setVodCategories] = useState([]);
  const [seriesCategories, setSeriesCategories] = useState([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função assíncrona para buscar os dados
    const fetchData = async () => {
      if (!perfilAtivo) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Usamos Promise.all para buscar todas as listas de categorias em paralelo
        const [live, vod, series] = await Promise.all([
          getLiveCategories(perfilAtivo),
          getVodCategories(perfilAtivo),
          getSeriesCategories(perfilAtivo),
        ]);

        // Atualiza os estados com as categorias recebidas
        setLiveCategories(live);
        setVodCategories(vod);
        setSeriesCategories(series);

      } catch (err) {
        console.error("Erro ao buscar dados da HomeScreen:", err);
        setError('Não foi possível carregar as categorias.');
      } finally {
        // Finaliza o carregamento, independentemente de sucesso ou erro
        setLoading(false);
      }
    };

    fetchData();
  }, [perfilAtivo]); // O hook é re-executado sempre que o perfil ativo mudar

  return {
    liveCategories,
    vodCategories,
    seriesCategories,
    history,
    favorites,
    loading,
    error,
  };
};

export default useHomeScreenData;
