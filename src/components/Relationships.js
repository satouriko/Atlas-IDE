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
import { useState } from 'react'

const headers = [
  {
    key: 'Thing ID',
    header: 'Thing ID'
  },
  {
    key: 'Name',
    header: 'Name'
  },
  {
    key: 'Type',
    header: 'Type'
  },
  {
    key: 'FS name',
    header: 'FS name'
  },
  {
    key: 'SS name',
    header: 'SS name'
  },
  {
    key: 'Space ID',
    header: 'Space ID'
  },
  {
    key: 'Category',
    header: 'Category'
  },
  {
    key: 'Owner',
    header: 'Owner'
  }
]

export function Relationships (props) {
  const { tweetInfo } = props
  const [filterKey, setFilterKey] = useState('All')
  //const rows = Object.values(tweetInfo.Service).map(row => ({id: row['name']}))
  const rows = Object.keys(tweetInfo.Relationship).map(key => ({id: key, ...tweetInfo.Relationship[key]}))
  .sort(function(a, b){
    if (a['Type'] < b['Type']) { return -1; }
    if (a['Type'] > b['Type']) { return 1; }
    return 0;
  }).filter((row) => row['Thing ID'] === filterKey || filterKey === 'All')
  const items = [
    { id: 'All', text: 'All' },
    ...Object.keys(tweetInfo.Identity_Thing).map(key => ({id: key, text: tweetInfo.Identity_Thing[key]['Thing ID']})).sort(function(a, b){
      if (a.text < b.text) { return -1; }
      if (a.text > b.text) { return 1; }
      return 0;
    })
  ]
  //console.log(1, props.tweetInfo)
  return (
    <>
      <Dropdown
        initialSelectedItem={{ id: 'All', text: 'All' }}
        ariaLabel="All"
        id="carbon-dropdown-example"
        className="dropdown"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        label="Dropdown menu options"
        titleText="Relationship of Services"
        onChange={(e) => setFilterKey(e.selectedItem.id)}
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
