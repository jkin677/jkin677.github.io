// I have absolutely no idea what to put here.

//JSON from block factory https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
Blockly.defineBlocksWithJsonArray([
{ "type": "parallelforloop",
  "message0": "Give %1 values between %2 and %3 , %4 then do %5 loop(s) at once: %6",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": "Number",
      "align": "CENTRE"
    },
    {
      "type": "field_number",
      "name": "startNum",
      "value": 1
    },
    {
      "type": "field_number",
      "name": "endNum",
      "value": 10
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_number",
      "name": "numWorkers",
      "value": 2,
      "min": 1
    },
    {
      "type": "input_statement",
      "name": "parallelStatements"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 65,
  "tooltip": "",
  "helpUrl": ""
}
]); // END JSON