import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import Pagination from '../Pagination/Pagination'
import css from './App.module.css'
import { createNote, deleteNote, fetchNotes, type CreateNoteProps } from '../../services/noteService'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import { Modal } from '../Modal/Modal'
import { NoteForm } from '../NoteForm/NoteForm'
import { useDebouncedCallback } from 'use-debounce'

function App() {
  const queryClient = useQueryClient();

  const [curPage, setCurPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("")

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', curPage, searchValue],
    queryFn: () => fetchNotes(searchValue, curPage),
    placeholderData: keepPreviousData
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNoteProps) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setIsModalOpen(false)
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  }

  const handleCreate = (data: CreateNoteProps) => {
    createMutation.mutate(data)
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchValue(query)
  }, 500)


  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch}></SearchBox>
          {data && data.notes && data.notes.length > 1 &&
            <NoteList notes={data?.notes ?? []} onDelete={handleDelete}
            />}

          {isLoading && <button className={css.button} onClick={handleOpenModal}>Create note +</button>}

          {isSuccess && data.notes.length > 0 &&
            <Pagination
              pageCount={data?.totalPages ?? 0}
              currentPage={curPage}
              onPageChange={setCurPage}
            />}

          {isModalOpen && <Modal onClose={handleCloseModal}>
            <NoteForm onCancel={handleCloseModal} onSubmit={handleCreate} />
          </Modal>}
        </header>
      </div>
    </>
  )
}

export default App
