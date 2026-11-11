import { useState, useCallback, useMemo } from 'react';
import { graphql, mutations } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function useBible() {
  const { session } = useAuth();
  const { addBible, bibles } = useData();
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Lista dos 66 livros da Bíblia com número de capítulos
  const bibleBooks = useMemo(() => [
    { name: 'Gênesis', chapters: 50 },
    { name: 'Êxodo', chapters: 40 },
    { name: 'Levítico', chapters: 27 },
    { name: 'Números', chapters: 36 },
    { name: 'Deuteronômio', chapters: 34 },
    { name: 'Josué', chapters: 24 },
    { name: 'Juízes', chapters: 21 },
    { name: 'Rute', chapters: 4 },
    { name: '1 Samuel', chapters: 31 },
    { name: '2 Samuel', chapters: 24 },
    { name: '1 Reis', chapters: 22 },
    { name: '2 Reis', chapters: 25 },
    { name: '1 Crônicas', chapters: 29 },
    { name: '2 Crônicas', chapters: 36 },
    { name: 'Esdras', chapters: 10 },
    { name: 'Neemias', chapters: 13 },
    { name: 'Ester', chapters: 10 },
    { name: 'Jó', chapters: 42 },
    { name: 'Salmos', chapters: 150 },
    { name: 'Provérbios', chapters: 31 },
    { name: 'Eclesiastes', chapters: 12 },
    { name: 'Cânticos', chapters: 8 },
    { name: 'Isaías', chapters: 66 },
    { name: 'Jeremias', chapters: 52 },
    { name: 'Lamentações', chapters: 5 },
    { name: 'Ezequiel', chapters: 48 },
    { name: 'Daniel', chapters: 12 },
    { name: 'Oséias', chapters: 14 },
    { name: 'Joel', chapters: 3 },
    { name: 'Amós', chapters: 9 },
    { name: 'Obadias', chapters: 1 },
    { name: 'Jônatas', chapters: 4 },
    { name: 'Miqueias', chapters: 7 },
    { name: 'Naum', chapters: 3 },
    { name: 'Habacuque', chapters: 3 },
    { name: 'Sofonias', chapters: 3 },
    { name: 'Ageu', chapters: 2 },
    { name: 'Zacarias', chapters: 14 },
    { name: 'Malaquias', chapters: 4 },
    { name: 'Mateus', chapters: 28 },
    { name: 'Marcos', chapters: 16 },
    { name: 'Lucas', chapters: 24 },
    { name: 'João', chapters: 21 },
    { name: 'Atos', chapters: 28 },
    { name: 'Romanos', chapters: 16 },
    { name: '1 Coríntios', chapters: 16 },
    { name: '2 Coríntios', chapters: 13 },
    { name: 'Gálatas', chapters: 6 },
    { name: 'Efésios', chapters: 6 },
    { name: 'Filipenses', chapters: 4 },
    { name: 'Colossenses', chapters: 4 },
    { name: '1 Tessalonicenses', chapters: 5 },
    { name: '2 Tessalonicenses', chapters: 3 },
    { name: '1 Timóteo', chapters: 6 },
    { name: '2 Timóteo', chapters: 4 },
    { name: 'Tito', chapters: 3 },
    { name: 'Filémon', chapters: 1 },
    { name: 'Hebreus', chapters: 13 },
    { name: 'Tiago', chapters: 5 },
    { name: '1 Pedro', chapters: 5 },
    { name: '2 Pedro', chapters: 3 },
    { name: '1 João', chapters: 5 },
    { name: '2 João', chapters: 1 },
    { name: '3 João', chapters: 1 },
    { name: 'Judas', chapters: 1 },
    { name: 'Apocalipse', chapters: 22 }
  ], []);

  const totalChapters = useMemo(() =>
    bibleBooks.reduce((sum, book) => sum + book.chapters, 0),
    [bibleBooks]
  );

  const chaptersForSelectedBook = useMemo(() => {
    if (!selectedBook) return [];
    const book = bibleBooks.find(b => b.name === selectedBook);
    if (!book) return [];
    return Array.from({ length: book.chapters }, (_, i) => i + 1);
  }, [selectedBook, bibleBooks]);

  const resetForm = useCallback(() => {
    setSelectedBook('');
    setSelectedChapter('');
    setVerse('');
    setNotes('');
    setFeedback('');
  }, []);

  const saveReading = useCallback(async () => {
    if (!selectedBook || !selectedChapter) {
      setFeedback('Selecione livro e capítulo');
      return;
    }

    if (!session?.token) {
      setFeedback('Você precisa estar logado para salvar');
      return;
    }

    setIsSaving(true);
    setFeedback('Salvando...');

    try {
      const input = {
        book: selectedBook,
        chapter: parseInt(selectedChapter),
        verse: verse.trim() || null,
        notes: notes.trim() || null
      };

      const response = await graphql(mutations.createBible, { bible: input }, session.token);
      const savedBible = response.createBible;

      addBible(savedBible);
      setFeedback('Leitura registrada com sucesso!');

      setTimeout(() => resetForm(), 1500);
    } catch (err) {
      console.error('Erro ao salvar leitura:', err);
      setFeedback('Erro ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [selectedBook, selectedChapter, verse, notes, session?.token, addBible, resetForm]);

  // Estatísticas
  const uniqueReadings = useMemo(() => {
    const seen = new Set();
    bibles.forEach(b => {
      const key = `${b.book}-${b.chapter}`;
      seen.add(key);
    });
    return seen.size;
  }, [bibles]);

  const progressPercent = useMemo(() => {
    return Math.min(Math.round((uniqueReadings / totalChapters) * 100), 100);
  }, [uniqueReadings, totalChapters]);

  const todayReadings = bibles.filter(b => {
    const readingDate = new Date(b.created_at);
    const today = new Date();
    return readingDate.toDateString() === today.toDateString();
  }).length;

  const weekReadings = bibles.filter(b => {
    const readingDate = new Date(b.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return readingDate >= weekAgo;
  }).length;

  const monthReadings = bibles.filter(b => {
    const readingDate = new Date(b.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return readingDate >= monthAgo;
  }).length;

  const booksRead = useMemo(() => {
    const books = new Set();
    bibles.forEach(b => books.add(b.book));
    return books.size;
  }, [bibles]);

  const lastReading = bibles[0];

  const readingStreak = useMemo(() => {
    if (bibles.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      const hasReading = bibles.some(b => {
        const readingDate = new Date(b.created_at);
        readingDate.setHours(0, 0, 0, 0);
        return readingDate.getTime() === checkDate.getTime();
      });

      if (hasReading) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  }, [bibles]);

  return {
    bibleBooks,
    selectedBook,
    setSelectedBook,
    selectedChapter,
    setSelectedChapter,
    verse,
    setVerse,
    notes,
    setNotes,
    chaptersForSelectedBook,
    feedback,
    isSaving,
    saveReading,
    resetForm,
    progressPercent,
    uniqueReadings,
    totalChapters,
    todayReadings,
    weekReadings,
    monthReadings,
    booksRead,
    readingStreak,
    lastReading,
    bibles
  };
}

export default useBible;
