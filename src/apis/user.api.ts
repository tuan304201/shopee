import { User } from 'src/types/user.type'
import { SuccessApi } from './../types/ulti.type'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

const userApi = {
  getUser() {
    return http.get<SuccessApi<User>>('me')
  },
  updateUser(body: BodyUpdateProfile) {
    return http.put<SuccessApi<User>>('user', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessApi<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
