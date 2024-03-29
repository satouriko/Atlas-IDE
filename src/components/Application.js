import {
  Button, DataTable,
  Table, TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'carbon-components-react'
import * as React from 'react'
import { useMemo, useRef, useState } from 'react'

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
  },
  {
    key: 'editButton',
    header: 'Edit'
  },
  {
    key: 'deleteButton',
    header: 'Delete'
  }
]

export function Application(props) {
  const { appInfo } = props
  const rows = Object.keys(appInfo).map(key => ({
    id: key,
    ...appInfo[key]
  }))
  const [runningState, setRunningState] = useState({})
  const runningStateRef = useRef(runningState)
  runningStateRef.current = runningState
  useMemo(() => {
    const newRunningState = {}
    for (const app of Object.keys(appInfo)) {
      if (runningState[app] && appInfo[app].statementList.length === runningState[app].n) {
        newRunningState[app] = runningState[app]
      }
    }
    setRunningState(newRunningState)
  }, [appInfo])

  const runButton = (input) => {
    const listener = (event, arg) => {
      if (input === arg.appName) {
        if (runningStateRef.current[input]) {
          setRunningState({
            ...runningStateRef.current,
            [input]: {
              i: arg.i,
              n: runningStateRef.current[input].n
            }
          })
          if (arg.i === runningStateRef.current[input].n - 1) {
            electron.ipcRenderer.off('runApp-finish', listener)
          }
        } else {
          electron.ipcRenderer.off('runApp-finish', listener)
        }
      }
    }
    electron.ipcRenderer.on('runApp-finish', listener)
    setRunningState({
      ...runningState,
      [input]: {
        i: -1,
        n: appInfo[input].statementList.length
      }
    })
    electron.ipcRenderer.send('runApp', {
      appName: input
    })
  }

  const stopButton = (appName) => {
    electron.ipcRenderer.send('stopApp', appName);
  }

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

  const deleteButton = (appName) => {
    const listener = (event, arg) => {
      if (arg === appName) {
        props.reloadApp()
        electron.ipcRenderer.off('deleteApp-finish', listener)
      }
    }
    electron.ipcRenderer.on('deleteApp-finish', listener)
    electron.ipcRenderer.send('deleteApp', appName);
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
                  <Button
                    disabled={runningState[row.cells[0].value] !== undefined && runningState[row.cells[0].value].i !== runningState[row.cells[0].value].n - 1}
                    size="small" onClick={() => runButton(row.cells[0].value)}>Start</Button>
                </TableCell>
                <TableCell>
                  <Button
                    disabled={runningState[row.cells[0].value] === undefined || runningState[row.cells[0].value].i === runningState[row.cells[0].value].n - 1}
                    size="small" kind="danger--tertiary" onClick={() => stopButton(row.cells[0].value)}>Stop</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" kind="secondary" onClick={() => props.editApp(row.cells[0].value)}>Edit</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" kind="danger" onClick={() => deleteButton(row.cells[0].value)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
    </>)
}
