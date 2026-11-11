import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { graphql, queries } from '../api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { session, logout } = useAuth();
  const [bibles, setBibles] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [fastings, setFastings] = useState([]);
  const [devotionals, setDevotionals] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState({
    bibles: true,
    prayers: true,
    fastings: true,
    devotionals: true,
    groups: true
  });

  const loadAll = useCallback(async () => {
    if (!session?.token) {
      setBibles([]);
      setPrayers([]);
      setFastings([]);
      setDevotionals([]);
      setGroups([]);
      setLoading({
        bibles: false,
        prayers: false,
        fastings: false,
        devotionals: false,
        groups: false
      });
      return;
    }

    try {
      setLoading({
        bibles: true,
        prayers: true,
        fastings: true,
        devotionals: true,
        groups: true
      });

      const token = session.token;
      const [bibleData, prayerData, fastingData, devotionalData, groupsData] = await Promise.all([
        graphql(queries.bibles, {}, token),
        graphql(queries.prayers, {}, token),
        graphql(queries.fastings, {}, token),
        graphql(queries.devotionals, {}, token),
        graphql(queries.groups, {}, token)
      ]);

      setBibles(bibleData?.bibles || []);
      setPrayers(prayerData?.prayers || []);
      setFastings(fastingData?.fastings || []);
      setDevotionals(devotionalData?.devotionals || []);
      setGroups(groupsData?.groups || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      if (String(err?.message || '').includes('Não autenticado')) {
        logout();
        return;
      }
      setBibles([]);
      setPrayers([]);
      setFastings([]);
      setDevotionals([]);
      setGroups([]);
    } finally {
      setLoading({
        bibles: false,
        prayers: false,
        fastings: false,
        devotionals: false,
        groups: false
      });
    }
  }, [session?.token, logout]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Mutations otimistas
  const addBible = useCallback((newBible) => {
    setBibles(prev => [newBible, ...prev]);
  }, []);

  const addPrayer = useCallback((newPrayer) => {
    setPrayers(prev => [newPrayer, ...prev]);
  }, []);

  const addFasting = useCallback((newFasting) => {
    setFastings(prev => [newFasting, ...prev]);
  }, []);

  const addDevotional = useCallback((newDevotional) => {
    setDevotionals(prev => [newDevotional, ...prev]);
  }, []);

  const addGroup = useCallback((newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
  }, []);

  const updateGroup = useCallback((updatedGroup) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  }, []);

  const removeBible = useCallback((id) => {
    setBibles(prev => prev.filter(b => b.id !== id));
  }, []);

  const removePrayer = useCallback((id) => {
    setPrayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const removeFasting = useCallback((id) => {
    setFastings(prev => prev.filter(f => f.id !== id));
  }, []);

  const removeDevotional = useCallback((id) => {
    setDevotionals(prev => prev.filter(d => d.id !== id));
  }, []);

  const value = {
    bibles,
    prayers,
    fastings,
    devotionals,
    groups,
    loading,
    refresh: loadAll,
    addBible,
    addPrayer,
    addFasting,
    addDevotional,
    addGroup,
    updateGroup,
    removeBible,
    removePrayer,
    removeFasting,
    removeDevotional
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
}

export default DataContext;
