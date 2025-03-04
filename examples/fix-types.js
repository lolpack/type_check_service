const TEST_CASES = {
    "Incorrect return type in generic function": `
from typing import TypeVar
T = TypeVar('T')
def first(l: list[T]) -> str:
    return l[0]
`,
    "Decorator type mismatch": `
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
    "Dataclass field type mismatch": `
from dataclasses import dataclass
@dataclass
class Person:
    name: int
    age: str
`,
    "Generic class with incorrect type argument": `
from typing import Generic
class Container(Generic[int]):
    def __init__(self, value: str):
        self.value = value
`,
    "Operator type mismatch": `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def method(self, y: str) -> int:
        return self.x + y
`,
    "Protocol method signature mismatch": `
from typing import Protocol
class MyProtocol(Protocol):
    def method(self, x: int) -> str: ...
class MyClass:
    def method(self, x: str) -> int:
        return len(x)
def use_protocol(p: MyProtocol) -> None:
    p.method(42)
`,
    "Tuple element type mismatch in sum": `
from typing import Tuple
def process_data(data: Tuple[str, ...]) -> int:
    return sum(data)
`,
    "Subclass method signature mismatch": `
class BaseClass:
    def method(self, x: int) -> int:
        return x
class SubClass(BaseClass):
    def method(self, x: str) -> str:
        return x
`,
    "Incorrect callable argument types": `
from typing import Callable
def higher_order_function(f: Callable[[int], int]) -> Callable[[str], str]:
    def wrapper(x: str) -> str:
        return f(x)
    return wrapper
def add_two(x: int) -> int:
    return x + 2
`,
    "Union type misuse in operation": `
from typing import Union
def process_union(x: Union[int, str]) -> float:
    return x * 2
`,
    "Incorrect operator overloading type": `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def __add__(self, other: str) -> int:
        return self.x + other
`,
    "Optional type misused with method call": `
from typing import Optional
def process_optional(x: Optional[int]) -> str:
    return x.upper()
`,
    "Mixin method resolution order issue": `
class BaseClass:
    def method(self, x: int) -> int:
        return x
class Mixin:
    def method(self, x: str) -> str:
        return x
class SubClass(BaseClass, Mixin):
    pass
`,
    "List of strings used in sum": `
from typing import List
class MyClass:
    def __init__(self, x: List[str]):
        self.x = x
    def method(self) -> int:
        return sum(self.x)
`,
    "Dictionary values incorrectly summed": `
from typing import Dict
def process_dict(d: Dict[str, int]) -> float:
    return sum(d.values())
`,
    "Equality operator mismatch": `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def __eq__(self, other: str) -> bool:
        return self.x == other
`,
    "Set used incorrectly in string join": `
from typing import Set
def process_set(s: Set[int]) -> str:
    return ''.join(s)
`,
    "Contravariant subclass method issue": `
class BaseClass:
    def method(self, x: int) -> int:
        return x
class SubClass(BaseClass):
    def method(self, x: int) -> str:
        return str(x)
`,
    "FrozenSet processing with sum": `
from typing import FrozenSet
def process_frozen_set(s: FrozenSet[str]) -> int:
    return sum(len(x) for x in s)
`,
    "Incorrect hash return type": `
class MyClass:
    def __init__(self, x: int):
        self.x = x
    def __hash__(self) -> str:
        return str(self.x)
`,
    "Iterator processing with sum": `
from typing import Iterator
def process_iterator(it: Iterator[int]) -> float:
    return sum(it)
`
}

module.exports = TEST_CASES;