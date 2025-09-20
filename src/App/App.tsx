import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import css from './App.module.css'
import { createNote, deleteNote, fetchNotes, type CreateNoteProps } from '../services/noteService'
import NoteList from '../NoteList/NoteList'
import { Modal } from '../Modal/Modal'
import { NoteForm } from '../NoteForm/NoteForm'

function App() {
  const queryClient = useQueryClient();

  const [curPage, setCurPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', curPage],
    queryFn: () => fetchNotes('a', curPage),
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



  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {data && data.notes && data.notes.length > 1 &&
            <NoteList notes={data?.notes ?? []} onDelete={handleDelete}
            />}

          <button className={css.button} onClick={handleOpenModal}>Create note +</button>

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

          {isModalOpen && <Modal onClose={handleCloseModal}>
            <NoteForm onCancel={handleCloseModal} onSubmit={handleCreate} />
          </Modal>}
        </header>
      </div>
    </>
  )
}

export default App
