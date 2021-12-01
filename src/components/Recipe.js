import BlocklyComponent, { Block, Value, Field, Shadow, Category } from '../Blockly'
import BlocklyJS from 'blockly/javascript';
import { makeCustomBlocks } from '../blocks/customblocks';
import '../generator/generator';
import { useEffect, useMemo, useRef, useState } from 'react'
import * as Blockly from 'blockly/core'

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
  const generateCode = () => {
    const code = BlocklyJS.workspaceToCode(
      simpleWorkspace.current.workspace
    )
    console.log(code);
  }
  return (
    <>
        <button onClick={generateCode} className="convert-button">Convert</button>
        <BlocklyComponent ref={simpleWorkspace}
                          readOnly={false} trashcan={true} media={'media/'}
                          move={{
                            scrollbars: true,
                            drag: true,
                            wheel: true
                          }}
                          initialXml={`
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="recipe"></block>
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
