const util = require("./util")

/*
// TS Syntax from ComplicatedCalculator archive

type BodyItem = {
	type: string;
	kind?: string;
	declarations?: {
		type?: string;
		id?: {
			name: any;
		}
		init?: {
			value: string;
		}
	};
	value: string
	
	
}

type Tree = {
	type: string;
	tokens: any[];
	length: number;
	body: BodyItem[]
}
*/

function Parse(tokens) {
	let body = []
	let current = 0;
	let block = false
	let line = 1
	let bar = false

	tokens.forEach((element) => {
		if (element.read) return;
		if (element.ident == 6) {
			if (bar && block) throw new util.CompilationError("UnnexpectedEOF", "An EOF was given instead of an Equation Close", line)
			bar = true
			body.push({
				type: "EOF",
				value: element.char
			})
		}
		
		switch(element.ident) {
			case 1:
				
				current += 1
				body.push({
					type: "newline",
					value: element.char
				})
				return line += 1
			case 7:
			tokens[current].read = true
			current += 1
				if (block) throw new util.CompilationError("EquationOpen", "Equations within equations are not permitted", line)
				body.push({
					type: "eopen",
					value: element.char
				})
				return block = true;
				
			case 8:
			tokens[current].read = true
			current += 1
				if (!block) throw new util.CompilationError("EquationClosed", "Equations must be opened before closed", line)
				body.push({
					type: "eclose",
					value: element.char
				})
				return block = false;
			case 2:
			case 3:
			case 4:
			case 5:
				tokens[current].read = true
				return body.push({
					type: "operation",
					value: element.char
				})
		}
		if (element.ident == 0) {
			tokens[current].read = true
			return body.push({
				type: "number",
				value: parseFloat(element.char)
			})
		}
		if (element.ident == 11) {
			tokens[current].read = true
			tokens[current + 1].read = true
			body.push({
				type: "memory",
				kind: "var",
				value: "var " + tokens[current + 1].char,
				declarations: {
					id: {
						name: tokens[current + 1].char
					}
				}
			})
			return current += 2
		}
		if (element.ident == 10) {
			tokens[current + 1].read = true
			tokens[current].read = true
			tokens[current + 2].read = true
			body.push({
				type: "memory",
				kind: "mset",
				declarations: {
					id: {
						name: tokens[current + 1].char,
					},
					init: {
						value: tokens[current + 2].char,
					}
				},
				value: "mset " + tokens[current + 1].char + " " + tokens[current + 2].char
			})
			return current += 3
		}
		current += 1
	})
	let AST = {
		type: "Program",
		tokens: tokens,
		length: tokens.length,
		body: body
	}
	return AST
}

module.exports = {
	Parse
}
