/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Utility functions for generating executable code from
 * Blockly code.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Generator');

goog.require('Blockly.Block');


/**
 * Class for a code generator that translates the blocks into a language.
 * @param {string} name Language name of this generator.
 * @constructor
 */
Blockly.Generator = function(name) {
  this.name_ = name;
  this.FUNCTION_NAME_PLACEHOLDER_REGEXP_ =
      new RegExp(this.FUNCTION_NAME_PLACEHOLDER_, 'g');
};

/**
 * Category to separate generated function names from variables and procedures.
 */
Blockly.Generator.NAME_TYPE = 'generated_function';

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1);\n'
 * @type {?string}
 */
Blockly.Generator.prototype.INFINITE_LOOP_TRAP = null;

/**
 * Arbitrary code to inject before every statement.
 * Any instances of '%1' will be replaced by the block ID of the statement.
 * E.g. 'highlight(%1);\n'
 * @type {?string}
 */
Blockly.Generator.prototype.STATEMENT_PREFIX = null;

/**
 * The method of indenting.  Defaults to two spaces, but language generators
 * may override this to increase indent or change to tabs.
 * @type {string}
 */
Blockly.Generator.prototype.INDENT = '  ';

/**
 * Maximum length for a comment before wrapping.  Does not account for
 * indenting level.
 * @type {number}
 */
Blockly.Generator.prototype.COMMENT_WRAP = 60;

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.Generator.prototype.ORDER_OVERRIDES = [];

/**
 * Generate code for multiprocess block
 */
