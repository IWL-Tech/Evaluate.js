# Evaluate
A bad interpreter that works

## Example program
Input: ``{67+2};``  
Result: ``69``

Input: `{210*4};`  
Result: `840`

**Syntax guide: https://itwithlyam.gitbook.io/evaluate**

## Installation
**If it exists, download the binary for your system. If not, then build from source:**

### Build from source

1. Install [GNU Make](https://www.gnu.org/software/make/).
2. Run `make install` in the source code directory to install required dependencies.

#### Windows
Run `make win`, the output will be a .exe file

#### Unix (macos/linux)
Run `make unix`, the output will be an executable

#### MacOS app
Run `make macosapp`, the output will be a .app file

## Run 
Template: `evaluate <input> [args]`

Valid arguments:
```
--input <file> -i <file> - Path to the target file
--verbose -v - Outputs the location of the interpreter at every operation
--version - Version of Evaluate installation
```
