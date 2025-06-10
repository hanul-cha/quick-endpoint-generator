import { api } from './client'
import { useEndpointStore } from '@/stores/endpoint'
import { useRowStore } from '@/stores/row'
import { useTableStore } from '@/stores/table'

type TokenResponse = {
  access_token?: string
}

const storeList = [
  useEndpointStore,
  useRowStore,
  useTableStore,
]

class AuthApi {
  private setToken(response: TokenResponse): boolean {
    if (response?.access_token) {
      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, response.access_token)
      return true
    }

    return false
  }

  private resetStore() {
    storeList.forEach(store => store().resetStore())
  }

  async register(data: {
    email: string
    password: string
    name: string
  }): Promise<boolean> {
    const response = await api.post<TokenResponse>('/auth/signup', data)

    return this.setToken(response)
  }

  async signin(data: {
    email: string
    password: string
  }): Promise<boolean> {
    const response = await api.post<TokenResponse>('/auth/signin', data)

    return this.setToken(response)
  }

  logout() {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY)
    this.resetStore()
  }
}

export const authApi = new AuthApi()