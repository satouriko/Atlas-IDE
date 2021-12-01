import './App.css'
import 'carbon-components/css/carbon-components.css'
import {
  Tabs, Tab, Dropdown, DataTable,
  Table, TableHead, TableRow, TableBody, TableCell, TableHeader,
  Grid, Row, Column
} from 'carbon-components-react'
import * as React from 'react'
import { useEffect } from 'react'
const electron = window.require('electron')

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

function App () {
  useEffect(() => {
    setInterval(() => {
      electron.ipcRenderer.on('tweetMessage-reply', (event, arg) => {
        console.log(arg)
      })
      electron.ipcRenderer.send('tweetMessage', 'sendstring')
    }, 2500)
  }, [])
  return (
    <div className="App">
      <Tabs>
        <Tab id="tab-1" label="Things">
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
        </Tab>
        <Tab id="tab-2" label="Services">
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
        </Tab>
        <Tab id="tab-3" label="Relationships">
          <Dropdown
            ariaLabel="Dropdown"
            id="carbon-dropdown-example"
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
        </Tab>
        <Tab id="tab-4" label="Recipes">
          <p>Content for third tab goes here.</p>
          <Grid>
            <Row>
              <Column className="drag-panel" lg={6}>
                <h2>Services</h2>
              </Column>
              <Column className="drag-panel" lg={6}>
                <h2>Relationships</h2>
              </Column>
            </Row>
          </Grid>
        </Tab>
        <Tab id="tab-5" label="Application">
          <p>Content for third tab goes here.</p>
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
