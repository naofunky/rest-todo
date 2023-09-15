import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Auth } from './features/Auth/components/Auth'
import { Todo } from './features/Todo/Todo'
import { useEffect } from 'react'
import axios from 'axios'
import { CsrfToken } from './types'

const App = () => {
  // 最初にホームページにきたときにcsrfトークンを取得する
  useEffect(() => {
    axios.defaults.withCredentials = true
    const getCsrfToken = async () => {
      const { data } = await axios.get<CsrfToken>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/csrf`
      )
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token
    }
    getCsrfToken()
  }, [])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
