import {
  DataTable,
  Dropdown,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'carbon-components-react'
import * as React from 'react'

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

export function Relationships () {
  return (
    <>
      <Dropdown
        ariaLabel="Dropdown"
        id="carbon-dropdown-example"
        className="dropdown"
        items={[
          { id: 'option-0', text: 'Option 0' },
          { id: 'option-1', text: 'Option 1' },
          { id: 'option-2', text: 'Option 2' }
        ]}
        itemToString={(item) => (item ? item.text : '')}
        label="Dropdown menu options"
        titleText="Dropdown title"
      />
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
    </>
  )
}
