import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import css from './App.module.css'
import { fetchNotes } from '../services/noteService'
import NoteList from '../NoteList/NoteList'

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes'],
    queryFn: () => fetchNotes('ang'),
  })

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <NoteList notes={data?.notes} />
          {/* Компонент SearchBox */}
          {/* Пагінація */}
          {/* Кнопка створення нотатки */}
        </header>
      </div>
    </>
  )
}

export default App
