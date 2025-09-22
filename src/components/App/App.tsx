import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import Pagination from '../Pagination/Pagination'
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import { Modal } from '../Modal/Modal'
import { NoteForm } from '../NoteForm/NoteForm'
import { useDebouncedCallback } from 'use-debounce'

function App() {
  const [curPage, setCurPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("")

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', curPage, searchValue],
    queryFn: () => fetchNotes(searchValue, curPage),
    placeholderData: keepPreviousData
  })

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchValue(query);
    setCurPage(1);
  }, 500)


  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch}></SearchBox>

          {data && data.notes && data.notes.length > 0 &&
            <NoteList notes={data?.notes ?? []}
            />}

          <button className={css.button} onClick={handleOpenModal}>Create note +</button>

          {isSuccess && data.notes.length > 0 &&
            <Pagination
              pageCount={data?.totalPages ?? 0}
              currentPage={curPage}
              onPageChange={setCurPage}
            />}

          {isModalOpen && <Modal onClose={handleCloseModal}>
            <NoteForm onCancel={handleCloseModal} />
          </Modal>}
        </header>
      </div>
    </>
  )
}

export default App
