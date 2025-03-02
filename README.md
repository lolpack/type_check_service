# type_check_service
Pass through to call chatGPT for type checking help

## Call the service

### /add-types

Takes `code` and will add types based on the prompt

```
curl -X POST https://type-check-service-b4ffb457dde9.herokuapp.com/add-types \
     -H "Content-Type: application/json" \
     -d '{"code": "def add(a, b): return a + b"}'
```

### /explain-error

Takes `code` and `typeError` to explain what the error in the code is

```
curl -X POST https://type-check-service-b4ffb457dde9.herokuapp.com/explain-error \
     -H "Content-Type: application/json" \
     -d '{
           "code": "def add(a, b): return a + b",
           "typeError": "Unsupported operand types for +: str and int"
         }'
```

## Deploy

`git push heroku main`


