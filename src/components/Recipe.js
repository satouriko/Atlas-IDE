import BlocklyComponent, { Block, Value, Field, Shadow } from '../Blockly';
import BlocklyJS from 'blockly/javascript';
import '../blocks/customblocks';
import '../generator/generator';
import { useRef } from 'react'

export function Recipe() {
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
<block type="controls_ifelse" x="0" y="0"></block>
</xml>
      `}>
          <Block type="test_react_field" />
          <Block type="test_react_date_field" />
          <Block type="controls_ifelse" />
          <Block type="logic_compare" />
          <Block type="logic_operation" />
          <Block type="controls_repeat_ext">
            <Value name="TIMES">
              <Shadow type="math_number">
                <Field name="NUM">10</Field>
              </Shadow>
            </Value>
          </Block>
          <Block type="logic_operation" />
          <Block type="logic_negate" />
          <Block type="logic_boolean" />
          <Block type="logic_null" disabled="true" />
          <Block type="logic_ternary" />
          <Block type="text_charAt">
            <Value name="VALUE">
              <Block type="variables_get">
                <Field name="VAR">text</Field>
              </Block>
            </Value>
          </Block>
        </BlocklyComponent>
    </>
  )
}