import equate from "../equate.js"
import {RuntimeError, ParseTrace} from '../../util.js'

export default function eqfunc(args, line, trace) {
	try {
		let statement = args[0].split(' ')
		statement.shift()
		return equate.execute(statement, line)
	} catch(err) {
		console.log(err)
		throw new RuntimeError("StandardLibraryEquate", "An error occured during evaluation", line, ParseTrace(trace))
	}
}