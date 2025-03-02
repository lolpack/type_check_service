const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { execSync } = require("child_process");

// API endpoint
const API_URL = "https://type-check-service-b4ffb457dde9.herokuapp.com/add-types";
// const API_URL = "http://localhost:5002/add-types"; // Uncomment for local testing

// Test cases (untyped Python snippets)
const TEST_CASES = [
    `def add(a, b): return a + b`,
    `def greet(name): return 'Hello, ' + name`,
    `def factorial(n): return 1 if n == 0 else n * factorial(n - 1)`,
    `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def get_info(self):
        return f'{self.name} is {self.age} years old.'`,

    `def power(base, exponent=2): return base ** exponent`,
    `def square_list(nums): return list(map(lambda x: x * x, nums))`,
    `def outer(x):
    def inner(y):
        return x + y
    return inner`,

    `def log_decorator(func):
    def wrapper(*args, **kwargs):
        print(f'Calling {func.__name__}')
        return func(*args, **kwargs)
    return wrapper

@log_decorator
def say_hello():
    print('Hello!')`,

    `def filter_even(nums): return [x for x in nums if x % 2 == 0]`,
    `def pair_names(names, ages): return list(zip(names, ages))`,
    `def count_up_to(n):
    i = 0
    while i < n:
        yield i
        i += 1`,

    `import asyncio
async def fetch_data():
    await asyncio.sleep(1)
    return 'data received'`,

    `class Meta(type):
    def __new__(cls, name, bases, dct):
        dct['created_by'] = 'metaclass'
        return super().__new__(cls, name, bases, dct)

class CustomClass(metaclass=Meta):
    pass`,

    `from functools import reduce
def product(nums):
    return reduce(lambda x, y: x * y, nums, 1)`,

    `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 'Cannot divide by zero'`,

    `def square_dict(nums): return {x: x*x for x in nums}`,
    `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    return fibonacci(n-1) + fibonacci(n-2)`,

    `import itertools
def cycle_colors(colors):
    return itertools.cycle(colors)`
];

// Directory for storing test results
const TEST_DIR = path.join(__dirname, "test_results");
if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
}

// Function to send request to API and return typed code
async function getTypedCode(code) {
    try {
        console.log(`Calling POST to ${API_URL}`)
        const response = await axios.post(API_URL, { code }, { headers: { "Content-Type": "application/json" } });
        let typedCode = response.data.typedCode.trim();

        return typedCode;
    } catch (error) {
        console.error("Error getting typed code:", error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to run pyright on a file
function runPyright(filePath) {
    try {
        return execSync(`node node_modules/pyright/index.js "${filePath}"`, { encoding: "utf-8" });
    } catch (error) {
        console.error(error)
        return error.stdout || error.stderr;
    }
}

// Main function to run tests
async function runTests() {
    console.log("Starting tests...");

    for (let i = 0; i < TEST_CASES.length; i++) {
        const code = TEST_CASES[i];
        console.log(`Running test case ${i + 1}...`);

        // Get typed code from API
        const typedCode = await getTypedCode(code);

        if (!typedCode) {
            console.log(`Skipping test case ${i + 1} due to API failure.`);
            continue;
        }

        // Save typed code to a Python file
        const filePath = path.join(TEST_DIR, `test_${i}.py`);
        fs.writeFileSync(filePath, typedCode);

        // Run pyright and capture output
        console.log(`Checking types with pyright on ${filePath}...`);
        const pyrightOutput = runPyright(filePath);

        // Append test case and Pyright output to the file
        fs.appendFileSync(filePath, `\n\n# --- Original Test Case ---\n${code}\n`);
        fs.appendFileSync(filePath, `\n# --- Pyright Output ---\n${pyrightOutput}`);

        console.log(pyrightOutput);
        console.log("----------------------------------------");
    }

    console.log("All tests completed.");
}

// Run the tests
runTests();
