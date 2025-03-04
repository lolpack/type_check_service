const TEST_CASES = {
    "Incorrect return type": `
def add(x: int, y: int) -> str:
    return x + y
`,

    "Mismatched argument types": `
def multiply(x: int, y: int) -> int:
    return x * y

result = multiply("2", 3)
`,

    "None return type conflict": `
def get_name() -> str:
    if some_condition:
        return "Alice"
    else:
        return None
`,

    "Variable reassignment with different types": `
x: int = 10
x = "string"
`,

    "Incompatible list element types": `
from typing import List

numbers: List[int] = [1, 2, "three", 4]
`,

    "Incorrect dictionary value type": `
from typing import Dict

data: Dict[str, int] = {
    "one": 1,
    "two": "two",
}
`,

    "Calling an object that is not callable": `
x = 42
result = x()
`,

    "Function missing required argument": `
def divide(a: int, b: int) -> float:
    return a / b

result = divide(10)
`,

    "Using 'Any' type incorrectly": `
from typing import Any

def process(data: Any) -> int:
    return data + 10
`,

    "Type conflict in tuple assignment": `
from typing import Tuple

coordinates: Tuple[int, int] = (10, "20")
`,

    "Incorrect return type with generators": `
from typing import Generator

def count() -> Generator[int, None, None]:
    yield "not an int"
`,

    "Incompatible type in set": `
from typing import Set

ids: Set[int] = {1, 2, "three"}
`,

    "Invalid union type usage": `
from typing import Union

def fetch_data() -> Union[int, str]:
    return [1, 2, 3]
`,

    "Incorrectly typed callable": `
from typing import Callable

def execute(func: Callable[[int, int], int]) -> int:
    return func("hello", "world")
`,

    "Assigning a function to a variable with a wrong type hint": `
from typing import Callable

adder: Callable[[int, int], int] = "not a function"
`,

    "Accessing nonexistent attributes": `
class Person:
    def __init__(self, name: str):
        self.name = name

p = Person("Alice")
print(p.age)
`,

    "Type error in class inheritance": `
class Animal:
    def speak(self) -> int:
        return "Hello"
`,

    "Mismatch in typed NamedTuple field": `
from typing import NamedTuple

class Point(NamedTuple):
    x: int
    y: int

p = Point(x="string", y=5)
`,

    "Unpacking incorrect number of values": `
from typing import Tuple

def get_point() -> Tuple[int, int]:
    return (1, 2, 3)

x, y = get_point()
`,

    "Using incorrect key type for a dictionary": `
from typing import Dict

d: Dict[int, str] = {
    "one": "hello",
    2: "world"
}
`
};

module.exports = TEST_CASES;