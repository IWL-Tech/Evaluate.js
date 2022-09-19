import {Lexer} from "./lexer.js"
import {Interpret} from "./interpreter.js"
import {Parse} from './parser.js'
import fifo from 'fifo'
import chalk from 'chalk'

export class LexicalError {
	constructor(type, body, location, traceback) {
		console.error(chalk.red(`Lexical ${type} Error: ${body} (Line${location})`)+`\n\nTRACEBACK\n${traceback}`)
		process.exit(1)
	}
}

export function ParseTrace(traceback) {
	let Trace = "\n"
	traceback.Stack.forEach(value => {
		Trace += value
		Trace += "\n"
	})
	return Trace
}

export class CompilationError {
	constructor(type, body, location, traceback) {
		console.error(chalk.red(`Compilation ${type} Error: ${body} (Line ${location})`)+`\n\nTRACEBACK` + traceback)
		process.exit(1)
	}
}

export function run(program) {
	let tokens = Lexer(program)
	let script = Parse(tokens)
	let res = Interpret(script, true)
	if (res[0]) return res[0]
}

export class RuntimeError {
	constructor(type, body, location, traceback) {
		console.error(chalk.red(`Runtime ${type} Error: ${body} (Line ${location})`)+`\n\nTRACEBACK\n${traceback}`)
		process.exit(1)
	}
}

export class Fault {
	constructor(c) {
		console.error(`FAULT - An internal language fault has been detected! Please report this.\nFull error: \n${c}`)
		process.exit(1)
	}
}

export class StackTrace {
	constructor(verbose = false, name = "") {
		this.Stack = fifo()
		this.trueStack = fifo()
		this.verbose = verbose
		if (this.verbose) console.info(chalk.blue("Initiate stack " + name))
	}
	push(state, pos) {
		this.Stack.push(`${state}` + chalk.gray(` at position ${pos}`))
		this.trueStack.push(state)
		if (this.verbose) console.info(chalk.blue("Enter state " + state + " at line " + pos))
	}
	pop() {
		this.Stack.pop()
		this.trueStack.pop()
		if (this.verbose) console.info(chalk.blue("Exit state"))
	}
	clear() {
		this.Stack.clear()
		this.trueStack.clear()
		if (this.verbose) console.info(chalk.blue("Stack cleared"))
	}
	status() {
		return this.trueStack.last()
	}
	get traceback() {
		return this.Stack
	}
}
export const GlobalStack = new StackTrace()

export let Yard = (infix) => {
	let ops = {'<<': 1, '>>': 1, '+': 2, '-': 2, '*': 3, '/': 3, '%': 3, '¬': 4, '^': 4};
	let peek = (a) => a[a.length - 1];
	let stack = []
  
	return infix
	  .reduce((output, token) => {
		if (parseFloat(token)) {
		  output.push(token);
		}
  
		if (token in ops) {
		  while (peek(stack) in ops && ops[token] <= ops[peek(stack)])
			output.push(stack.pop());
		  stack.push(token);
		}
  
		if (token == '(') {
		  stack.push(token);
		}
  
		if (token == ')') {
		  while (peek(stack) != '(')
			output.push(stack.pop());
		  stack.pop();
		}
		return output;
	  }, [])
	  .concat(stack.reverse())
  }

export function rpn(postfix, line) {
	if (postfix.length === 0) {
		return 0;
	}
		
	var stack = [];
	
	for (var i = 0; i < postfix.length; i++) {
		var token = postfix[i];
		if (!Number.isNaN(+token)) {
			stack.push(parseFloat(token));
		}
	
		else {
		if (stack.length < 2 && token !== '¬') {
				throw new RuntimeError('ExpressionSyntax', 'Inputted expression has a syntax error - not enough inputs', line);
		}

		var y = stack.pop();
		var x = stack.pop();

		if(token == '¬') {
			if (x) stack.push(x)
			stack.push(Math.sqrt(y))
		} else if (token == '^') {
			stack.push(eval(x+'**'+' '+y))
		} else {
			let exp = x + token+' '+y
			stack.push(eval(exp));
		}
		}
	}
	
	if (stack.length > 1) {
		throw new RuntimeError('ExpressionSyntax', 'Inputted expression has a syntax error - too many inputs', line);
	}
	
	return stack.pop();
}

export const Ident = {
	NUMBER: 0,
	NEWLINE: 1,
	PLUS: 2,
	MINUS: 3,
	DIVIDE: 4,
	TIMES: 5,
	EOF: 6,
	LCBRACKET: 7,
	RCBRACKET: 8,
	ALGEBRA: 9,
	MEMSET: 10,
	TERM: 11,
	MEMCLR: 12,
	EQUALS: 13,
	LBRACKET: 14,
	RBRACKET: 15,
	LSBRACKET: 16,
	RSBRACKET: 17,
	STRING: 18,
	INITFUNC: 19,
	FUNCCALL: 20,
	PASS: 21,
	TRUE: 22,
	FALSE: 23,
	MODULO: 24,
	SQRT: 25,
	POWER: 26,
	LEFTSHIFT: 27,
	RIGHTSHIFT: 28,
	ROUND: 29,
}

export const Classify = {
	CHAR: 0,
	OPERATION: 1,
	SYSTEM: 2,
	CBRACKET: 3,
	SETTING: 4,
	MEMORY: 5,
	BRACKET: 6,
	SBRACKET: 7,
	FUNCTION: 8,
	BOOLEAN: 9
}

export const negatives = /\s|(\{)|(\})|(\+)|(\-)|(\/)|(\*)|(\^)|(\<\<)|(\>\>)|(\%)|(\¬)|(\()|(\))|(\[)|(\])|(\~)|(\#)|(\")/gi
