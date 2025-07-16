# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

```sh
C:\sources>pnpm create tauri-app
  ✔ Project name · tr-board
  ✔ Identifier · com.tr-board.app
  ✔ Choose which language to use for your frontend · TypeScript / JavaScript - (pnpm, yarn, npm, deno, bun)
  ✔ Choose your package manager · pnpm
  ✔ Choose your UI template · React - (https://react.dev/)
  ✔ Choose your UI flavor · TypeScript

Template created! To get started run:
cd tr-board
pnpm install
pnpm tauri android init

For Desktop development, run:
pnpm tauri dev

For Android development, run:
pnpm tauri android dev
```

## publish

```sh
pnpm tauri build
```


```sh
pnpm tauri dev -- -- "C:\sources\crawler_data"
```