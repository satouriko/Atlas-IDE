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


Blockly.JavaScript['cond_eval'] = function(block) {
  const value_name = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Cond', Blockly.JavaScript.ORDER_ATOMIC));
  let statements_name = Blockly.JavaScript.statementToCode(block, 'Eval');
  statements_name = '[' + statements_name.replace(/}\{/g, '},{') + ']';
  statements_name = JSON.parse(statements_name)
  let statement = {
    type: 'ifthen',//service, relationship or ifthen
    ifStatement: value_name,
    thenStatement: statements_name
  }
  // TODO: Assemble JavaScript into code variable.
  const code = JSON.stringify(statement);
  return code;
};

Blockly.JavaScript['recipe'] = function(block) {
  const appName = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  const statements_name = Blockly.JavaScript.statementToCode(block, 'STATEMENTS');
  // TODO: Assemble JavaScript into code variable.
  const code = '[' + (statements_name.replace(/}\{/g, '},{')).trim() + ']';
  let statement = {
    appName: appName.replace(/^'|'$/g, ''),
    statementList: JSON.parse(code)
  }
  return JSON.stringify(statement);
};
Blockly.JavaScript['ignore'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_name;
  return code;
};



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
        this.appendDummyInput("NAME").appendField(service.id)
        for (const input of service.io.inputs) {
          let type = input.type
          if (type === 'int' || type === 'float') {
            type = 'Number'
          }
          this.appendValueInput(input.name).
            setCheck(type).
            appendField(input.name);
        }
        let type = service.io.outputType
        if (type === 'int' || type === 'float') {
          type = 'Number'
        }
        this.setOutput(true, type);
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
      }
    }
    Blockly.JavaScript[`Service_` + service.id] = function (block) {
      const valueNames = service.io.inputs.map((input) => {
        return Blockly.JavaScript.valueToCode(block, input.name, Blockly.JavaScript.ORDER_ATOMIC)
      })
      const statement = {
        type: 'service',//service, relationship or ifthen
        thingID: service['Thing ID'],//service if type is service, service1 if type is relationship
        entityID: service['Entity ID'],
        serviceName: service['Name'],
        serviceInput: JSON.parse(`[${valueNames.join(',')}]`),
      }
      // TODO: Assemble JavaScript into code variable.
      const code = JSON.stringify(statement)
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.JavaScript.ORDER_ATOMIC];
    };


  }
  return [
    services.map((service) => `Service_` + service.id),
    services
  ]
}

Blockly.Blocks['recipe'] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("String")
      .appendField("App name");
    this.appendStatementInput("STATEMENTS")
      .setCheck(null)
      .appendField("")
      .appendField("Recipe");
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['ignore'] = {
  init: function () {
    this.appendValueInput("NAME")
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour(160);
  }
}

Blockly.Blocks['cond_eval'] = {
  init: function() {
    this.appendValueInput("Cond")
      .setCheck(null)
      .appendField("if");
    this.appendStatementInput("Eval")
      .setCheck(null)
      .appendField("then");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['control'] = {
  init: function() {
    this.appendValueInput("Input1")
      .setCheck(null)
      .appendField("if");
    this.appendValueInput("Input2")
      .setCheck(null)
      .appendField("then");
    this.setOutput(true, null);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
}

Blockly.JavaScript['control'] = function(block) {
  const input1 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input1', Blockly.JavaScript.ORDER_ATOMIC))
  const input2 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input2', Blockly.JavaScript.ORDER_ATOMIC))
  const statement = {
    type: 'relationship',//service, relationship or ifthen
    thingID: input1.thingID,//service if type is service, service1 if type is relationship
    entityID: input1.entityID,
    serviceName: input1.serviceName,
    serviceInput: input1.serviceName,
    relationshipType: 'control',
    thingID2: input2.thingID,
    entityID2: input2.entityID,
    serviceName2: input2.serviceName,
    serviceInput2: input2.serviceInput,
  }
  // TODO: Assemble JavaScript into code variable.
  const code = JSON.stringify(statement)
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['drive'] = {
  init: function() {
    this.appendValueInput("Input1")
      .setCheck(null)
      .appendField("use");
    this.appendValueInput("Input2")
      .setCheck(null)
      .appendField("todo");
    this.setOutput(true, null);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
}

Blockly.JavaScript['drive'] = function(block) {
  const input1 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input1', Blockly.JavaScript.ORDER_ATOMIC))
  const input2 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input2', Blockly.JavaScript.ORDER_ATOMIC))
  const statement = {
    type: 'relationship',//service, relationship or ifthen
    thingID: input1.thingID,//service if type is service, service1 if type is relationship
    entityID: input1.entityID,
    serviceName: input1.serviceName,
    serviceInput: input1.serviceName,
    relationshipType: 'drive',
    thingID2: input2.thingID,
    entityID2: input2.entityID,
    serviceName2: input2.serviceName,
    serviceInput2: input2.serviceInput,
  }
  // TODO: Assemble JavaScript into code variable.
  const code = JSON.stringify(statement)
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['support'] = {
  init: function() {
    this.appendValueInput("Input1")
      .setCheck(null)
      .appendField("before");
    this.appendValueInput("Input2")
      .setCheck(null)
      .appendField("check on");
    this.setOutput(true, null);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
}

Blockly.JavaScript['support'] = function(block) {
  const input1 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input1', Blockly.JavaScript.ORDER_ATOMIC))
  const input2 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input2', Blockly.JavaScript.ORDER_ATOMIC))
  const statement = {
    type: 'relationship',//service, relationship or ifthen
    thingID: input1.thingID,//service if type is service, service1 if type is relationship
    entityID: input1.entityID,
    serviceName: input1.serviceName,
    serviceInput: input1.serviceName,
    relationshipType: 'support',
    thingID2: input2.thingID,
    entityID2: input2.entityID,
    serviceName2: input2.serviceName,
    serviceInput2: input2.serviceInput,
  }
  // TODO: Assemble JavaScript into code variable.
  const code = JSON.stringify(statement)
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['extend'] = {
  init: function() {
    this.appendValueInput("Input1")
      .setCheck(null)
      .appendField("do");
    this.appendValueInput("Input2")
      .setCheck(null)
      .appendField("while doing");
    this.setOutput(true, null);
    this.setColour(65);
    this.setTooltip("");
    this.setHelpUrl("");
  }
}

Blockly.JavaScript['extend'] = function(block) {
  const input1 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input1', Blockly.JavaScript.ORDER_ATOMIC))
  const input2 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'Input2', Blockly.JavaScript.ORDER_ATOMIC))
  const statement = {
    type: 'relationship',//service, relationship or ifthen
    thingID: input1.thingID,//service if type is service, service1 if type is relationship
    entityID: input1.entityID,
    serviceName: input1.serviceName,
    serviceInput: input1.serviceInput,
    relationshipType: 'extend',
    thingID2: input2.thingID,
    entityID2: input2.entityID,
    serviceName2: input2.serviceName,
    serviceInput2: input2.serviceInput,
  }
  // TODO: Assemble JavaScript into code variable.
  const code = JSON.stringify(statement)
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

