# Chat app with lot of carefully designed bugs

# Installation

```bash
npm install
```

# API Demo
```
websocat -H 'X-User-Id: 1' -v ws://127.0.0.1:3010
curl -X POST http://127.0.0.1:3010/msg --data '{"to": "example@mail.com", "msg": "55555"}' -H 'Content-Type: application/json' -H 'X-User-Id: 1'
```
