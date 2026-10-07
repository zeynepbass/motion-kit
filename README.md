# motion-kit-css

A small set of CSS-only motion effects for modern interfaces. No JavaScript, no framework, no configuration: import one stylesheet and add a class.

![Preview of the motion-kit-css effects](demo/preview.gif)

## Features

- Animated gradient text
- Shimmer text
- Glow text
- Animated gradient border
- Button lift and button shine hover effects
- Pulse glow
- Animated hover underline
- Respects `prefers-reduced-motion`
- About 1.2 kB minified and gzipped

## Installation

```bash
npm install motion-kit-css
```

## Usage

With a bundler (Vite, webpack, Parcel) or `postcss-import`:

```css
@import "motion-kit-css";
```

```js
import "motion-kit-css";
```

Then add a class:

```html
<h1 class="motion-gradient">Zeynep</h1>
```

The minified bundle:

```css
@import "motion-kit-css/min";
```

A single effect:

```css
@import "motion-kit-css/gradient.css";
```

Without a build step:

```html
<link rel="stylesheet" href="https://unpkg.com/motion-kit-css@1/dist/index.min.css">
```

## Available Effects

Every effect is one class. Custom properties are optional and can be set on the element or any ancestor.

### Gradient text

<img src="demo/effects/gradient.gif" alt="Animated gradient text" width="420">

```html
<h1 class="motion-gradient">Zeynep</h1>
```

`--motion-gradient-colors` (repeat the first color at the end for a seamless loop), `--motion-gradient-duration`

### Shimmer text

<img src="demo/effects/shimmer.gif" alt="Shimmer text" width="420">

```html
<h1 class="motion-shimmer">Frontend Developer</h1>
```

The text is dimmed slightly and a highlight in its own color sweeps across it.

`--motion-shimmer-base`, `--motion-shimmer-highlight`, `--motion-shimmer-duration`

### Glow text

<img src="demo/effects/glow.gif" alt="Glow text" width="420">

```html
<h1 class="motion-glow">Zeynep</h1>
```

Glows in the text color by default. Works best with light text on a dark background.

`--motion-glow-color`, `--motion-glow-duration`

### Gradient border

<img src="demo/effects/border.gif" alt="Animated gradient border" width="420">

```html
<div class="motion-border">Content</div>
```

The inside of the element is painted with `--motion-border-fill`, which defaults to the system `Canvas` color. Set it to your surface color; it has to be opaque.

`--motion-border-fill`, `--motion-border-colors`, `--motion-border-width`, `--motion-border-radius`, `--motion-border-duration`

### Button lift

<img src="demo/effects/button-lift.gif" alt="Button lifting on hover" width="420">

```html
<button class="motion-button-lift">Get Started</button>
```

`--motion-lift-shadow`

### Button shine

<img src="demo/effects/button-shine.gif" alt="Shine sweeping across a button on hover" width="420">

```html
<button class="motion-button-shine">Explore</button>
```

Sets `position: relative` and `overflow: hidden` on the element and uses its `::after` pseudo-element.

`--motion-shine-color`, `--motion-shine-duration`

### Pulse

<img src="demo/effects/pulse.gif" alt="Pulsing badge" width="420">

```html
<span class="motion-pulse">New</span>
```

Animates `box-shadow`, so it replaces any shadow the element already has.

`--motion-pulse-color`, `--motion-pulse-size`, `--motion-pulse-duration`

### Hover underline

<img src="demo/effects/underline.gif" alt="Underline growing on hover" width="420">

```html
<a class="motion-underline" href="#">About</a>
```

Removes the default underline, so use it for navigation rather than links inside body text.

`--motion-underline-color`, `--motion-underline-thickness`, `--motion-underline-duration`

### Customizing

```css
.hero-title {
  --motion-gradient-colors: #f97316, #ef4444, #f97316;
  --motion-gradient-duration: 10s;
}
```

## Accessibility

When the user has `prefers-reduced-motion: reduce` enabled:

- Gradient text, glow, pulse and the gradient border stay visible but stop animating.
- Shimmer text falls back to its normal color.
- Button lift keeps its shadow change without moving; button shine is disabled.
- The underline appears instantly.

Hover effects also apply on `:focus-visible`, and are limited to devices that can hover so they do not stick after a tap on touch screens.

## Browser Support

Current versions of Chrome, Edge, Firefox and Safari.

- Shimmer, glow and pulse use `color-mix()`: Chrome 111+, Firefox 113+, Safari 16.2+.
- The border animation uses `@property`: Chrome 85+, Safari 16.4+, Firefox 128+. Older browsers show a static gradient border.

## Development

```bash
npm install
npm run build
npm test
```

`src/` holds one file per effect, and `npm run build` writes the published CSS to `dist/`. Open `demo/index.html` after building to see every effect.

## Versioning

This project follows [Semantic Versioning](https://semver.org) (`MAJOR.MINOR.PATCH`):

- `MAJOR`: a class or custom property is renamed or removed, or an effect changes in a way that can break existing layouts
- `MINOR`: new effects or new custom properties
- `PATCH`: bug fixes and visual refinements

## License

[MIT](LICENSE)
