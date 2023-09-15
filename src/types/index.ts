// タスクの型宣言
export type Task = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
}

// csrfトークンの値の型宣言
export type CsrfToken = {
  csrf_token: string
}

// ログイン時の認証情報の型宣言
export type Credential = {
  email: string
  password: string
}
