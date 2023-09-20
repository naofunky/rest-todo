/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Task } from '../../types'
import { useError } from '../hooks/useError'

export const useQueryTasks = () => {
  const { switchErrorHandling } = useError()

  // タスクの一覧を取得
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      `${import.meta.env.VITE_REACT_APP_API_URL}/tasks`,
      { withCredentials: true }
    )
    return data
  }

  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: Infinity,
    onError: (error: any) => {
      if (error.response.data.message) {
        switchErrorHandling(error.response.data.message)
      } else {
        switchErrorHandling(error.message)
      }
    },
  })
}
