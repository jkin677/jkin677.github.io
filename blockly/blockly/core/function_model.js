/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2017 Google Inc.
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
 * @fileoverview Components for the function model.
 * @author marisaleung@google.com (Marisa Leung)
 */
'use strict';

goog.provide('Blockly.FunctionModel');

goog.require('Blockly.utils');


/**
 * Class for a function pointer model.
 * Holds information for the function including name, ID, and type.
 * @param {!Blockly.Workspace} workspace The function's workspace.
 * @param {string} name The name of the function. This must be unique across
 *     functions and procedures.
 * @param {string=} opt_type The type of the function like 'int' or 'string'. // Not really relevant to procedures
 *     Does not need to be unique. Field_Function can filter functions based on
 *     their type. This will default to '' which is a specific type.
 * @param {string=} opt_id The unique ID of the function. This will default to
 *     a UUID.
 * @see {Blockly.FieldVariable}
 * @constructor
 */
Blockly.FunctionModel = function(workspace, name, opt_type, opt_id) {
  /**
   * The workspace the function is in.
   * @type {!Blockly.Workspace}
   */
  this.workspace = workspace;

  /**
   * The name of the function, typically defined by the user. It must be
   * unique across all names used for procedures and functions. It may be
   * changed by the user.
   * @type {string}
   */
  this.name = name;

  /**
   * The type of the function, such as 'int' or 'sound_effect'. This may be
   * used to build a list of functions of a specific type. By default this is
   * the empty string '', which is a specific type.
   * @see {Blockly.FieldVariable}
   * @type {string}
   */
  this.type = opt_type || '';

  /**
   * A unique id for the function. This should be defined at creation and
   * not change, even if the name changes. In most cases this should be a
   * UUID.
   * @type {string}
   * @private
   */
  this.id_ = opt_id || Blockly.utils.genUid();
};

/**
 * @return {string} The ID for the function.
 */
Blockly.FunctionModel.prototype.getId = function() {
  return this.id_;
};

/**
 * A custom compare function for the FunctionModel objects.
 * @param {Blockly.FunctionModel} var1 First function to compare.
 * @param {Blockly.FunctionModel} var2 Second function to compare.
 * @return {number} -1 if name of var1 is less than name of var2, 0 if equal,
 *     and 1 if greater.
 * @package
 */
Blockly.FunctionModel.compareByName = function(var1, var2) {
  var name1 = var1.name.toLowerCase();
  var name2 = var2.name.toLowerCase();
  if (name1 < name2) {
    return -1;
  } else if (name1 == name2) {
    return 0;
  } else {
    return 1;
  }
};
