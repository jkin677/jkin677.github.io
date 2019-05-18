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
 * @fileoverview Variable input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldFunction');
goog.require('Blockly.FunctionModel');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.utils');
goog.require('Blockly.VariableModel');
goog.require('Blockly.Variables');
goog.require('Blockly.Blocks');

goog.require('goog.math.Size');


/**
 * Class for a variable's dropdown field.
 * @param {?string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected.  Its sole argument is the new option value.
 * @param {Array.<string>=} opt_variableTypes A list of the types of variables
 *     to include in the dropdown.
 * @param {string=} opt_defaultType The type of variable to create if this
 *     field's value is not explicitly set.  Defaults to ''.
 * @extends {Blockly.FieldDropdown}
 * @constructor
 */
Blockly.FieldFunction = function(varname, opt_validator, opt_variableTypes,
    opt_defaultType) {
  // The FieldDropdown constructor would call setValue, which might create a
  // spurious variable.  Just do the relevant parts of the constructor.
  this.menuGenerator_ = Blockly.FieldFunction.dropdownCreate;
  this.size_ = new goog.math.Size(0, Blockly.BlockSvg.MIN_BLOCK_Y);
  this.setValidator(opt_validator);
  this.defaultVariableName = (Blockly.getMainWorkspace().getBlockById("ORIGIN_BLOCK").getFieldValue('NAME') || '');
  
  this.setTypes_(opt_variableTypes, opt_defaultType);
  this.value_ = null;
};
goog.inherits(Blockly.FieldFunction, Blockly.FieldDropdown);

/**
 * Construct a FieldFunction from a JSON arg object,
 * dereferencing any string table references.
 * @param {!Object} options A JSON object with options (variable,
 *                          variableTypes, and defaultType).
 * @return {!Blockly.FieldFunction} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldFunction.fromJson = function(options) {
  var varname = Blockly.utils.replaceMessageReferences(options['variable']);
  var variableTypes = options['variableTypes'];
  var defaultType = options['defaultType'];
  return new Blockly.FieldFunction(varname, null, variableTypes, defaultType);
};

/**
 * Initialize everything needed to render this field.  This includes making sure
 * that the field's value is valid.
 * @public
 */
Blockly.FieldFunction.prototype.init = function() {
  if (this.fieldGroup_) {
    // Dropdown has already been initialized once.
    return;
  }
  Blockly.FieldFunction.superClass_.init.call(this);

  // TODO (#1010): Change from init/initModel to initView/initModel
  this.initModel();
};

/**
 * Initialize the model for this field if it has not already been initialized.
 * If the value has not been set to a variable by the first render, we make up a
 * variable rather than let the value be invalid.
 * @package
 */
Blockly.FieldFunction.prototype.initModel = function() {
  if (this.function_) {
    return; // Initialization already happened.
  }
  this.workspace_ = this.sourceBlock_.workspace;
  var variable = Blockly.Procedures.getProcedureByName(Blockly.getMainWorkspace(), this.defaultVariableName);

  // Don't fire a change event for this setValue.  It would have null as the
  // old value, which is not valid.
  Blockly.Events.disable();
  try {
    this.setValue(variable.id);
  } finally {
    Blockly.Events.enable();
  }
};

/* When a function block is renamed, check for any pointers that are pointing to this function, and change their name too. */
Blockly.FieldFunction.prototype.onFunctionRename = function(event) {
	if (event.type == 'change'){
		var block = Blockly.getMainWorkspace().getBlockById(event.blockId)
		if (block.type == 'procedures_defreturn' || block.type == 'procedures_defnoreturn') {
			if (event.element == 'field' && event.name == 'NAME') {
				var procedurePointerBlocks = Blockly.getMainWorkspace().getBlocksByType('functions_get')
				for (var i = 0; i < procedurePointerBlocks.length; i++){
					if (procedurePointerBlocks[i].getField('field_function').function_ 
						&& procedurePointerBlocks[i].getField('field_function').function_.getId() == event.blockId){
						procedurePointerBlocks[i].getField('field_function').setText(event.newValue)
					}
				}
			}
		}
	}
}

/**
 * Dispose of this field.
 * @public
 */
Blockly.FieldFunction.prototype.dispose = function() {
  Blockly.FieldFunction.superClass_.dispose.call(this);
  this.workspace_ = null;
  this.variableMap_ = null;
};

/**
 * Attach this field to a block.
 * @param {!Blockly.Block} block The block containing this field.
 */
Blockly.FieldFunction.prototype.setSourceBlock = function(block) {
  if (block.isShadow()) {
    throw Error('Variable fields are not allowed to exist on shadow blocks.');
  }
  Blockly.FieldFunction.superClass_.setSourceBlock.call(this, block);
};

/**
 * Get the variable's ID.
 * @return {string} Current variable's ID.
 */
Blockly.FieldFunction.prototype.getValue = function() {
  return this.function_ ? this.function_.getId() : null;
};

/**
 * Get the text from this field, which is the selected variable's name.
 * @return {string} The selected variable's name, or the empty string if no
 *     variable is selected.
 */
Blockly.FieldFunction.prototype.getText = function() {
  return this.function_ ? this.function_.name : '';
};

/**
 * Get the variable model for the selected variable.
 * Not guaranteed to be in the variable map on the workspace (e.g. if accessed
 * after the variable has been deleted).
 * @return {Blockly.VariableModel} The selected variable, or null if none was
 *     selected.
 * @package
 */
Blockly.FieldFunction.prototype.getVariable = function() {
  return this.function_
};

/**
 * Set the variable ID.
 * @param {string} id New variable ID, which must reference an existing
 *     variable.
 */
