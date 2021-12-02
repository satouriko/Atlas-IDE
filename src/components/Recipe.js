import BlocklyComponent, { Block, Value, Field, Shadow, Category } from '../Blockly'
import BlocklyJS from 'blockly/javascript';
import { makeCustomBlocks } from '../blocks/customblocks';
import '../generator/generator';
import { useEffect, useMemo, useRef, useState } from 'react'

const electron = window.require('electron')

export function Recipe(props) {
  const { tweetInfo } = props
  const [serviceBlockIds, setServiceBlockIds] = useState([])
  const [services, setServices] = useState([])
  const relationships = Object.keys(tweetInfo.Relationship).map((key) => ({
    ...tweetInfo.Relationship[key],
    id: key
  }))
  const preRelationships = useMemo(() => {
    const r = []
    for (const relationship of relationships) {
      const fs = services.find((s) => s.Name === relationship['FS name'])
      const ss = services.find((s) => s.Name === relationship['SS name'])
      if (fs && ss) {
        r.push({
          ...relationship,
          fs,
          ss
        })
      }
    }
    setTimeout(() => {
      simpleWorkspace.current?.refreshToolbox()
    })
    return r
  }, [Object.keys(tweetInfo.Relationship).sort().join('\n'), services.map(s => s.Name).sort().join('\n')])
  useEffect(() => {
    const [blockIds, services] = makeCustomBlocks(tweetInfo)
    setServiceBlockIds(blockIds)
    setServices(services)
    setTimeout(() => {
      simpleWorkspace.current?.refreshToolbox()
    })
  }, [Object.keys(tweetInfo.Service).sort().join('\n')])
  const simpleWorkspace = useRef()
  const save = (appJson) => {
    electron.ipcRenderer.on('saveApp-finish', (event, arg) => {
      alert('Saved');
    })
    electron.ipcRenderer.send('saveApp', {
      fileName: `./${appJson.appName}.json`,
      ...appJson,
      xml: simpleWorkspace.current.getXml()
    })
  }
  const generateCode = () => {
    const code = BlocklyJS.workspaceToCode(
      simpleWorkspace.current.workspace
    )
    save(JSON.parse(code))
  }
  const open = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = e => {
      const file = e.target.files[0]
      electron.ipcRenderer.on('loadApp-finish', (event, arg) => {
        simpleWorkspace.current?.setXml(arg.xml)
        console.log(arg)
      })
      electron.ipcRenderer.send('loadApp', file.path)
    }
    input.click()
  }
  return (
    <>
        <button onClick={generateCode} className="convert-button">Save</button>
        <button onClick={open} className="convert-button2">Open</button>
        <BlocklyComponent ref={simpleWorkspace}
                          readOnly={false} trashcan={true} media={'media/'}
                          move={{
                            scrollbars: true,
                            drag: true,
                            wheel: true
                          }}
                          initialXml={`
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="recipe">
    <value name="NAME">
      <block type="text">
        <field name="TEXT">Type your app name here</field>
      </block>
    </value>
  </block>
</xml>
      `}>
          <Category name="Logic">
            <Block type="recipe" />
            <Block type="ignore" />
            <Block type="cond_eval" />
          </Category>
          <Category name="Services">
            {serviceBlockIds.map((serviceKey) => (
              <Block type={serviceKey} key={serviceKey} />
            ))}
          </Category>
          <Category name="Relationships">
            <Block type="control" />
            <Block type="drive" />
            <Block type="support" />
            <Block type="extend" />
            {preRelationships.map((relationship) => (
              <Block type={relationship.Type} key={relationship.id}>
                <Value name="Input1">
                  <Block type={`Service_${relationship.fs.id}`} />
                </Value>
                <Value name="Input2">
                  <Block type={`Service_${relationship.ss.id}`} />
                </Value>
              </Block>
            ))}
          </Category>
          <Category name="Literals">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
            <Block type="text">
              <Field name="TEXT" />
            </Block>
            <Block type="logic_boolean">
              <Field name="BOOL">TRUE</Field>
            </Block>
          </Category>
        </BlocklyComponent>
    </>
  )
}
