import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import Pagination from '../Pagination/Pagination'
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import { Modal } from '../Modal/Modal'
import { NoteForm } from '../NoteForm/NoteForm'
import { useDebounce } from 'use-debounce'

function App() {
  const [curPage, setCurPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("")

  const [debouncedValue] = useDebounce(searchValue, 500);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', curPage, debouncedValue],
    queryFn: () => fetchNotes(debouncedValue, curPage),
    placeholderData: keepPreviousData
  })

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
    setCurPage(1);
  }


  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch}></SearchBox>



          <button className={css.button} onClick={handleOpenModal}>Create note +</button>

          {isSuccess && data.notes.length > 1 &&
            <Pagination
              pageCount={data?.totalPages ?? 0}
              currentPage={curPage}
              onPageChange={setCurPage}
            />}

          {isModalOpen && <Modal onClose={handleCloseModal}>
            <NoteForm onCancel={handleCloseModal} />
          </Modal>}
        </header>
        {data && data.notes && data.notes.length > 0 &&
          <NoteList notes={data?.notes ?? []}
          />}
      </div>
    </>
  )
}

export default App
