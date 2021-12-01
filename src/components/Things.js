import * as React from 'react'
import 'carbon-components/css/carbon-components.css'
import {
  DataTable, Table, TableHead, TableRow, TableBody, TableCell, TableHeader,
} from 'carbon-components-react'

const rows = [
  {
    id: 'a',
    name: 'Load balancer 1',
    status: 'Disabled'
  },
  {
    id: 'b',
    name: 'Load balancer 2',
    status: 'Starting'
  },
  {
    id: 'c',
    name: 'Load balancer 3',
    status: 'Active'
  }
]

const headers = [
  {
    key: 'name',
    header: 'Name'
  },
  {
    key: 'status',
    header: 'Status'
  }
]

export function Things () {
  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })} key={header.header}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow {...getRowProps({ row })} key={i}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>{cell.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  )
}
