import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import css from './App.module.css'
import { deleteNote, fetchNotes } from '../services/noteService'
import NoteList from '../NoteList/NoteList'

function App() {
  const queryClient = useQueryClient();

  const [curPage, setCurPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', curPage],
    queryFn: () => fetchNotes('a', curPage),
    placeholderData: keepPreviousData
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notes']})
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  }

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {data && data.notes && data.notes.length > 1 &&
          <NoteList notes={data?.notes ?? []} onDelete={handleDelete} />}
          {/* Компонент SearchBox */}
          {isSuccess && data.notes.length > 1 &&
            <ReactPaginate
            pageCount={data?.totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurPage(selected + 1)}
            forcePage={curPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />}
          {/* Кнопка створення нотатки */}
        </header>
      </div>
    </>
  )
}

export default App