function mp_py(block) {
  
  // Step 1: Get input data
  var data_set = []
  var reduction = null
  if(block.reduction){
    reduction = block.getFieldValue('REDUCTION_OP')
  } 
  
  
     
  var code_lines = []
  var k = 0
  if(block.inputs){   
    while(k < block.inputs.length){
      var new_list = []
      var inputs = false
      var index = 0
      while(index < block.getInputTargetBlock("DATA" + k).itemCount_){
        if(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD" + index))
          inputs = true
        index++ 
      }
      if(inputs){
        var nested = false
        var index = 0
        while(index < block.getInputTargetBlock("DATA" + k).itemCount_){
          if(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD" + index))
            if(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD" + index).getInputTargetBlock("ADD0"))
              nested = true
          index++ 
        }
        if(nested){
          alert("Lists containing lists must have only lists for every element!")
          var j = 0
          while(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j)){
            var m = 0
            var new_sub_list = "["
            while(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j).getInputTargetBlock("ADD"+m)){
              new_sub_list += Blockly.Python.valueToCode(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j), "ADD"+m, Blockly.Python.ORDER_ATOMIC) + ","
              m++
            }
            new_sub_list = new_sub_list.substring(0, new_sub_list.length-1) + "]"
            new_list.push(new_sub_list)
            j++
          }
        } else {
          new_list = parseList(block.getInputTargetBlock("DATA" + k), Blockly.Python.valueToCode(block, 'DATA' + k, Blockly.Python.ORDER_ATOMIC))
        }
        data_set.push({list:new_list})
      }
      
      k++
    }
  } else {

  }
  
  //var data_set = Blockly.Python.valueToCode(block, 'DATA0', Blockly.Python.ORDER_ATOMIC);
  var function_pointer = ""
  if(block.getInputTargetBlock('POINTER')){
    function_pointer = Blockly.Python.valueToCode(block, 'POINTER', Blockly.Python.ORDER_ATOMIC);
  }
  var cores = Blockly.Python.valueToCode(block, 'CORES', Blockly.Python.ORDER_ATOMIC);
  
  code_lines.push("def process_all" + snippet_function_counter + "():")
  

  // Set up data input
  var data_line = "    data = ["
  // Create a tuple for each set of elements (assuming all lists are of equal length)
  // Example: [[1,2,3],[4,5,6]] => [(1,4),(2,5),(3,6)]
  if(k > 0 && data_set[0]){
    for(i = 0; i < data_set[0].list.length; i++){
      var new_tuple = "("
      for(j = 0; j < data_set.length; j++){
        new_tuple += data_set[j].list[i]
        if(data_set.length<2 || j<data_set.length-1)
          new_tuple += ", "
      }
      new_tuple += ")"
      data_line += new_tuple
      if(i<data_set[0].list.length-1)
        data_line += ", "
    }
  }
  else {
	for(var i = 0; i<Blockly.Python.valueToCode(block, 'ITER', Blockly.Python.ORDER_ATOMIC); i++){
		data_line += "()"
		if(i<Blockly.Python.valueToCode(block, 'ITER', Blockly.Python.ORDER_ATOMIC)-1){
			data_line += ","
		}
	}
  }
  data_line += "]"
  if(data_line.includes("process_all"))
    code_lines.push("//Nested multiprocessing blocks not currently supported!")
  
  code_lines.push(data_line)
  code_lines.push("    pool = multiprocessing.Pool(processes=" + cores + ")")

  var operator = ""
  if(reduction == "ADD" || reduction  == "AVERAGE"){
    operator = "+"
  } else if (reduction == "MULTIPLY"){
    operator = "*"
  }
  code_lines.push("    output " + operator + "= pool.starmap(" + function_pointer.split(' ').join('_') + ", data)")
  if(reduction == "AVERAGE"){
    code_lines.push("    return output/" + cores)
  } else {
    code_lines.push("    return output")
  }
  code_lines.push("")
  //code_lines.push("process_all" + snippet_function_counter + "(data" + snippet_function_counter + ")")


  // Step 3: Concatenate all the code lines into 1 string
  var code = '\n';
  for(i = 0; i < code_lines.length; i++){
    code += code_lines[i] + "\n"
  }
  
  snippet_function_counter++
  
  return code
};
function mp_lua(block) {
  // Step 1: Get input data
  var data_set = [];
  var reduction = null;
  if(block.reduction){
    reduction = block.getFieldValue('REDUCTION_OP');
  } 
  var k = 0
  while(k < block.inputs.length){
    new_list = []
    if(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD0").getInputTargetBlock("ADD0")){
      j = 0
      while(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j)){
        m = 0
        new_sub_list = "{"
        while(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j).getInputTargetBlock("ADD"+m)){
          new_sub_list += Blockly.Python.valueToCode(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j), "ADD"+m, Blockly.Python.ORDER_ATOMIC) + ","
          m++
        }
        new_sub_list = new_sub_list.substring(0, new_sub_list.length-1) + "}"
        new_list.push(new_sub_list)
        j++
      }
    } else {
      new_list = parseList(block.getInputTargetBlock("DATA" + k), Blockly.Python.valueToCode(block, 'DATA' + k, Blockly.Python.ORDER_ATOMIC))
    }
    data_set.push({list:new_list})
    
    k++
  }
  var function_pointer = Blockly.Python.valueToCode(block, 'POINTER', Blockly.Python.ORDER_ATOMIC);
  var cores = Blockly.Python.valueToCode(block, 'CORES', Blockly.Python.ORDER_ATOMIC);
  
  var functionPointerBlock = block.getInputTargetBlock('POINTER');
  var functionBeingPointedTo = Blockly.getMainWorkspace().getBlockById(functionPointerBlock.getFieldValue('field_function'));

  var operator = "";
  if(reduction == "ADD" || reduction  == "AVERAGE"){
    operator = "+";
  } else if (reduction == "MULTIPLY"){
    operator = "*";
  }
  
  // var args = [];
  // for(var i = 0; i< data_set.length; i++){
  //   args.push(parseInt(i))
  // }
  
  var function_name = function_pointer.split(' ').join('_')
  if (function_name == 'function'){
	  function_name += '2'
  }
  var code_lines = [];

  var threadArgs = ''
  for (arg = 0; arg< arguments.length; arg++){
	  if (arg == 0){
		  threadArgs = ', '
	  }
	  threadArgs += '"' + arguments[arg] + ':", ' + "args[loop + i][" + (arg+1) + "]"
  }
  code_lines.push('llthreads = require("llthreads")')
  code_lines.push("function process_all" + snippet_function_counter + "()");


  // Set up data input
  var data_line = "    local args = {";
  // Create a tuple for each set of elements (assuming all lists are of equal length)
  // Example: [[1,2,3],[4,5,6]] => [(1,4),(2,5),(3,6)]
  if(k > 0){
    for(i = 0; i < data_set[0].list.length; i++){
      new_tuple = "{";
      for(j = 0; j < data_set.length; j++){
        new_tuple += data_set[j].list[i];
        if(data_set.length<2 || j<data_set.length-1){
          new_tuple += ", ";
        }
      }
      new_tuple += "}";
      data_line += new_tuple;
      if(i<data_set[0].list.length-1){
        data_line += ", ";
      }
      else{
	  data_line += "}";
      }
    }
	code_lines.push(data_line);
  }
  
  code_lines.push("    local thread_code = [[return " + function_pointer.split(' ').join('_') + "(" + arguments.join(', ') + ")]]");
  if (block.returns){
  code_lines.push("    local result = 0");
  }
  code_lines.push("    local numThreads = " + cores);
  code_lines.push("    local iterations = " + Blockly.Python.valueToCode(block, 'ITER', Blockly.Python.ORDER_ATOMIC));
  code_lines.push("    for loop=1,(iterations+1),(numThreads+1) do");
  code_lines.push("        local threads = {}");
  code_lines.push("        for thread=1,(numThreads+1), 1 do");
  code_lines.push("            threads.insert(llthreads.new(thread_code" + threadArgs + "))");
  code_lines.push("            threads[thread]:start()");
  code_lines.push("        end");
  code_lines.push("        for thread=1, " + (parseInt(cores)+1) + ", 1 do");
  if (block.returns){
	  code_lines.push("            result = result " + operator + " threads[thread]:join()");
  }
  else{
	  code_lines.push("            threads[thread]:join()");
  }
  
  code_lines.push("        end");
  code_lines.push("    end");
  if (reduction == "AVERAGE"){
      code_lines.push("result = result / " + cores);
  }
  else{
      code_lines.push("    return result");
  }
  code_lines.push("end");
  
  code_lines.push("process_all" + snippet_function_counter + "()");
  
  
  // Step 3: Concatenate all the code lines into 1 string
  var code = '\n';
  for(i = 0; i < code_lines.length; i++){
    code += code_lines[i] + "\n";
  }
  
  if(block.reduction){
    return [code, Blockly.Python.ORDER_NONE];
  } else {
    return code;
  }
};

