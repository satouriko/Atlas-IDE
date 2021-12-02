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
import { Application } from './components/Application'
import BlocklyComponent, { Block, Value, Field, Shadow } from './Blockly';
import BlocklyJS from 'blockly/javascript';
import './blocks/customblocks';
import './generator/generator';
import { Recipe } from './components/Recipe'


const electron = window.require('electron')

function App () {
  const [tweetInfo, setTweetInfo] = useState({
    Identity_Language: {},
    Identity_Entity: {},
    Identity_Thing: {},
    Service: {},
    Relationship: {}
  })
  const [appInfo, setAppInfo] = useState({})
  const reloadApp = () => {
    electron.ipcRenderer.once('getApp-reply', (event, arg) => {
      setAppInfo(arg)
    })
    electron.ipcRenderer.send('getApp');
  }
  useEffect(() => {
    setInterval(() => {
      electron.ipcRenderer.once('tweetMessage-reply', (event, arg) => {
        setTweetInfo(arg)
        //console.log(arg)
      })
      electron.ipcRenderer.send('tweetMessage', 'sendstring')
    }, 2500)
  }, [])
  const [selectedTab, setSelectedTab] = useState(0)
  const [firstTimeResize, setFirstTimeResize] = useState(false)
  const [editingApp, setEditingApp] = useState('')
  const editApp = (appName) => {
    setEditingApp(appName)
    setSelectedTab(3)
    if (!firstTimeResize) {
      window.dispatchEvent(new Event('resize'))
      setFirstTimeResize(true)
    }
  }
  const onSelectionChange = (e) => {
    setSelectedTab(e)
    if (e === 3 && !firstTimeResize) {
      window.dispatchEvent(new Event('resize'))
      setFirstTimeResize(true)
    }
  }
  return (
    <div className="App">
      <Tabs selected={selectedTab} onSelectionChange={onSelectionChange}>
        <Tab id="tab-1" label="Things">
          <Things tweetInfo={tweetInfo} />
        </Tab>
        <Tab id="tab-2" label="Services">
          <Services tweetInfo={tweetInfo} />
        </Tab>
        <Tab id="tab-3" label="Relationships">
          <Relationships tweetInfo = {tweetInfo} />
        </Tab>
        <Tab id="tab-4" label="Recipes">
          <Recipe tweetInfo={tweetInfo} reloadApp={reloadApp} appInfo={appInfo} editingApp={editingApp} />
        </Tab>
        <Tab id="tab-5" label="Application">
          <Application tweetInfo={tweetInfo} appInfo={appInfo} reloadApp={reloadApp} editApp={editApp} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
