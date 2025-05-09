export type ParameterType = 'String' | 'Number' | 'Boolean' | 'Object' | 'Array'

// UI에서 사용할 임시 인터페이스
export interface ParameterFieldWithKey {
  key: string
  type: ParameterType
  required?: boolean
}

export interface Parameter {
  [key: string]: {
    type: ParameterType
    required?: boolean
  }
}

export interface Endpoint {
  id: string
  name: string
  userId: number
  script?: string
  parameter?: Parameter
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  createdAt: Date
  updatedAt: Date
}