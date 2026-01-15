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
