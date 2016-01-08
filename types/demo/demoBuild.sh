Simput -r demo
Simput -c src/ -o versions/.  -t demo
Simput -a versions/demo.js
npm run test -- -i types/demo/samples/empty/demo-empty.json -o types/demo/samples/empty/. --silent

