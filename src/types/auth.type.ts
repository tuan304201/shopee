import { User } from './user.type'
import { SuccessApi } from './ulti.type'

export type AuthResponse = SuccessApi<{
  access_token: string
  expire: string
  user: User
}>
