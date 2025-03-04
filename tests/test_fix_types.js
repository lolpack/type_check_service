const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { execSync } = require("child_process");

// API endpoint
const API_HOST = "https://type-check-service-b4ffb457dde9.herokuapp.com";
// const API_HOST = "http://localhost:5002";

// Test cases (untyped Python snippets)
const TEST_CASES = {
0: `
from typing import TypeVar
T = TypeVar('T')
def first(l: list[T]) -> str:
    return l[0]
`,

1: `
from functools import wraps
def my_decorator(func: callable[[int], int]) -> callable[[str], str]:
    @wraps(func)
    def wrapper(x: str) -> str:
        return func(x)
    return wrapper
@my_decorator
def add_one(x: int) -> int:
    return x + 1
`,

2: `
from dataclasses import dataclass
@dataclass
class Person:
    name: int
    age: str
`,

3: `
from typing import Generic
class Container(Generic[int]):
    def __init__(self, value: str):
        self.value = value
`,

4: `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def method(self, y: str) -> int:
        return self.x + y
`,

5: `
from typing import Protocol
class MyProtocol(Protocol):
    def method(self, x: int) -> str: ...
class MyClass:
    def method(self, x: str) -> int:
        return len(x)
def use_protocol(p: MyProtocol) -> None:
    p.method(42)
`,

6: `
from typing import Tuple
def process_data(data: Tuple[str, ...]) -> int:
    return sum(data)
`,

7: `
class BaseClass:
    def method(self, x: int) -> int:
        return x
class SubClass(BaseClass):
    def method(self, x: str) -> str:
        return x
`,

8: `
from typing import Callable
def higher_order_function(f: Callable[[int], int]) -> Callable[[str], str]:
    def wrapper(x: str) -> str:
        return f(x)
    return wrapper
def add_two(x: int) -> int:
    return x + 2
`,

9: `
from typing import Union
def process_union(x: Union[int, str]) -> float:
    return x * 2
`,

10: `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def __add__(self, other: str) -> int:
        return self.x + other
`,

11: `
from typing import Optional
def process_optional(x: Optional[int]) -> str:
    return x.upper()
`,

12: `
class BaseClass:
    def method(self, x: int) -> int:
        return x
class Mixin:
    def method(self, x: str) -> str:
        return x
class SubClass(BaseClass, Mixin):
    pass
`,

13: `
from typing import List
class MyClass:
    def __init__(self, x: List[str]):
        self.x = x
    def method(self) -> int:
        return sum(self.x)
`,

14: `
from typing import Dict
def process_dict(d: Dict[str, int]) -> float:
    return sum(d.values())
`,

15: `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def __eq__(self, other: str) -> bool:
        return self.x == other
`,

16: `
from typing import Set
def process_set(s: Set[int]) -> str:
    return ''.join(s)
`,

17: `
class BaseClass:
    def method(self, x: int) -> int:
        return x
class SubClass(BaseClass):
    def method(self, x: int) -> str:
        return str(x)
`,

18: `
from typing import FrozenSet
def process_frozen_set(s: FrozenSet[str]) -> int:
    return sum(len(x) for x in s)
`,

19: `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def __hash__(self) -> str:
        return str(self.x)
`,

20: `
from typing import Iterator
def process_iterator(it: Iterator[int]) -> float:
    return sum(it)
`
}

// Directory for storing test results
const TEST_DIR = path.join(__dirname, "test_results");
if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
}

// Function to send request to API and return typed code
async function getTypedCode(code) {
    try {
        console.log(`Calling POST to ${API_HOST}/fix-types`)
        const response = await axios.post(`${API_HOST}/fix-types`, { code }, { headers: { "Content-Type": "application/json" } });

        return response.data.typedCode.trim();
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

    for let key in Object.keys(TEST_CASES){
        const code = TEST_CASES[i];
        console.log(`Running test case ${key}...`);

        // Get typed code from API
        const typedCode = await getTypedCode(code);

        if (!typedCode) {
            console.log(`Skipping test case ${i} due to API failure.`);
            continue;
        }

        // Save typed code to a Python file
        const filePath = path.join(TEST_DIR, `test_${key}.py`);
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
