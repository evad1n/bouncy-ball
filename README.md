# bouncy-ball
Low effort flappy bird clone in electron

Don't use WSL unless you want to suffer

Electron forge will build based on your architecture so WSL tries to build linux on windows and it's not good.

```
npm install
npm run make
```

Executable will be in the ./out folder under your architecture.
Once built, the exe only needs the build folder to run, so you don't have to keep the code around if it hurts your eyes.
