# Chat app with lot of carefully designed bugs

# Installation

```bash
TODO
```

# API Demo
```
websocat -H 'X-User-Id: 1' -v ws://127.0.0.1:3000
curl -X POST http://127.0.0.1:3000/msg --data '{"msg":55555}' -H 'Content-Type: application/json' -H 'X-User-Id: 1'
```