/**
 * Generate code for all blocks in the workspace to the specified language.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 * @return {string} Generated code.
 */
Blockly.Generator.prototype.workspaceToCode = function(workspace) {
  if (!workspace) {
    // Backwards compatibility from before there could be multiple workspaces.
    console.warn('No workspace specified in workspaceToCode call.  Guessing.');
    workspace = Blockly.getMainWorkspace();
  }
  var code = [];
  var pBlocks = workspace.getBlocksByType("multiprocess")
  snippet_function_counter = 0
  for (var x = 0, block; block = pBlocks[x]; x++) {
    if(this.name_ == "python")
      code.push(mp_py(block))
    // if(this.name_ == "lua")
    //   code.push(mp_lua(block))
  }

  this.init(workspace)
  var blocks = workspace.getTopBlocks(true);
  snippet_function_counter = 0
  for (var x = 0, block; block = blocks[x]; x++) {

    //alert("Block! " + block.type)
    //alert("aaaaaahhhhh" + snippet_function_counter)
    var line = this.blockToCode(block);
    if (Array.isArray(line)) {
      // Value blocks return tuples of code and operator order.
      // Top-level blocks don't care about operator order.
      line = line[0];
    }
    if (line) {
      if (block.outputConnection) {
        // This block is a naked value.  Ask the language's code generator if
        // it wants to append a semicolon, or something.
        line = this.scrubNakedValue(line);
      }
      code.push(line);
    }
  }
  code = code.join('\n');  // Blank line between each section.
  code = this.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
};

// The following are some helpful functions which can be used by multiple
// languages.

/**
 * Prepend a common prefix onto each line of code.
 * @param {string} text The lines of code.
 * @param {string} prefix The common prefix.
 * @return {string} The prefixed lines of code.
 */
Blockly.Generator.prototype.prefixLines = function(text, prefix) {
  return prefix + text.replace(/(?!\n$)\n/g, '\n' + prefix);
};

/**
 * Recursively spider a tree of blocks, returning all their comments.
 * @param {!Blockly.Block} block The block from which to start spidering.
 * @return {string} Concatenated list of comments.
 */
Blockly.Generator.prototype.allNestedComments = function(block) {
  var comments = [];
  var blocks = block.getDescendants(true);
  for (var i = 0; i < blocks.length; i++) {
    var comment = blocks[i].getCommentText();
    if (comment) {
      comments.push(comment);
    }
  }
  // Append an empty string to create a trailing line break when joined.
  if (comments.length) {
    comments.push('');
  }
  return comments.join('\n');
};

/**
 * Generate code for the specified block (and attached blocks).
 * @param {Blockly.Block} block The block to generate code for.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string|!Array} For statement blocks, the generated code.
 *     For value blocks, an array containing the generated code and an
 *     operator order value.  Returns '' if block is null.
 */
