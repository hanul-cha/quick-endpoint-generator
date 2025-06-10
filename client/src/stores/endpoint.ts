import type { Endpoint } from '@/types/endpoint'
import { createStore } from '.'
import { endpointApi } from '@/api/endpoint'

export const useEndpointStore = createStore<Endpoint>('endpoint', endpointApi, [
  {
    id: 'Default_endpoint_1',
    name: 'Find all table',
    userId: 1,
    script: `function main(params, repo) {
return repo.table.find()
}`,
    method: 'GET',
    parameter: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_2',
    name: 'Create table',
    userId: 1,
    script: `function main(params, repo) {
return repo.table.create({
  name: params.name
})
}`,
    method: 'POST',
    parameter: { name: { type: 'String', required: true } },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_3',
    name: 'Delete table',
    userId: 1,
    script: `function main(params, repo) {
return repo.table.delete({ id: params.id })
}`,
    method: 'DELETE',
    parameter: { id: { type: 'String', required: true } },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_4',
    name: 'Update table',
    userId: 1,
    script: `function main(params, repo) {
return repo.table.update(params.id, { name: params.name })
}`,
    method: 'PUT',
    parameter: {
      id: { type: 'String', required: true },
      name: { type: 'String', required: true },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_5',
    name: 'Create row',
    userId: 1,
    script: `function main(params, repo) {
repo.row.create({
  dataTableId: 'Default_table',
  values: {
    '1': params.title
  }
})
}`,
    method: 'POST',
    parameter: {
      title: { type: 'String', required: true },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_6',
    name: 'Delete row',
    userId: 1,
    script: `function main(params, repo) {
repo.row.delete({ id: params.rowId })
}`,
    method: 'DELETE',
    parameter: {
      rowId: { type: 'String', required: true },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_7',
    name: 'Update row title',
    userId: 1,
    script: `async function main(params, repo) {
const updateData = {
  id: params.id,
  '1': params.title,
}
await repo.row.updateByEntities([updateData])
}`,
    method: 'PUT',
    parameter: {
      id: { type: 'String', required: true },
      title: { type: 'String', required: true },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'Default_endpoint_8',
    name: 'Update all row count',
    userId: 1,
    script: `async function main(params, repo) {
await repo.row.updateByWhere({
  dataTableId: params.tableId
}, {
  '2': params.count
})
}`,
    method: 'PUT',
    parameter: {
      tableId: { type: 'String', required: true },
      count: { type: 'Number', required: true },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])