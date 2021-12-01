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

function testButton(){
  console.log('test');
  let statementList = [
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
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
      console.log('finish running statement ' + arg);
      })
      electron.ipcRenderer.send('runApp', {
        appName: 'testApp',
        statementList
      })
}

function testButton2(){
  console.log('test');
  let statementList = [
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
    }
  ];
  electron.ipcRenderer.on('runApp-finish', (event, arg) => {
      console.log('finish running statement ' + arg);
      })
      electron.ipcRenderer.send('runApp', {
        appName: 'testApp',
        statementList
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
          <Recipe />
        </Tab>
        <Tab id="tab-5" label="Application">
          <p>Content for third tab goes here.</p>
          <Button onClick = {testButton}>
          BuzzAndLightOn
          </Button>
          <Button onClick = {testButton2}>
          BuzzAndLightOff
          </Button>
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
