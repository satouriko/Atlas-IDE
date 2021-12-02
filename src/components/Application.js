import {
  Button, DataTable,
  Table, TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'carbon-components-react'
import * as React from 'react'

const electron = window.require('electron')
const headers = [
  {
    key: 'appName',
    header: 'App Name'
  },
  {
    key: 'onButton',
    header: 'Start'
  },
  {
    key: 'offButton',
    header: 'Stop'
  }
]

function runButton(input){
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
    console.log('finish running statement ' + arg);
  })
  electron.ipcRenderer.send('runApp', {
    appName: input
  })
}

function stopButton(appName){
  console.log('stop');
  electron.ipcRenderer.send('stopApp', appName);
}

export function Application(props) {
  const { appInfo } = props
  const rows = Object.keys(appInfo).map(key => ({
    id: key,
    ...appInfo[key]
  }))

  const open = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = e => {
      const files = e.target.files
      for (const file of files) {
        const listener = (event, arg) => {
          if (arg.path === file.path) {
            props.reloadApp()
            electron.ipcRenderer.off('loadApp-finish', listener)
          }
        }
        electron.ipcRenderer.on('loadApp-finish', listener)
        electron.ipcRenderer.send('loadApp', file.path)
      }
    }
    input.click()
  }

  return (<>
    <div className="import-row">
      <Button onClick={open}>Import</Button>
    </div>
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
                <TableCell>
                  {row.cells[0].value}
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => runButton(row.cells[0].value)}>Start</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" kind="danger--tertiary" onClick={() => stopButton(row.cells[0].value)}>Stop</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
    </>)
}
