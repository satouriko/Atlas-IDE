/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';

// Since we're using json to initialize the field, we'll need to import it.
import '../fields/BlocklyReactField';
import '../fields/DateField';

export function parseAPI (apiString) {
  // BUZZ:[Input1,int, NULL|Input2,int, NULL]:(Output,int, NULL)
  const regex = /\w+\s*:\s*\[(?:\s*(\w+)\s*,\s*(\w+)\s*,\s*\w+\s*\|)*(?:\s*(\w+)\s*,\s*(\w+)\s*,\s*\w+\s*)]:\(\s*\w+\s*,\s*(\w+)\s*,\s*\w+\s*\)/
  const test = regex.exec(apiString)
  if (!test) {
    console.error('Cannot parse API string: ', apiString)
    return
  }
  test.shift()
  const outputType = test.pop()
  const inputs = []
  for (let i = 0; i + 1 < test.length; i += 2) {
    if (test[i] !== undefined) {
      inputs.push({
        name: test[i],
        type: test[i+1]
      })
    }
  }
  return {
    inputs,
    outputType
  }
}

export function makeCustomBlocks (tweetInfo) {
  const services = Object.keys(tweetInfo.Service)
    .filter((key) => parseAPI(tweetInfo.Service[key].API))
    .map((key) => ({
      ...tweetInfo.Service[key],
      id: key,
      io: parseAPI(tweetInfo.Service[key].API)
    }))

  for (const service of services) {
    Blockly.Blocks[`Service_` + service.id] = {
      init: function () {
        this.appendDummyInput("NAME")
          .appendField(service.id)
        for (const input of service.io.inputs) {
          let type = input.type
          if (type === 'int' || type === 'float') {
            type = 'Number'
          }
          this.appendValueInput(input.name)
            .setCheck(type)
            .appendField(input.name);
        }
        let type = service.io.outputType
        if (type === 'int' || type === 'float') {
          type = 'Number'
        }
        this.setOutput(true, type);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    }
  }

  Blockly.Blocks['ignore'] = {
    init: function () {
      this.appendValueInput("NAME")
        .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  }
}
