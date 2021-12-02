import {
  Button, DataTable,
  Table, TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'carbon-components-react'
import * as React from 'react'
import { useEffect, useState } from 'react'

const electron = window.require('electron')
const headers = [
  {
    key: 'appName',
    header: 'App Name'
  },
  {
    key: 'onButton',
    header: 'Turn On'
  },
  {
    key: 'offButton',
    header: 'Turn Off'
  }
]



let statementList1 = [
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'LED',
    serviceName: 'TurnOn',
    serviceInput: [0]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [1000, 5]
  }
];
let statementList2 = [
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'LED',
    serviceName: 'TurnOff',
    serviceInput: [0]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [2000, 3]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [500, 5]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [2000, 3]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [500, 5]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [2000, 3]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [500, 5]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [2000, 3]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [500, 5]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [2000, 3]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [500, 5]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [2000, 3]
  },
  {
    type: 'service',
    thingID: 'RPI1',
    entityID: 'BUZZER',
    serviceName: 'BUZZ',
    serviceInput: [500, 5]
  }
];
let statementList3 = [
  {
    type: 'ifThen',
    ifStatement: {
      type: 'service',
      thingID: 'RPI1',
      entityID: 'BUZZER',
      serviceName: 'BUZZ',
      serviceInput: [1000, 10]
    },
    thenStatement: {
      type: 'service',
      thingID: 'RPI1',
      entityID: 'LED',
      serviceName: 'TurnOn',
      serviceInput: [0]
    }
  }
];

let statementList4 = [
  {
    type: 'ifThen',
    ifStatement: {
      type: 'ifThen',
      ifStatement: {
        type: 'service',
        thingID: 'RPI1',
        entityID: 'BUZZER',
        serviceName: 'BUZZ',
        serviceInput: [1000, 10]
      },
      thenStatement: {
        type: 'service',
        thingID: 'RPI1',
        entityID: 'LED',
        serviceName: 'TurnOn',
        serviceInput: [0]
      }
    },
    thenStatement: {
      type: 'ifThen',
      ifStatement: {
        type: 'service',
        thingID: 'RPI1',
        entityID: 'LED',
        serviceName: 'TurnOff',
        serviceInput: [0]
      },
      thenStatement: {
        type: 'service',
        thingID: 'RPI1',
        entityID: 'BUZZER',
        serviceName: 'BUZZ',
        serviceInput: [1000, 5]
      }
    }
  }
];

function testButton(input){
  console.log(statementList1);
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
    console.log('finish running statement ' + arg);
  })
  electron.ipcRenderer.send('runApp', {
    appName: input,
    statementList: statementList1
  })
}

function saveButton(input){
  console.log('save');
  electron.ipcRenderer.on('saveApp-finish', (event, arg) => {
    console.log('finish saving');
  })
  electron.ipcRenderer.send('saveApp', {
    appName: input,
    fileName: './theFile.txt',
    statementList: statementList1
  })
}

function clearButton(){
  console.log('clear');
  statementList1 = [];
}

function loadButton(){
  console.log('load');
  electron.ipcRenderer.on('getApp-reply', (event, arg) => {
    console.log(arg)
  })
  electron.ipcRenderer.on('loadApp-finish', (event, arg) => {
    electron.ipcRenderer.send('getApp');
  })
  electron.ipcRenderer.send('loadApp', './theFile.txt');
}

function testButton2(){
  console.log(statementList2);
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
    console.log('finish running statement ' + arg);
  })
  electron.ipcRenderer.send('runApp', {
    appName: 'testApp2',
    statementList: statementList2
  })
}

function stopButton(){
  console.log('stop');
  electron.ipcRenderer.send('stopApp', 'testApp2');
}

function testButton3(){
  console.log(statementList3);
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
    console.log('finish running statement ' + arg);
  })
  electron.ipcRenderer.send('runApp', {
    appName: 'testApp3',
    statementList: statementList3
  })
}

function testButton4(){
  console.log(statementList4);
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
    console.log('finish running statement ' + arg);
  })
  electron.ipcRenderer.send('runApp', {
    appName: 'testApp4',
    statementList: statementList4
  })
}

export function Application(props) {
  const { appInfo } = props
  const { tweetInfo } = props
  console.log(appInfo)
  const rows = Object.keys(appInfo).map(key => ({
    id: key,
    ...appInfo[key]
  }))


  return (<>
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
                  <Button size="small" onClick={() => testButton(row.cells[0].value)}>Turn On</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" kind="danger--tertiary" onClick={() => testButton(row.cells[0].value)}>Turn Off</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>



    <p>{JSON.stringify(statementList1)}</p>
    <Button onClick = {testButton}>
      BuzzAndLightOn
    </Button>
    <Button onClick = {saveButton}>
      Save this app
    </Button>
    <Button onClick = {clearButton}>
      Clear this app
    </Button>
    <Button onClick = {loadButton}>
      Load this app
    </Button>
    <p>{JSON.stringify(statementList2)}</p>
    <Button onClick = {testButton2}>
      BuzzAndLightOff
    </Button>
    <Button onClick = {stopButton}>
      Stop this app
    </Button>
    <p>{JSON.stringify(statementList3)}</p>
    <Button onClick = {testButton3}>
      IfBuzzThenBuzzsd
    </Button>
    <p>{JSON.stringify(statementList4)}</p>
    <Button onClick = {testButton4}>
      IfBuzzThenRecur
    </Button>
    </>)
}