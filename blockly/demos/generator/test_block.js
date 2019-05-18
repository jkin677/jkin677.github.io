goog.require('Blockly.FieldFunction')
goog.require('Blockly.Procedures')

snippet_function_counter = 0;

function makeParallelFunctions(workspace){
  blocks = workspace.getBlocksByType("multiprocess")
  for(var block in blocks){
    alert(block.getFieldValue("NAME"))
  }
}

Blockly.Blocks['functions_get'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldFunction(), "field_function");
    this.setOutput(true, null);
    this.setColour('#db6a00');
  this.setTooltip("Point to a procedure. Multiprocessing blocks that use existing procedures must be told what procedure to run.");
  this.setHelpUrl("https://en.wikipedia.org/wiki/Function_pointer");
  this.setOutput(true, 'functions_get')
  this.returns = true
  }
};

Blockly.Python['functions_get'] = function(block) {
  // Function pointer getter.
  var code = Blockly.getMainWorkspace().getBlockById(block.getFieldValue('field_function')).getFieldValue('NAME').split(' ').join('_')

  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Lua['functions_get'] = function(block) {
  // Function pointer getter.
  var code = Blockly.getMainWorkspace().getBlockById(block.getFieldValue('field_function')).getFieldValue('NAME').split(' ').join('_')

  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Blocks['multiprocess'] = {
  init: function() {
  this.inputs = []
  this.returns = true
    this.appendValueInput("POINTER")
        .setCheck('functions_get')
        .appendField("Function to Parallelise:");
    this.appendValueInput("CORES")
        .setCheck("Number")
        .appendField("Number of threads:");
    this.setOutput(true, null);
    this.setColour('#db6a00');
	this.numIterations = this.appendValueInput("ITER")
								.setCheck("Number")
								.appendField("Iterations to run:");
  this.setTooltip("Run a specified procedure in parallel. For each argument, a list of values must be supplied. The length of each list determines how many times the procedure is run.");
  this.setHelpUrl("https://en.wikipedia.org/wiki/Parallel_computing");
  this.setOutput(true, null);
  this.setInputsInline(false);

  this.options = options = [['+','ADD'],['×','MULTIPLY'],['avg', 'AVERAGE']];
  this.reduction = this.appendDummyInput("REDUCTION")
	  .appendField('What to do with outputs:')
	  .appendField(new Blockly.FieldDropdown(options), 'REDUCTION_OP')
 
  },
  
  synchroniseNumberOfInputs: function(){
	  var ourPointerBlock = this.getInputTargetBlock('POINTER')
	  var ourPointedFunction = this.workspace.getBlockById(ourPointerBlock.getFieldValue('field_function'))
	  var num = ourPointedFunction.getVars().length
	  if (num < this.inputs.length){
		  var diff = this.inputs.length - num
		  // Remove inputs
		  for (var i = 0; i < diff; i++){
			  var input = this.inputs.pop()
			  this.removeInput(input.name)
		  }
		  if (num == 0){
		  this.numIterations = this.appendValueInput("ITER")
								.setCheck("Number")
								.appendField("Iterations to run:");
		  }
	  }
	  else if (num > this.inputs.length){
		  var diff = num - this.inputs.length
		  // Add inputs
		  if (this.inputs.length == 0){
			  this.removeInput(this.numIterations.name)
		  }
		  
		  
		  var diff = num - this.inputs.length
		  for (var i = 0; i < diff; i++){
			  this.inputs.push(
				this.appendValueInput("DATA" + (this.inputs.length).toString())
					.setCheck("Array")
					.appendField('Values for Argument '+ (this.inputs.length).toString())
			  )
		  }
		  
	  }
	  
	  //Set output based on if the function returns a value or not
	  if (ourPointedFunction.type == "procedures_defnoreturn"){
		  if (this.outputConnection && this.outputConnection.targetConnection){
			  this.outputConnection.disconnect()
		  }
		  this.setOutput(false, null);
		  this.setNextStatement(true, null);
		  this.setPreviousStatement(true, null);
		  this.returns = false
	  }
	  else{
		  if (this.nextConnection && this.nextConnection.targetConnection){
			  this.nextConnection.disconnect()
		  }
		  if (this.previousConnection && this.previousConnection.targetConnection){
			  this.previousConnection.disconnect()
		  }
		  this.setPreviousStatement(false, null);
		  this.setNextStatement(false, null);
		  this.setOutput(true, null);
		  this.returns = true
	  }
  },
  
  // Mutate number of inputs depending on attached function
  onchange: function(event){
	  // Don't care about events on the toolbar
	  if (this.workspace != Blockly.getMainWorkspace()) {
		  return
	  }
	  /* Detect if a new function pointer is attached */
	  
	  //Check to see if a block was moved
	  if (event.type == Blockly.Events.BLOCK_MOVE){
		  var workspace = Blockly.getMainWorkspace()
		  var block = workspace.getBlockById(event.blockId)
		  // Check to see if a function pointer was moved
		  if (block && block.type == 'functions_get'){
			  
			  // Check to see if the block attached to us
			  if (event.newParentId == this.id){
				  //console.log('Hey! a new function pointer block was attached to me!')
				  this.synchroniseNumberOfInputs()
			  }
		  }
	  }
	  // If we have a function pointer attached, we need to watch for synchronisation events
	  if(this.getInputTargetBlock('POINTER') != null){
		  var ourPointerBlock = this.getInputTargetBlock('POINTER')
		  
		  /* Detect if the function block that our function pointer is attached to is changed */
		  if (event.type == Blockly.Events.BLOCK_CHANGE){
				  var workspace = Blockly.getMainWorkspace()
				  var block = workspace.getBlockById(event.blockId)
				  // Check to see if it was a procedure block that was changed
				  if (block.type == 'procedures_defnoreturn' || block.type == 'procedures_defreturn'){
					  // Check to see if it's the procedure block that our pointer points to
					  if(ourPointerBlock.getFieldValue('field_function') == event.blockId){
						  // Change our number of inputs to match the function
						  //console.log('Hey! The function that out pointer is pointing at has changed its inputs!')
						  this.synchroniseNumberOfInputs()
					  }
				  }
		  }
		  
		  /* Check to see if a function pointer changes it's dropdown to a different function.*/
		  if (event.type == Blockly.Events.BLOCK_CHANGE){
			  // Check to see if the block that changed is our pointer block
			  if (event.blockId == ourPointerBlock.id){
				  // Check to see if our pointer block changed it's dropdown
				  if (event.element == 'field' && event.name == 'field_function'){
					  // Change our number of inputs to the number of inputs to the new function
					  //console.log('Hey! Our function pointer is pointing at a different function!')
					  this.synchroniseNumberOfInputs()
				  }
			  }
		  }
	  }
  }
};

Blockly.Blocks['run_function_pointer'] = {
  init: function() {
  this.inputs = []
  this.returns = true
    this.appendValueInput("POINTER")
        .setCheck('functions_get')
        .appendField("Function to Run:");
    this.setOutput(true, null);
    this.setColour('#db6a00');
  this.setTooltip("Run a procedure specified by the function pointer. A value must be supplied for each argument.");
  this.setHelpUrl("https://en.wikipedia.org/wiki/Function_pointer");
  this.setOutput(true, null);
  this.setInputsInline(false);
  },
  
  synchroniseNumberOfInputs: function(){
	  var ourPointerBlock = this.getInputTargetBlock('POINTER')
	  var ourPointedFunction = this.workspace.getBlockById(ourPointerBlock.getFieldValue('field_function'))
	  var num = ourPointedFunction.getVars().length
	  if (num < this.inputs.length){
		  var diff = this.inputs.length - num
		  // Remove inputs
		  for (var i = 0; i < diff; i++){
			  var input = this.inputs.pop()
			  this.removeInput(input.name)
		  }
	  }
	  else if (num > this.inputs.length){
		  var diff = num - this.inputs.length
		  // Add inputs
		  var diff = num - this.inputs.length
		  for (var i = 0; i < diff; i++){
			  this.inputs.push(
				this.appendValueInput("DATA" + (this.inputs.length).toString())
					.appendField('Value for Argument '+ (this.inputs.length).toString())
			  )
		  }
		  
	  }
	  
	  //Set output based on if the function returns a value or not
	  if (ourPointedFunction.type == "procedures_defnoreturn"){
		  if (this.outputConnection && this.outputConnection.targetConnection){
			  this.outputConnection.disconnect()
		  }
		  this.setOutput(false, null);
		  this.setNextStatement(true, null);
		  this.setPreviousStatement(true, null);
		  this.returns = false
	  }
	  else{
		  if (this.nextConnection && this.nextConnection.targetConnection){
			  this.nextConnection.disconnect()
		  }
		  if (this.previousConnection && this.previousConnection.targetConnection){
			  this.previousConnection.disconnect()
		  }
		  this.setPreviousStatement(false, null);
		  this.setNextStatement(false, null);
		  this.setOutput(true, null);
		  this.returns = true
	  }
  },
  
  // Mutate number of inputs depending on attached function
  onchange: function(event){
	  // Don't care about events on the toolbar
	  if (this.workspace != Blockly.getMainWorkspace()) {
		  return
	  }
	  /* Detect if a new function pointer is attached */
	  
	  //Check to see if a block was moved
	  if (event.type == Blockly.Events.BLOCK_MOVE){
		  var workspace = Blockly.getMainWorkspace()
		  var block = workspace.getBlockById(event.blockId)
		  // Check to see if a function pointer was moved
		  if (block && block.type == 'functions_get'){
			  
			  // Check to see if the block attached to us
			  if (event.newParentId == this.id){
				  //console.log('Hey! a new function pointer block was attached to me!')
				  this.synchroniseNumberOfInputs()
			  }
		  }
	  }
	  // If we have a function pointer attached, we need to watch for synchronisation events
	  if(this.getInputTargetBlock('POINTER') != null){
		  var ourPointerBlock = this.getInputTargetBlock('POINTER')
		  
		  /* Detect if the function block that our function pointer is attached to is changed */
		  if (event.type == Blockly.Events.BLOCK_CHANGE){
				  var workspace = Blockly.getMainWorkspace()
				  var block = workspace.getBlockById(event.blockId)
				  // Check to see if it was a procedure block that was changed
				  if (block.type == 'procedures_defnoreturn' || block.type == 'procedures_defreturn'){
					  // Check to see if it's the procedure block that our pointer points to
					  if(ourPointerBlock.getFieldValue('field_function') == event.blockId){
						  // Change our number of inputs to match the function
						  //console.log('Hey! The function that out pointer is pointing at has changed its inputs!')
						  this.synchroniseNumberOfInputs()
					  }
				  }
		  }
		  
		  /* Check to see if a function pointer changes it's dropdown to a different function.*/
		  if (event.type == Blockly.Events.BLOCK_CHANGE){
			  // Check to see if the block that changed is our pointer block
			  if (event.blockId == ourPointerBlock.id){
				  // Check to see if our pointer block changed it's dropdown
				  if (event.element == 'field' && event.name == 'field_function'){
					  // Change our number of inputs to the number of inputs to the new function
					  //console.log('Hey! Our function pointer is pointing at a different function!')
					  this.synchroniseNumberOfInputs()
				  }
			  }
		  }
	  }
  }
};

Blockly.Python['run_function_pointer'] = function(block) {
  k = 0
  
  inputs="("
  while(k < block.inputs.length-1){
    inputs += Blockly.Python.valueToCode(block, 'DATA' + k, Blockly.Python.ORDER_ATOMIC) + ","
    k++
  }
  inputs += Blockly.Python.valueToCode(block, 'DATA' + k, Blockly.Python.ORDER_ATOMIC) + ")"
  
  code = Blockly.Python.valueToCode(block, 'POINTER', Blockly.Python.ORDER_ATOMIC) + inputs

  if(block.returns){
    return [code, Blockly.Python.ORDER_NONE];
  } else {
    return code
  }
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Lua['run_function_pointer'] = function(block) {
  k = 0
  
  inputs="("
  while(k < block.inputs.length-1){
    inputs += Blockly.Lua.valueToCode(block, 'DATA' + k, Blockly.Lua.ORDER_ATOMIC) + ","
    k++
  }
  inputs += Blockly.Lua.valueToCode(block, 'DATA' + k, Blockly.Lua.ORDER_ATOMIC) + ")"
  
  code = Blockly.Lua.valueToCode(block, 'POINTER', Blockly.Lua.ORDER_ATOMIC) + inputs
  if(block.returns){
    return [code, Blockly.Python.ORDER_NONE];
  } else {
    return code
  }
  return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Blocks['multiprocess_snippet'] = {
  init: function() {
  this.inputs = []
    this.appendValueInput("VAR")
        .appendField("With loop variable:");
    this.appendValueInput("DATA")
        .appendField("Over data set:");
    this.appendStatementInput("SNIPPET")
        .setCheck(null)
        .appendField("Execute code:");
    this.appendValueInput("CORES")
        .setCheck("Number")
        .appendField("Over cores");
    this.setOutput(false, null);
    this.setNextStatement(true, null);
    this.setPreviousStatement(true, null);
    this.setColour('#db6a00');
 this.setTooltip("");
 this.setHelpUrl("");
  },
};

Blockly.Python['multiprocess_snippet'] = function(block) {
  // Step 0: Create function code for snippet
  name = "snippet_func"+snippet_function_counter

  code_lines = []
  code_lines.push("def " + name + "(" + Blockly.Python.valueToCode(block, 'VAR', Blockly.Python.ORDER_ATOMIC) + "):")
  code_lines.push(Blockly.Python.statementToCode(block, 'SNIPPET'))
  code_lines.push("")

  // Step 1: Get input data
  data_set = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_ATOMIC)
  var function_pointer = name
  var cores = Blockly.Python.valueToCode(block, 'CORES', Blockly.Python.ORDER_ATOMIC);
  
  code_lines.push("def process_all" + snippet_function_counter + "(data" + snippet_function_counter + "):")
  code_lines.push("    pool = multiprocessing.Pool(processes=" + cores + ")")
  code_lines.push("    pool.map(" + function_pointer + ", data" + snippet_function_counter + ")")
  code_lines.push("")

  // Set up data input
  data_line = "data" + snippet_function_counter + " = " + Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_ATOMIC)
  
  code_lines.push(data_line)
  code_lines.push("process_all" + snippet_function_counter + "(data" + snippet_function_counter + ")")
  snippet_function_counter++

  // Step 3: Concatenate all the code lines into 1 string
  var code = '\n';
  for(i = 0; i < code_lines.length; i++){
    code += code_lines[i] + "\n"
  }

  return code;
};

Blockly.Lua['multiprocess_snippet'] = function(block) {
  // Step 0: Create function code for snippet
  alert("Lua does not currently support this multiprocessing block")
  code = '\n'
  return code;
};

function resetFunctionCounter(){
  snippet_function_counter = 0
}



Blockly.Python['multiprocess'] = function(block) {
  
  // // Step 1: Get input data
  // data_set = []
  // var reduction = null
  // if(block.reduction){
  //   reduction = block.getFieldValue('REDUCTION_OP')
  // } 
  
  
     
  // var k = 0
  // if(block.inputs){
  //   while(k < block.inputs.length){
  //     var new_list = []
  //     if(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD0")){
  //       if(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD0").getInputTargetBlock("ADD0")){
  //         var j = 0
  //         while(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j)){
  //           var m = 0
  //           new_sub_list = "["
  //           while(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j).getInputTargetBlock("ADD"+m)){
  //             new_sub_list += Blockly.Python.valueToCode(block.getInputTargetBlock("DATA" + k).getInputTargetBlock("ADD"+j), "ADD"+m, Blockly.Python.ORDER_ATOMIC) + ","
  //             m++
  //           }
  //           new_sub_list = new_sub_list.substring(0, new_sub_list.length-1) + "]"
  //           new_list.push(new_sub_list)
  //           j++
  //         }
  //       } else {
  //         new_list = parseList(block.getInputTargetBlock("DATA" + k), Blockly.Python.valueToCode(block, 'DATA' + k, Blockly.Python.ORDER_ATOMIC))
  //       }
  //       data_set.push({list:new_list})
  //     }
      
  //     k++
  //   }
  // } else {

  // }

  // //var data_set = Blockly.Python.valueToCode(block, 'DATA0', Blockly.Python.ORDER_ATOMIC);
  // var function_pointer = Blockly.Python.valueToCode(block, 'POINTER', Blockly.Python.ORDER_ATOMIC);
  // var cores = Blockly.Python.valueToCode(block, 'CORES', Blockly.Python.ORDER_ATOMIC);
  
  // code_lines = []
  // code_lines.push("def process_all" + snippet_function_counter + "(data" + snippet_function_counter + "):")
  // code_lines.push("    pool = multiprocessing.Pool(processes=" + cores + ")")

  // operator = ""
  // if(reduction == "ADD" || reduction  == "AVERAGE"){
  //   operator = "+"
  // } else if (reduction == "MULTIPLY"){
  //   operator = "*"
  // }
  // code_lines.push("    output " + operator + "= pool.starmap(" + function_pointer.split(' ').join('_') + ", data" + snippet_function_counter + ")")
  // if(reduction == "AVERAGE"){
  //   code_lines.push("    return output/" + cores)
  // } else {
  //   code_lines.push("    return output")
  // }
  // code_lines.push("")

  // // Set up data input
  // data_line = "data" + snippet_function_counter + " = ["
  // // Create a tuple for each set of elements (assuming all lists are of equal length)
  // // Example: [[1,2,3],[4,5,6]] => [(1,4),(2,5),(3,6)]
  // if(k > 0 && data_set[0]){
  //   for(i = 0; i < data_set[0].list.length; i++){
  //     new_tuple = "("
  //     for(j = 0; j < data_set.length; j++){
  //       new_tuple += data_set[j].list[i]
  //       if(data_set.length<2 || j<data_set.length-1)
  //         new_tuple += ", "
  //     }
  //     new_tuple += ")"
  //     data_line += new_tuple
  //     if(i<data_set[0].list.length-1)
  //       data_line += ", "
  //   }
  // }
  // else {
	// for(i = 0; i<Blockly.Python.valueToCode(block, 'ITER', Blockly.Python.ORDER_ATOMIC); i++){
	// 	data_line += "()"
	// 	if(i<Blockly.Python.valueToCode(block, 'ITER', Blockly.Python.ORDER_ATOMIC)-1){
	// 		data_line += ","
	// 	}
	// }
  // }
  // data_line += "]"
  
  
  
  // code_lines.push(data_line)
  // code_lines.push("process_all" + snippet_function_counter + "(data" + snippet_function_counter + ")")


  // // Step 3: Concatenate all the code lines into 1 string
  // var code = '\n';
  // for(i = 0; i < code_lines.length; i++){
  //   code += code_lines[i] + "\n"
  // }
  
  code = "process_all" + snippet_function_counter + "()"
  snippet_function_counter++
  if(block.reduction){
    return [code, Blockly.Python.ORDER_NONE];
  } else {
    return code
  }
};

//[[3,1,2],[5,4,6],[9,8,7]]
function parseList(block, string){
  new_data = []
  string = string.replace(/ /g,"")
  string = string.substring(1,string.length-1).split(",")
  
  //[3,1,2] [5,4,6] [9,8,7]
  
  for(i = 0; i < string.length; i++){
    //Get type of array element
    type = "None"
    if (block.getInputTargetBlock("ADD" + i)  )
      type = block.getInputTargetBlock("ADD" + i).type

    //Convert element from string to correct type
    if(type == "None"){
      new_data.push(type)
    } else if (type.includes("math")){
      new_data.push(parseInt(string[i]))
    } else if (type.includes("list")){
      new_data.push(parseList(block.getInputTargetBlock("ADD" + i), Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_ATOMIC)))
    } else {
      new_data.push(string[i])
    }
  }
  return new_data
}

Blockly.Lua['multiprocess'] = function(block) {
  // Step 1: Get input data
  data_set = [];
  var reduction = null;
  if(block.reduction){
    reduction = block.getFieldValue('REDUCTION_OP');
  } 
  k = 0
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
  
  if (functionPointerBlock == null){
	  alert("Please attach a function pointer to all multiprocessing blocks");
	  if(block.reduction){
		return ['\n', Blockly.Python.ORDER_NONE];
	  } 
	  else {
		return '\n';
	  }
  }
  var functionBeingPointedTo = Blockly.getMainWorkspace().getBlockById(functionPointerBlock.getFieldValue('field_function'));

  operator = "";
  if(reduction == "ADD" || reduction  == "AVERAGE"){
    operator = "+";
  } else if (reduction == "MULTIPLY"){
    operator = "*";
  }
  
  var arguments = functionBeingPointedTo.getVars();
  
  
  var function_name = function_pointer.split(' ').join('_')
  if (function_name == 'function'){
	  function_name += '2'
  }
  code_lines = [];

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
  data_line = "    local args = {";
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

Blockly.Blocks['procedures_defreturn'] = {
  /**
   * Block for defining a procedure with a return value.
   * @this Blockly.Block
   */
  init: function() {
    var nameField = new Blockly.FieldTextInput('',
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg['PROCEDURES_DEFRETURN_TITLE'])
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.appendValueInput('RETURN')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg['PROCEDURES_DEFRETURN_RETURN']);
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    if ((this.workspace.options.comments ||
         (this.workspace.options.parentWorkspace &&
          this.workspace.options.parentWorkspace.options.comments)) &&
        Blockly.Msg['PROCEDURES_DEFRETURN_COMMENT']) {
      this.setCommentText(Blockly.Msg['PROCEDURES_DEFRETURN_COMMENT']);
    }
    this.setStyle('procedure_blocks');
    this.setTooltip(Blockly.Msg['PROCEDURES_DEFRETURN_TOOLTIP']);
    this.setHelpUrl(Blockly.Msg['PROCEDURES_DEFRETURN_HELPURL']);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;
  },
  setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
  updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
  mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
  decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
  compose: Blockly.Blocks['procedures_defnoreturn'].compose,
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, true];
  },
  getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
  getVarModels: Blockly.Blocks['procedures_defnoreturn'].getVarModels,
  renameVarById: Blockly.Blocks['procedures_defnoreturn'].renameVarById,
  updateVarName: Blockly.Blocks['procedures_defnoreturn'].updateVarName,
  displayRenamedVar_: Blockly.Blocks['procedures_defnoreturn'].displayRenamedVar_,
  customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
  callType_: 'procedures_callreturn'
};

Blockly.Blocks['procedures_getpointer'] = {
  /**
   * Block for calling a procedure with a return value.
   * @this Blockly.Block
   */
  init: function() {
    this.appendDummyInput('TOPROW')
        .appendField('', 'NAME');
    this.setOutput(true);
    this.setStyle('procedure_blocks');
    // Tooltip is set in domToMutation.
    this.setHelpUrl(Blockly.Msg['PROCEDURES_CALLRETURN_HELPURL']);
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousDisabledState_ = false;
  },

  getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
  renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
  setProcedureParameters_:
      Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters_,
  updateShape_: Blockly.Blocks['procedures_callnoreturn'].updateShape_,
  mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
  getVarModels: Blockly.Blocks['procedures_callnoreturn'].getVarModels,
  onchange: Blockly.Blocks['procedures_callnoreturn'].onchange,
  customContextMenu:
      Blockly.Blocks['procedures_callnoreturn'].customContextMenu,
  defType_: 'procedures_defreturn'
};
