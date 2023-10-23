# Electron-ClipBoard-Manager (ECM)

## Introduction
  This is a clipboard management tool implemented with Electron + React + ArcoDesign. Currently, it only supports MacOS, but support for Windows and Linux will be added in the near future. It's still in the early stages of development, so there are many defects, but the author will continue to fix them. Please add defects in the issue section, and the author will fix them in their spare time.
  PS: The UI is inspired by PasteNow.

## Development
  The project structure has not been fully optimized yet, so the development environment is not ideal. The adjustment of the project structure will be carried out after the MacOS version is perfected.

  > Node: 18.18.0  Electron: 27.0.0  React: 18.2.0  ArcoDesign: 2.53.2

### Initialization
  ```shell
    install yarn // Run in the project root directory
    cd app/renderer/src/main/
    install yarn // Initialization of rendering process
  ```
### Running
  ``` shell
    yarn start  // Start main process & rendering process
  ```
  ```shell
    yarn start:main // Start main process
    yarn start:renderer // Start rendering process
  ```

## Application Screenshots

![](docs/screenshot.png)

## Changelog
None for now
