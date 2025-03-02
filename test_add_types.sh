#!/bin/bash

# Define API endpoint
API_URL="https://type-check-service-b4ffb457dde9.herokuapp.com/add-types"
# API_URL="localhost:5002/add-types"

# Define test cases (untyped Python snippets)
declare -a TEST_CASES=(
    # Basic functions
    "def add(a, b): return a + b"
    "def greet(name): return 'Hello, ' + name"
    "def factorial(n): return 1 if n == 0 else n * factorial(n - 1)"
    
    # Class with methods
    "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def get_info(self):\n        return f'{self.name} is {self.age} years old.'"

    # Function with default parameters
    "def power(base, exponent=2): return base ** exponent"

    # Using map and lambda
    "def square_list(nums): return list(map(lambda x: x * x, nums))"

    # Nested functions
    "def outer(x):\n    def inner(y):\n        return x + y\n    return inner"

    # Decorators
    "def log_decorator(func):\n    def wrapper(*args, **kwargs):\n        print(f'Calling {func.__name__}')\n        return func(*args, **kwargs)\n    return wrapper\n\n@log_decorator\ndef say_hello():\n    print('Hello!')"

    # List comprehension
    "def filter_even(nums): return [x for x in nums if x % 2 == 0]"

    # Using zip
    "def pair_names(names, ages): return list(zip(names, ages))"

    # Generator function
    "def count_up_to(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1"

    # Async function
    "import asyncio\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return 'data received'"

    # Metaclass example
    "class Meta(type):\n    def __new__(cls, name, bases, dct):\n        dct['created_by'] = 'metaclass'\n        return super().__new__(cls, name, bases, dct)\n\nclass CustomClass(metaclass=Meta):\n    pass"

    # Using functools
    "from functools import reduce\n\ndef product(nums):\n    return reduce(lambda x, y: x * y, nums, 1)"

    # Using try-except
    "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 'Cannot divide by zero'"

    # Dictionary comprehension
    "def square_dict(nums): return {x: x*x for x in nums}"

    # Recursive Fibonacci
    "def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    return fibonacci(n-1) + fibonacci(n-2)"

    # Using itertools
    "import itertools\n\ndef cycle_colors(colors):\n    return itertools.cycle(colors)"
)

npm i pyright

# Create a test directory
TEST_DIR="test_results"
mkdir -p $TEST_DIR

# Iterate through test cases
for i in "${!TEST_CASES[@]}"; do
    echo "Running test case $((i+1))..."

    # Prepare JSON payload
    JSON_PAYLOAD=$(jq -n --arg code "${TEST_CASES[$i]}" '{code: $code}')

    # Send request and save response
    RESPONSE=$(curl -s -X POST $API_URL \
        -H "Content-Type: application/json" \
        -d "$JSON_PAYLOAD")

    # Extract typed code from JSON response
    TYPED_CODE=$(echo "$RESPONSE" | jq -r '.typedCode' | sed 's/\r//g')

    if [[ "$TYPED_CODE" == "null" ]]; then
        echo "Error: No typed code returned. Response: $RESPONSE"
        continue
    fi

    # Save typed code to a Python file
    FILE="$TEST_DIR/test_$i.py"
    echo -e "$TYPED_CODE" > "$FILE"

    # Run pyright to check type correctness
    echo "Checking types with pyright on $FILE..."
    PYRIGHT_ERRORS=$(node node_modules/pyright/index.js "$FILE" 2>&1)

    # Print errors to console
    echo "$PYRIGHT_ERRORS"

    echo -e "\n\nTest Case\n\n" >> "$FILE"
    echo -e "${TEST_CASES[$i]}" >> "$FILE"

    # Append errors to the bottom of the test file
    if [[ -n "$PYRIGHT_ERRORS" ]]; then
        echo -e "\n# --- Pyright Output ---\n" >> "$FILE"
        echo "$PYRIGHT_ERRORS" >> "$FILE"
    fi

    echo "----------------------------------------"
done

echo "All tests completed."