Blockly.Generator.prototype.blockToCode = function(block, opt_thisOnly) {
  if (!block) {
    return '';
  }
  if (block.disabled) {
    // Skip past this block if it is disabled.
    return opt_thisOnly ? '' : this.blockToCode(block.getNextBlock());
  }

  var func = this[block.type];
  if (typeof func != 'function') {
    throw Error('Language "' + this.name_ + '" does not know how to generate ' +
        ' code for block type "' + block.type + '".');
  }
  // First argument to func.call is the value of 'this' in the generator.
  // Prior to 24 September 2013 'this' was the only way to access the block.
  // The current prefered method of accessing the block is through the second
  // argument to func.call, which becomes the first parameter to the generator.
  var code = func.call(block, block);
  if (Array.isArray(code)) {
    // Value blocks return tuples of code and operator order.
    if (!block.outputConnection) {
      throw TypeError('Expecting string from statement block: ' + block.type);
    }
    return [this.scrub_(block, code[0], opt_thisOnly), code[1]];
  } else if (typeof code == 'string') {
    var id = block.id.replace(/\$/g, '$$$$');  // Issue 251.
    if (this.STATEMENT_PREFIX) {
      code = this.STATEMENT_PREFIX.replace(/%1/g, '\'' + id + '\'') + code;
    }
    return this.scrub_(block, code, opt_thisOnly);
  } else if (code === null) {
    // Block has handled code generation itself.
    return '';
  } else {
    throw SyntaxError('Invalid code generated: ' + code);
  }
};

/**
 * Generate code representing the specified value input.
 * @param {!Blockly.Block} block The block containing the input.
 * @param {string} name The name of the input.
 * @param {number} outerOrder The maximum binding strength (minimum order value)
 *     of any operators adjacent to "block".
 * @return {string} Generated code or '' if no blocks are connected or the
 *     specified input does not exist.
 */
Blockly.Generator.prototype.valueToCode = function(block, name, outerOrder) {
  if (isNaN(outerOrder)) {
    throw TypeError('Expecting valid order from block: ' + block.type);
  }
  var targetBlock = block.getInputTargetBlock(name);
  if (!targetBlock) {
    return '';
  }
  var tuple = this.blockToCode(targetBlock);
  if (tuple === '') {
    // Disabled block.
    return '';
  }
  // Value blocks must return code and order of operations info.
  // Statement blocks must only return code.
  if (!Array.isArray(tuple)) {
    throw TypeError('Expecting tuple from value block: ' + targetBlock.type);
  }
  var code = tuple[0];
  var innerOrder = tuple[1];
  if (isNaN(innerOrder)) {
    throw TypeError('Expecting valid order from value block: ' +
        targetBlock.type);
  }
  if (!code) {
    return '';
  }

  // Add parentheses if needed.
  var parensNeeded = false;
  var outerOrderClass = Math.floor(outerOrder);
  var innerOrderClass = Math.floor(innerOrder);
  if (outerOrderClass <= innerOrderClass) {
    if (outerOrderClass == innerOrderClass &&
        (outerOrderClass == 0 || outerOrderClass == 99)) {
      // Don't generate parens around NONE-NONE and ATOMIC-ATOMIC pairs.
      // 0 is the atomic order, 99 is the none order.  No parentheses needed.
      // In all known languages multiple such code blocks are not order
      // sensitive.  In fact in Python ('a' 'b') 'c' would fail.
    } else {
      // The operators outside this code are stronger than the operators
      // inside this code.  To prevent the code from being pulled apart,
      // wrap the code in parentheses.
      parensNeeded = true;
      // Check for special exceptions.
      for (var i = 0; i < this.ORDER_OVERRIDES.length; i++) {
        if (this.ORDER_OVERRIDES[i][0] == outerOrder &&
            this.ORDER_OVERRIDES[i][1] == innerOrder) {
          parensNeeded = false;
          break;
        }
      }
    }
  }
  if (parensNeeded) {
    // Technically, this should be handled on a language-by-language basis.
    // However all known (sane) languages use parentheses for grouping.
    code = '(' + code + ')';
  }
  return code;
};

/**
 * Generate code representing the statement.  Indent the code.
 * @param {!Blockly.Block} block The block containing the input.
 * @param {string} name The name of the input.
 * @return {string} Generated code or '' if no blocks are connected.
 */
Blockly.Generator.prototype.statementToCode = function(block, name) {
  var targetBlock = block.getInputTargetBlock(name);
  var code = this.blockToCode(targetBlock);
  // Value blocks must return code and order of operations info.
  // Statement blocks must only return code.
  if (typeof code != 'string') {
    throw TypeError('Expecting code from statement block: ' +
        (targetBlock && targetBlock.type));
  }
  if (code) {
    code = this.prefixLines(/** @type {string} */ (code), this.INDENT);
  }
  return code;
};

