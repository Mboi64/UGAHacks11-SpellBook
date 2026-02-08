import { useState, useEffect } from 'react';
import { Bookshelf } from './components/Bookshelf';
import { NoteEditor } from './components/NoteEditor';
import { BookOpeningAnimation } from './components/BookOpeningAnimation';
import { Book } from './types';
import { addPageWritten } from './utils/taskTracking';

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        title: 'Potions & Chemistry',
        color: '#8B4513',
        accentColor: '#D4AF37',
        notes: '',
      },
      {
        id: '2',
        title: 'Ancient Runes & History',
        color: '#4A0E4E',
        accentColor: '#9D50BB',
        notes: '',
      },
      {
        id: '3',
        title: 'Arithmancy & Mathematics',
        color: '#0F4C5C',
        accentColor: '#5FA8D3',
        notes: '',
      },
    ];
  });
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openingBook, setOpeningBook] = useState<Book | null>(null);
  const [closingBook, setClosingBook] = useState<Book | null>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleSelectBook = (book: Book) => {
    setOpeningBook(book);
  };

  const handleAnimationComplete = () => {
    setSelectedBook(openingBook);
    setOpeningBook(null);
  };

  const handleCloseBook = () => {
    setClosingBook(selectedBook);
    setSelectedBook(null);
  };

  const handleClosingAnimationComplete = () => {
    setClosingBook(null);
  };

  const handleSaveNotes = (bookId: string, notes: string) => {
    const oldBook = books.find(book => book.id === bookId);
    const oldNotes = oldBook?.notes || '';
    
    // Only track pages if the notes actually changed
    if (oldNotes === notes) {
      return; // No changes, don't update anything
    }
    
    // Count pages based on character count (500 characters per page)
    // This ensures pages have substantial content (minimum 30 chars is way below this threshold)
    const oldCharCount = oldNotes.trim().length;
    const newCharCount = notes.trim().length;
    
    // Only count if the content has meaningful text (at least 30 characters)
    const oldPages = oldCharCount >= 30 ? Math.floor(oldCharCount / 500) : 0;
    const newPages = newCharCount >= 30 ? Math.floor(newCharCount / 500) : 0;
    
    // If user wrote a new page, track it
    if (newPages > oldPages) {
      const pagesWritten = newPages - oldPages;
      for (let i = 0; i < pagesWritten; i++) {
        addPageWritten();
      }
    }
    
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, notes } : book
    ));
  };

  const handleAddBook = (title: string, color: string, accentColor: string) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      color,
      accentColor,
      notes: '',
    };
    setBooks([...books, newBook]);
    setIsAddingBook(false);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
    }
  };

  const handleReorderBooks = (dragIndex: number, hoverIndex: number) => {
    const newBooks = [...books];
    const [draggedBook] = newBooks.splice(dragIndex, 1);
    newBooks.splice(hoverIndex, 0, draggedBook);
    setBooks(newBooks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {openingBook ? (
        <BookOpeningAnimation
          book={openingBook}
          onAnimationComplete={handleAnimationComplete}
        />
      ) : closingBook ? (
        <BookOpeningAnimation
          book={closingBook}
          onAnimationComplete={handleClosingAnimationComplete}
          isClosing={true}
        />
      ) : !selectedBook ? (
        <Bookshelf
          books={books}
          onSelectBook={handleSelectBook}
          onAddBook={() => setIsAddingBook(true)}
          isAddingBook={isAddingBook}
          onCancelAddBook={() => setIsAddingBook(false)}
          onConfirmAddBook={handleAddBook}
          onDeleteBook={handleDeleteBook}
          onReorderBooks={handleReorderBooks}
        />
      ) : (
        <NoteEditor
          book={selectedBook}
          onClose={handleCloseBook}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
}
