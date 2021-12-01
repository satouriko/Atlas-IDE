import BlocklyComponent, { Block, Value, Field, Shadow, Category } from '../Blockly'
import BlocklyJS from 'blockly/javascript';
import { makeCustomBlocks } from '../blocks/customblocks';
import '../generator/generator';
import { useEffect, useRef, useState } from 'react'
import * as Blockly from 'blockly/core'

export function Recipe(props) {
  const { tweetInfo } = props
  const [services, setServices] = useState([])
  useEffect(() => {
    makeCustomBlocks(tweetInfo)
    setServices(Object.keys(Blockly.Blocks).filter(blockType => blockType.startsWith('Service_')))
    setTimeout(() => {
      simpleWorkspace.current.refreshToolbox()
    })
  }, [Object.keys(tweetInfo.Service).join('\n')])
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
</xml>
      `}>
          <Category name="Logic">
            <Block type="ignore"></Block>
          </Category>
          <Category name="Services">
            {services.map((serviceKey) => (
              <Block type={serviceKey} key={serviceKey} />
            ))}
          </Category>
          <Category name="Relationships"></Category>
          <Category name="Literals">
            <Block type="math_number">
              <Field name="NUM">0</Field>
            </Block>
            <Block type="text">
              <Field name="TEXT"></Field>
            </Block>
            <Block type="logic_boolean">
              <Field name="BOOL">TRUE</Field>
            </Block>
          </Category>
        </BlocklyComponent>
    </>
  )
}
