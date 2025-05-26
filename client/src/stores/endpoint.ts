import type { Endpoint } from '@/types/endpoint'
import { createStore } from '.'
import { endpointApi } from '@/api/endpoint'

export const useEndpointStore = createStore<Endpoint>('endpoint', endpointApi)