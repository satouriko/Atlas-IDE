import './App.css'
import 'carbon-components/css/carbon-components.css'
import {
  Button, Tabs, Tab, Dropdown, DataTable,
  Table, TableHead, TableRow, TableBody, TableCell, TableHeader,
  Grid, Row, Column
} from 'carbon-components-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Things } from './components/Things'
import { Services } from './components/Services'
import { Relationships } from './components/Relationships'
import BlocklyComponent, { Block, Value, Field, Shadow } from './Blockly';
import BlocklyJS from 'blockly/javascript';
import './blocks/customblocks';
import './generator/generator';
import { Recipe } from './components/Recipe'


const electron = window.require('electron')

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

function testButton(){
  console.log(statementList1);
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
      console.log('finish running statement ' + arg);
  })
  electron.ipcRenderer.send('runApp', {
    appName: 'testApp1',
    statementList: statementList1
  })
}

function saveButton(){
  console.log('save');
  electron.ipcRenderer.on('saveApp-finish', (event, arg) => {
    console.log('finish saving');
  })
  electron.ipcRenderer.send('saveApp', {
    appName: 'testApp1',
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

function App () {
  const [tweetInfo, setTweetInfo] = useState({
    Identity_Language: {},
    Identity_Entity: {},
    Identity_Thing: {},
    Service: {},
    Relationship: {}
  })
  useEffect(() => {
    setInterval(() => {
      electron.ipcRenderer.on('tweetMessage-reply', (event, arg) => {
        setTweetInfo(arg)
        //console.log(arg)
      })
      electron.ipcRenderer.send('tweetMessage', 'sendstring')
    }, 2500)
  }, [])
  const [firstTimeResize, setFirstTimeResize] = useState(false)
  return (
    <div className="App">
      <Tabs>
        <Tab id="tab-1" label="Things">
          <Things tweetInfo={tweetInfo} />
        </Tab>
        <Tab id="tab-2" label="Services">
          <Services tweetInfo={tweetInfo} />
        </Tab>
        <Tab id="tab-3" label="Relationships">
          <Relationships tweetInfo = {tweetInfo} />
        </Tab>
        <Tab id="tab-4" label="Recipes" onClick={() => {
          setFirstTimeResize(true)
          if (!firstTimeResize) {
            window.dispatchEvent(new Event('resize'))
          }
        }}>
          <Recipe tweetInfo={tweetInfo} />
        </Tab>
        <Tab id="tab-5" label="Application">
          <p>Content for third tab goes here.</p>
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

        </Tab>
      </Tabs>
    </div>
  )
}

export default App
