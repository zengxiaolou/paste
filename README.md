# Electron-ClipBoard-Manager (ECM)

## Introduction
  This is a clipboard management tool implemented with Electron + React + ArcoDesign. Currently, it only supports MacOS, but support for Windows and Linux will be added in the near future. It's still in the early stages of development, so there are many defects, but the author will continue to fix them. Please add defects in the issue section, and the author will fix them in their spare time.
  PS: The UI is inspired by PasteNow.

## Development
  The project structure has not been fully optimized yet, so the development environment is not ideal. The adjustment of the project structure will be carried out after the MacOS version is perfected.

  > Node: 18.18.0  Electron: 27.0.0  React: 18.2.0  ArcoDesign: 2.53.2

### Initialization
  ```shell
    yarn init:all // Run in the project root directory
  ```
### Running
  ``` shell
    yarn start:mac  // Start main process & rendering process on macOS
    yarn start:win  // Start main process & rendering process on windows
  ```
  ```shell
    yarn start:main // Start main process
    yarn start:renderer // Start rendering process
  ```
### Build
  ``` shell
    yarn dist
  ```

## Application Screenshots

![](docs/screenshot.png)

## Features for the Next Version

- Support for basic functions in Windows and Linux
- Improved menu
- Added right-click menu.

## Changelog
#### v0.0.1 (2023-10-27)
"This is the first version, which is very rough, but the basic functionalities that a clipboard should have are already in place (MacOS).
I will strive to support the basic functionalities for Linux and Windows by November.
The currently implemented features are:

- Clipboard monitoring and saving to the database
- i18n (internationalization) support
- Retrieving icons of the source of copied content
- Double-clicking to copy clipboard content
- Text search function
- Content categorization
- Shortcut key activation
- Some menu functions
- Favorites feature."

