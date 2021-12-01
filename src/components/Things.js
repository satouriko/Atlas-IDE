import * as React from 'react'
import 'carbon-components/css/carbon-components.css'
import {
  DataTable, Table, TableHead, TableRow, TableBody, TableCell, TableHeader,
} from 'carbon-components-react'

const headers = [
  {
    key: 'Space ID',
    header: 'Space ID'
  },
  {
    key: 'Thing ID',
    header: 'Thing ID'
  },
  {
    key: 'Name',
    header: 'Name',
  },
  {
    key: 'Description',
    header: 'Description'
  },
  {
    key: 'Model',
    header: 'Model'
  },
  {
    key: 'OS',
    header: 'OS'
  },
  {
    key: 'Owner',
    header: 'Owner'
  },
  {
    key: 'Vendor',
    header: 'Vendor'
  }
]

export function Things (props) {
  const { tweetInfo } = props
  const rows = Object.keys(tweetInfo.Identity_Thing).map(key => ({
    id: key,
    ...tweetInfo.Identity_Thing[key]
  }))
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
