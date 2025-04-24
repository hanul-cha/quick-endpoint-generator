export interface Endpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  schemaId: string
  schema?: {
    id: string
    name: string
  }
}