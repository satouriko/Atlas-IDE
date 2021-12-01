import './App.css'
import 'carbon-components/css/carbon-components.css'
import {
  Tabs, Tab, Dropdown, DataTable,
  Table, TableHead, TableRow, TableBody, TableCell, TableHeader,
  Grid, Row, Column
} from 'carbon-components-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Things } from './components/Things'
import { Services } from './components/Services'
import { Relationships } from './components/Relationships'

const electron = window.require('electron')

function App () {
  const [tweetInfo, setTweetInfo] = useState({
    Identity_Language: {},
    Identity_Entity: {},
    Identity_Thing: {},
    Service: {}
  })
  useEffect(() => {
    setInterval(() => {
      electron.ipcRenderer.on('tweetMessage-reply', (event, arg) => {
        setTweetInfo(arg)
      })
      electron.ipcRenderer.send('tweetMessage', 'sendstring')
    }, 2500)
  }, [])
  return (
    <div className="App">
      <Tabs>
        <Tab id="tab-1" label="Things">
          <Things tweetInfo={tweetInfo} />
        </Tab>
        <Tab id="tab-2" label="Services">
          <Services />
        </Tab>
        <Tab id="tab-3" label="Relationships">
          <Relationships />
        </Tab>
        <Tab id="tab-4" label="Recipes">
          <p>Content for third tab goes here.</p>
        </Tab>
        <Tab id="tab-5" label="Application">
          <p>Content for third tab goes here.</p>
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
