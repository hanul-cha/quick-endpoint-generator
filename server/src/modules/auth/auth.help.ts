import { AuthService } from './auth.service'
import { DataColumnType } from '../data-table/data-table.entity'
import { Endpoint } from '../endpoint/endpoint.entity'
import { GlobalPrimitive } from 'src/app.types'

export async function createDefaultData(
  userId: number,
  authService: AuthService,
) {
  const dataTable = await authService.dataTableService.create(
    'Default table',
    [
      {
        id: '1',
        name: 'Title',
        type: DataColumnType.String,
      },
      {
        id: '2',
        name: 'Count',
        type: DataColumnType.Number,
      },
      {
        id: '3',
        name: 'IsActive',
        type: DataColumnType.Boolean,
      },
    ],
    userId,
  )

  await authService.dataRowService.create(dataTable.id, {
    '1': 'Default title',
    '2': 0,
    '3': true,
  })

  const endpoints: Partial<Endpoint>[] = [
    {
      name: 'Find all table',
      userId,
      script: `function main(params, repo) {
  return repo.table.find()
}`,
      method: 'GET',
      parameter: {},
    },
    {
      name: 'Create table',
      userId,
      script: `function main(params, repo) {
  return repo.table.create({
    name: params.name
  })
}`,
      method: 'POST',
      parameter: { name: { type: GlobalPrimitive.String, required: true } },
    },
    {
      name: 'Delete table',
      userId,
      script: `function main(params, repo) {
  return repo.table.delete({ id: params.id })
}`,
      method: 'DELETE',
      parameter: { id: { type: GlobalPrimitive.String, required: true } },
    },
    {
      name: 'Update table',
      userId,
      script: `function main(params, repo) {
  return repo.table.update(params.id, { name: params.name })
}`,
      method: 'PUT',
      parameter: {
        id: { type: GlobalPrimitive.String, required: true },
        name: { type: GlobalPrimitive.String, required: true },
      },
    },
    {
      name: 'Create row',
      userId,
      script: `function main(params, repo) {
  repo.row.create({
    dataTableId: "${dataTable.id}",
    values: {
      '1': params.title
    }
  })
}`,
      method: 'POST',
      parameter: {
        title: { type: GlobalPrimitive.String, required: true },
      },
    },
    {
      name: 'Delete row',
      userId,
      script: `function main(params, repo) {
  repo.row.delete({ id: params.rowId })
}`,
      method: 'DELETE',
      parameter: {
        rowId: { type: GlobalPrimitive.String, required: true },
      },
    },
    {
      name: 'Update row title',
      userId,
      script: `async function main(params, repo) {
  const updateData = {
    id: params.id,
    '1': params.title,
  }
  await repo.row.updateByEntities([updateData])
}`,
      method: 'PUT',
      parameter: {
        id: { type: GlobalPrimitive.String, required: true },
        title: { type: GlobalPrimitive.String, required: true },
      },
    },
    {
      name: 'Update all row count',
      userId,
      script: `async function main(params, repo) {
  await repo.row.updateByWhere({
    dataTableId: params.tableId
  }, {
    '2': params.count
  })
}`,
      method: 'PUT',
      parameter: {
        tableId: { type: GlobalPrimitive.String, required: true },
        count: { type: GlobalPrimitive.Number, required: true },
      },
    },
  ]

  const createdEndpoints =
    authService.endpointService.endpointRepository.create(endpoints)

  await authService.endpointService.endpointRepository.save(createdEndpoints)
}
