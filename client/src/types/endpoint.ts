export type ParameterType = 'String' | 'Number' | 'Boolean' | 'Object' | 'Array'

// UI에서 사용할 임시 인터페이스
export interface ParameterFieldWithKey {
  key: string
  type: ParameterType
}

export interface Parameter {
  [key: string]: ParameterType
}

export interface Endpoint {
  id: string
  name: string
  userId: number
  script?: string
  parameterType: 'body' | 'query'
  parameter?: Parameter
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  createdAt: Date
  updatedAt: Date
}