/**
 * Add an infinite loop trap to the contents of a loop.
 * If loop is empty, add a statment prefix for the loop block.
 * @param {string} branch Code for loop contents.
 * @param {string} id ID of enclosing block.
 * @return {string} Loop contents, with infinite loop trap added.
 */
Blockly.Generator.prototype.addLoopTrap = function(branch, id) {
  id = id.replace(/\$/g, '$$$$');  // Issue 251.
  if (this.INFINITE_LOOP_TRAP) {
    branch = this.INFINITE_LOOP_TRAP.replace(/%1/g, '\'' + id + '\'') + branch;
  }
  if (this.STATEMENT_PREFIX) {
    branch += this.prefixLines(this.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + id + '\''), this.INDENT);
  }
  return branch;
};

/**
 * Comma-separated list of reserved words.
 * @type {string}
 * @private
 */
Blockly.Generator.prototype.RESERVED_WORDS_ = '';

/**
 * Add one or more words to the list of reserved words for this language.
 * @param {string} words Comma-separated list of words to add to the list.
 *     No spaces.  Duplicates are ok.
 */
Blockly.Generator.prototype.addReservedWords = function(words) {
  this.RESERVED_WORDS_ += words + ',';
};

/**
 * This is used as a placeholder in functions defined using
 * Blockly.Generator.provideFunction_.  It must not be legal code that could
 * legitimately appear in a function definition (or comment), and it must
 * not confuse the regular expression parser.
 * @type {string}
 * @private
 */
Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_ = '{leCUI8hutHZI4480Dc}';

/**
 * Define a function to be included in the generated code.
 * The first time this is called with a given desiredName, the code is
 * saved and an actual name is generated.  Subsequent calls with the
 * same desiredName have no effect but have the same return value.
 *
 * It is up to the caller to make sure the same desiredName is not
 * used for different code values.
 *
 * The code gets output when Blockly.Generator.finish() is called.
 *
 * @param {string} desiredName The desired name of the function (e.g., isPrime).
 * @param {!Array.<string>} code A list of statements.  Use '  ' for indents.
 * @return {string} The actual name of the new function.  This may differ
 *     from desiredName if the former has already been taken by the user.
 * @private
 */
Blockly.Generator.prototype.provideFunction_ = function(desiredName, code) {
  if (!this.definitions_[desiredName]) {
    var functionName = this.variableDB_.getDistinctName(desiredName,
        Blockly.Procedures.NAME_TYPE);
    this.functionNames_[desiredName] = functionName;
    var codeText = code.join('\n').replace(
        this.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
    // Change all '  ' indents into the desired indent.
    // To avoid an infinite loop of replacements, change all indents to '\0'
    // character first, then replace them all with the indent.
    // We are assuming that no provided functions contain a literal null char.
    var oldCodeText;
    while (oldCodeText != codeText) {
      oldCodeText = codeText;
      codeText = codeText.replace(/^(( {2})*) {2}/gm, '$1\0');
    }
    codeText = codeText.replace(/\0/g, this.INDENT);
    this.definitions_[desiredName] = codeText;
  }
  return this.functionNames_[desiredName];
};

/**
 * Hook for code to run before code generation starts.
 * Subclasses may override this, e.g. to initialise the database of variable
 * names.
 * @param {!Blockly.Workspace} _workspace Workspace to generate code from.
 */
Blockly.Generator.prototype.init = function(_workspace) {
  // Optionally override
};

/**
 * Common tasks for generating code from blocks.  This is called from
 * blockToCode and is called on every block, not just top level blocks.
 * Subclasses may override this, e.g. to generate code for statements following
 * the block, or to handle comments for the specified block and any connected
 * value blocks.
 * @param {!Blockly.Block} _block The current block.
 * @param {string} code The JavaScript code created for this block.
 * @return {string} JavaScript code with comments and subsequent blocks added.
 * @private
 */
Blockly.Generator.prototype.scrub_ = function(_block, code) {
  // Optionally override
  return code;
};

/**
 * Hook for code to run at end of code generation.
 * Subclasses may override this, e.g. to prepend the generated code with the
 * variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Generator.prototype.finish = function(code) {
  // Optionally override
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * Subclasses may override this, e.g. if their language does not allow
 * naked values.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Generator.prototype.scrubNakedValue = function(line) {
  // Optionally override
  return line;
};
