/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Task } from '../../types'
import useStore from '../../store'
import { useError } from '../hooks/useError'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const { switchErrorHandling } = useError()
  const resetEditedTask = useStore((state) => state.resetEditedTask)

  // タスクの追加
  const createTaskMutation = useMutation(
    (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) =>
      axios.post<Task>(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks`, task),
    {
      // タスクの追加が成功した場合に実行される
      onSuccess: (res) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            [...previousTasks, res.data]
          )
        }
        resetEditedTask()
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.message)
        }
      },
    }
  )

  // タスクの更新
  const updateTaskMutation = useMutation(
    (task: Omit<Task, 'created_at' | 'updated_at'>) =>
      axios.put<Task>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${task.id}`,
        {
          title: task.title,
        }
      ),
    {
      onSuccess: (res, variables) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTasks.map((task) =>
              task.id === variables.id ? res.data : task
            )
          )
        }
        resetEditedTask()
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )

  // タスクの削除
  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${id}`),
    {
      onSuccess: (_, variables) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTasks.filter((task) => task.id !== variables)
          )
        }
        resetEditedTask()
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
