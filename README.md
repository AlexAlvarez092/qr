# QR Code Styling

Custom QR code generator with styles, colors, and images.

## Installation

```bash
npm install
```

## Available Scripts

```bash
npm start        # Start the development server
npm run build    # Generate production build in /dist
```

## Dependencies

### Production

| Dependency        | Description                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `qr-code-styling` | Main library for generating QR codes with custom styles (colors, shapes, images, gradients) |

### Development

| Dependency                | Description                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `webpack`                 | Bundler that packages JavaScript modules, CSS, and assets into optimized files for production |
| `webpack-cli`             | Command line interface to run webpack                                                         |
| `webpack-dev-server`      | Development server with hot reload to see changes in real time                                |
| `html-webpack-plugin`     | Automatically generates the HTML file and injects JS and CSS bundles                          |
| `mini-css-extract-plugin` | Extracts CSS into separate files instead of injecting it into JS                              |
| `css-loader`              | Allows importing CSS files in JavaScript and resolves `@import` and `url()`                   |
| `babel-loader`            | Integrates Babel with webpack to transpile modern JavaScript                                  |
| `@babel/core`             | Babel core, the JavaScript compiler                                                           |
| `@babel/preset-env`       | Babel preset that transpiles ES6+ to compatible versions based on target browsers             |
| `eslint`                  | Linter to identify and report problematic patterns in JavaScript code                         |
| `prettier`                | Code formatter to maintain consistent style                                                   |

## License

MIT

## Changes from Original Project

This project is a fork of [qr-code-styling demo](https://github.com/kozakdenys/qr-code-styling) by Denys Kozak. The following changes have been made:

### Dependencies & Build System

- **Upgraded to Webpack 5** - Migrated from Webpack 4 to 5
- **Added code quality tools**: ESLint and Prettier with configuration files

### Code Refactoring

- **Refactored `index.js`** - Reduced several lines of repetitive code using a configuration-driven approach
- **Refactored `nodes-binder.js`** - Modernized with ES2022 private fields (`#`), JSDoc documentation, and better error handling
- **Refactored `tools.js`** - Converted callback-based `getSrcFromFile` to Promise-based, removed unused `getValueViaDotNotation` function

### Bug Fixes

- **Fixed `getPerceptualBrightness`** - Corrected `substring(5, 6)` to `substring(5, 7)` for proper blue channel parsing
- **Fixed accordion functionality** - All accordions now work correctly using CSS class toggles instead of inline styles

### UI/UX Improvements

- **Smart QR Mode validation** - Automatically disables incompatible modes (Numeric, Alphanumeric) based on input data
- **Smart Type Number validation** - Dynamically calculates and enforces minimum Type Number based on data length and error correction level
- **Removed Kanji mode** - Simplified mode options

### Removed Features

- **Google Analytics** - Removed tracking code from the original project
