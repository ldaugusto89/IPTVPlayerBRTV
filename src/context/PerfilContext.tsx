import React, { createContext, useContext, useEffect, useState } from 'react';
import { ListaPerfil } from '../../@types/navigation';
import { getPerfis, getUltimoPerfilId, salvarUltimoPerfil } from '../lib/listaStorage';

type PerfilContextData = {
  perfilSelecionado: ListaPerfil | null;
  setPerfilSelecionado: (perfil: ListaPerfil) => void;
};

const PerfilContext = createContext<PerfilContextData>({
  perfilSelecionado: null,
  setPerfilSelecionado: () => {},
});

export const PerfilProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfilSelecionado, setPerfilSelecionadoState] = useState<ListaPerfil | null>(null);

  useEffect(() => {
    async function carregarPerfil() {
      const ultimoId = await getUltimoPerfilId();
      if (!ultimoId) return;

      const perfis = await getPerfis();
      const encontrado = perfis.find(p => p.id === ultimoId);
      if (encontrado) {
        setPerfilSelecionadoState(encontrado);
      }
    }

    carregarPerfil();
  }, []);

  const setPerfilSelecionado = (perfil: ListaPerfil) => {
    setPerfilSelecionadoState(perfil);
    salvarUltimoPerfil(perfil.id);
  };

  return (
    <PerfilContext.Provider value={{ perfilSelecionado, setPerfilSelecionado }}>
      {children}
    </PerfilContext.Provider>
  );
};

export function usePerfil() {
  return useContext(PerfilContext);
}