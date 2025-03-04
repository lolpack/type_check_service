const TEST_CASES = {
    "Basic function without annotations": `
def greet(name):
    return "Hello, " + name
`,

    "Function with multiple parameters": `
def add(a, b):
    return a + b
`,

    "Recursive function": `
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
`,

    "Function returning different types": `
def parse_value(value):
    if value.isdigit():
        return int(value)
    return value
`,
}

module.exports = TEST_CASES;