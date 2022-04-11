Middleware are functions which have access to request, response object and next middleware function in the application's request response cycle.
Middleware can perform below tasks:
1. Execute any code
2. Make changes to request and response objects
3. End request-response cycle.
4. Call the next middleware function in the stack

If current middleware function can't end req-res cycle, it must pass control to next middleware otherwise request will be left hanging. (How do end req-res cycle is by using res.send("your response"))

we use **app.use()** middleware which is application-level middleware(Basically instance of app object)

With next() callback method, middleware will pass control to next middleware even with same route to