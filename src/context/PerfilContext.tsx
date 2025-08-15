import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ListaPerfil } from '../../@types/navigation'; // Importando a interface

// Define a forma do nosso contexto
interface PerfilContextType {
  perfis: ListaPerfil[];
  setPerfis: React.Dispatch<React.SetStateAction<ListaPerfil[]>>;
  activeProfile: ListaPerfil | null; // <-- NOVO: Perfil ativo
  setActiveProfile: (perfil: ListaPerfil | null) => void; // <-- NOVO: Função para definir o perfil ativo
}

// Cria o contexto
const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

// Define as props do nosso provider
interface PerfilProviderProps {
  children: ReactNode;
}

export const PerfilProvider = ({ children }: PerfilProviderProps) => {
  const [perfis, setPerfis] = useState<ListaPerfil[]>([]);
  const [activeProfile, setActiveProfile] = useState<ListaPerfil | null>(null); // <-- NOVO ESTADO

  return (
    <PerfilContext.Provider value={{ perfis, setPerfis, activeProfile, setActiveProfile }}>
      {children}
    </PerfilContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (context === undefined) {
    throw new Error('usePerfil deve ser usado dentro de um PerfilProvider');
  }
  return context;
};
