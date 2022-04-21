import {RuntimeError, ParseTrace} from '../util.js'
import {Interpret} from '../interpreter.js'

const StandardLibrary = ["simplify", "printf", "equate", "panic", "logic"]

// Standard Library
import simplify from "./standard/simplify.js"
import output from "./standard/output.js"
import evaluate from "./standard/equate.js"
import panic from "./standard/panic.js"
import logic from "./standard/logic.js"

export default {
	name: "callfunc",
	description: "run function",
	execute(func, args, line, trace, memory, compiled) {
		let res = null
		if (memory.hasOwnProperty(func)) {
			res = Interpret(memory[func].ast, true, false) 
		} else {
			if (!StandardLibrary.includes(func)) throw new RuntimeError("StandardLibrary", "Function does not exist", line, ParseTrace(trace))
			switch(func) {
				case 'simplify':
					res = simplify(args, line, trace, compiled)
					break;
				case 'printf':
					console.log("here")
					res = output(args, line, trace, compiled)
					break;
				case "equate":
					res = evaluate(args, line, trace, compiled)
					break;
				case "panic":
					res = panic(line, trace, compiled)
					break;
				case "logic":
					res = logic(args, line, trace, compiled)
					break;
			}
		}
		return res
	}
}