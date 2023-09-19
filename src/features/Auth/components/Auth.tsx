import { useState, FormEvent, FocusEvent } from 'react'
import {
  CheckBadgeIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid'
import { useMutateAuth } from '../../hooks/useMutateAuth'

export const Auth = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [iconDisabled, setIconDisabled] = useState<boolean>(true)
  const [errTextEmail, setErrTextEmail] = useState<boolean>(false)
  const [errTextPassword, setErrTextPassword] = useState<boolean>(false)
  const { loginMutation, registerMutation } = useMutateAuth()

  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      loginMutation.mutate({
        email: email,
        password: password,
      })
    } else {
      await registerMutation
        .mutateAsync({
          email: email,
          password: password,
        })
        .then(() =>
          loginMutation.mutate({
            email: email,
            password: password,
          })
        )
    }
  }

  // passwordの表示・非表示を切り替える
  const toggleIconHandler = () => {
    setIconDisabled(!iconDisabled)
    return iconDisabled
  }

  // メールinputフォーカスが外れた時にエラーメッセージを制御
  const onBlurEmail = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value === '') {
      setErrTextEmail(true)
    } else {
      setErrTextEmail(false)
    }
    return errTextEmail
  }

  // パスワードinputフォーカスが外れた時にエラーメッセージを制御
  const onBlurPassword = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value === '') {
      setErrTextPassword(true)
    } else {
      setErrTextPassword(false)
    }
    return errTextPassword
  }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center">
        <CheckBadgeIcon className="w-8 h-8 text-blue-500" />
        <span className="text-center text-3xl font-extrabold">
          Todo app by React/Go(Echo)
        </span>
      </div>
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>
      <form onSubmit={(e) => submitAuthHandler(e)}>
        <div className="h-20">
          <input
            className="px-3 text-sm py-2 border rounded-lg border-gray-300"
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => onBlurEmail(e)}
            value={email}
            required
          />
          {errTextEmail ? (
            <div className="text-sm text-red-600 px-3 py-2">
              emailを入力してください
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="relative h-20">
          <input
            className="px-3 text-sm py-2 border rounded-lg border-gray-300 relative"
            name="password"
            type={iconDisabled ? 'password' : 'text'}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => onBlurPassword(e)}
            value={password}
            required
          />
          {iconDisabled ? (
            <EyeIcon
              className="w-4 h-4 absolute top-3 right-2 cursor-pointer"
              onClick={() => toggleIconHandler()}
            />
          ) : (
            <EyeSlashIcon
              className="w-4 h-4 absolute top-3 right-2 cursor-pointer"
              onClick={() => toggleIconHandler()}
            />
          )}
          {errTextPassword ? (
            <div className="text-sm text-red-600 px-3 py-2">
              passwordを入力してください
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="flex justify-center my-2">
          <button
            className="disabled:opacity-40 py-2 px-4 rounded-lg text-white bg-indigo-600"
            disabled={!email || !password}
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
      <ArrowPathIcon
        onClick={() => setIsLogin(!isLogin)}
        className="h-6 w-6 my-2 text-blue-500 cursor-pointer"
      />
    </div>
  )
}