Blockly.FieldFunction.prototype.setValue = function(id) {
  var workspace = Blockly.getMainWorkspace();
  var variable = workspace.getBlockById(id);

  if (!variable) {
    throw Error('Variable id doesn\'t point to a real variable!  ID was ' + id);
  }
  // Type checks!
  var type = variable.type;
  if (!this.typeIsAllowed_(type)) {
    throw Error('Variable type doesn\'t match this field!  Type was ' + type);
  }
  if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
    var oldValue = this.function_ ? this.function_.getId() : null;
    Blockly.Events.fire(new Blockly.Events.BlockChange(
        this.sourceBlock_, 'field', this.name, oldValue, id));
  }
  this.function_ = new Blockly.FunctionModel(workspace, variable.name, '', variable.id);
  this.value_ = id;
  this.setText(variable.getFieldValue('NAME'));
};

/**
 * Check whether the given variable type is allowed on this field.
 * @param {string} type The type to check.
 * @return {boolean} True if the type is in the list of allowed types.
 * @private
 */
Blockly.FieldFunction.prototype.typeIsAllowed_ = function(type) {
  var typeList = this.getVariableTypes_();
  if (!typeList) {
    return true; // If it's null, all types are valid.
  }
  for (var i = 0; i < typeList.length; i++) {
    if (type == typeList[i]) {
      return true;
    }
  }
  return false;
};

/**
 * Return a list of variable types to include in the dropdown.
 * @return {!Array.<string>} Array of variable types.
 * @throws {Error} if variableTypes is an empty array.
 * @private
 */
Blockly.FieldFunction.prototype.getVariableTypes_ = function() {
  // TODO (#1513): Try to avoid calling this every time the field is edited.
  var variableTypes = this.variableTypes;
  if (variableTypes === null) {
    // If variableTypes is null, return all variable types.
    if (this.sourceBlock_) {
      var workspace = this.sourceBlock_.workspace;
      return workspace.getVariableTypes();
    }
  }
  variableTypes = variableTypes || [''];
  if (variableTypes.length == 0) {
    // Throw an error if variableTypes is an empty list.
    var name = this.getText();
    throw Error('\'variableTypes\' of field variable ' +
      name + ' was an empty list');
  }
  return variableTypes;
};

/**
 * Parse the optional arguments representing the allowed variable types and the
 * default variable type.
 * @param {Array.<string>=} opt_variableTypes A list of the types of variables
 *     to include in the dropdown.  If null or undefined, variables of all types
 *     will be displayed in the dropdown.
 * @param {string=} opt_defaultType The type of the variable to create if this
 *     field's value is not explicitly set.  Defaults to ''.
 * @private
 */
Blockly.FieldFunction.prototype.setTypes_ = function(opt_variableTypes,
    opt_defaultType) {
  // If you expected that the default type would be the same as the only entry
  // in the variable types array, tell the Blockly team by commenting on #1499.
  var defaultType = opt_defaultType || '';
  // Set the allowable variable types.  Null means all types on the workspace.
  if (opt_variableTypes == null || opt_variableTypes == undefined) {
    var variableTypes = null;
  } else if (Array.isArray(opt_variableTypes)) {
    var variableTypes = opt_variableTypes;
    // Make sure the default type is valid.
    var isInArray = false;
    for (var i = 0; i < variableTypes.length; i++) {
      if (variableTypes[i] == defaultType) {
        isInArray = true;
      }
    }
    if (!isInArray) {
      throw Error('Invalid default type \'' + defaultType + '\' in ' +
          'the definition of a FieldFunction');
    }
  } else {
    throw Error('\'variableTypes\' was not an array in the definition of ' +
        'a FieldFunction');
  }
  // Only update the field once all checks pass.
  
  // These types work fine, but maybe we should look into this more?
  this.defaultType_ = '';
  this.variableTypes = ['', 'procedures_defnoreturn', 'procedures_defreturn']; 
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {Blockly.FieldFunction}
 */
Blockly.FieldFunction.dropdownCreate = function() {
  if (!this.function_) {
    throw Error('Tried to call dropdownCreate on a variable field with no' +
        ' variable selected.');
  }
  var name = this.getText();
  var workspace = null;
  if (this.sourceBlock_) {
    workspace = this.sourceBlock_.workspace;
  }
  var functions = [];
  if (workspace) {
    functions = Blockly.Procedures.getAllProcedureModels(workspace);
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
  }
  functions.sort(Blockly.FunctionModel.compareByName);

  var options = [];
  for (var i = 0; i < functions.length; i++) {
    // Set the UUID as the internal representation of the variable.
    options[i] = [functions[i].name, functions[i].getId()];
  }
  if (options.length == 0){
	options[0] = ['No functions available!!', '123575678']
  }
  return options;
};

/**
 * Handle the selection of an item in the variable dropdown menu.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {!goog.ui.Menu} menu The Menu component clicked.
 * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
 */
Blockly.FieldFunction.prototype.onItemSelected = function(menu, menuItem) {
  var id = menuItem.getValue();
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    var workspace = this.sourceBlock_.workspace;
    if (id == Blockly.RENAME_VARIABLE_ID) {
      // Rename variable.
      Blockly.Variables.renameVariable(workspace, this.function_);
      return;
    } else if (id == Blockly.DELETE_VARIABLE_ID) {
      // Delete variable.
      workspace.deleteVariableById(this.function_.getId());
      return;
    }

    // TODO (#1529): Call any validation function, and allow it to override.
  }
  this.setValue(id);
};

/**
 * Overrides referencesVariables(), indicating this field does not refer to a variable.
 * @return {boolean} True.
 * @package
 * @override
 */
Blockly.FieldFunction.prototype.referencesVariables = function() {
  return false;
};

Blockly.Field.register('field_function', Blockly.FieldFunction);
