import random

def greet(name):
    return "Hello, " + name

def add_numbers(a, b):
    return a + b

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

def reverse_list(lst):
    return lst[::-1]

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def get_details(self):
        return f"{self.name} is {self.age} years old."

def is_even(num):
    return num % 2 == 0

def find_max(lst):
    max_val = lst[0]
    for num in lst:
        if num > max_val:
            max_val = num
    return max_val

def square_elements(lst):
    return [x * x for x in lst]

def count_vowels(string):
    return sum(1 for char in string if char in "aeiouAEIOU")

class Animal:
    def __init__(self, species):
        self.species = species

    def make_sound(self):
        return "Some generic sound"

class Dog(Animal):
    def __init__(self, name):
        super().__init__("Dog")
        self.name = name

    def make_sound(self):
        return "Woof!"

def sum_list(lst):
    total = 0
    for num in lst:
        total += num
    return total

def get_random_element(lst):
    return random.choice(lst)

def string_length(s):
    return len(s)

def merge_dicts(d1, d2):
    d1.update(d2)
    return d1

def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def capitalize_words(sentence):
    return " ".join(word.capitalize() for word in sentence.split())

def divide(a, b):
    return a / b

def remove_duplicates(lst):
    return list(set(lst))

def check_palindrome(s):
    return s == s[::-1]

def even_numbers(n):
    return [x for x in range(n) if x % 2 == 0]

class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1

    def get_count(self):
        return self.count

def to_uppercase(string):
    return string.upper()

def find_longest_word(words):
    return max(words, key=len)

def word_frequencies(text):
    words = text.split()
    freq = {}
    for word in words:
        freq[word] = freq.get(word, 0) + 1
    return freq

def filter_even_numbers(lst):
    return list(filter(lambda x: x % 2 == 0, lst))

def swap_values(a, b):
    return b, a

def contains_substring(string, substring):
    return substring in string

def remove_whitespace(string):
    return string.replace(" ", "")

def print_pattern(n):
    for i in range(n):
        print("*" * (i + 1))

def cumulative_sum(lst):
    total = 0
    result = []
    for num in lst:
        total += num
        result.append(total)
    return result

def count_occurrences(lst, val):
    return lst.count(val)

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def greet_all(names):
    return [f"Hello, {name}!" for name in names]

def list_intersection(lst1, lst2):
    return list(set(lst1) & set(lst2))

def string_reversed(string):
    return string[::-1]

def flatten_list(nested_list):
    return [item for sublist in nested_list for item in sublist]

def double_numbers(lst):
    return [x * 2 for x in lst]

def average(lst):
    return sum(lst) / len(lst)

def all_positive(lst):
    return all(x > 0 for x in lst)

def read_file(filename):
    with open(filename, "r") as f:
        return f.read()

def write_file(filename, content):
    with open(filename, "w") as f:
        f.write(content)

def factorial_iterative(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def shuffle_list(lst):
    random.shuffle(lst)
    return lst

def get_unique_elements(lst):
    return list(set(lst))

def reverse_words(sentence):
    return " ".join(sentence.split()[::-1])

def merge_lists(lst1, lst2):
    return lst1 + lst2
