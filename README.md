# 🌫️ Myst

A mysterious island appears in the fog...

## Category
`hidden`

## Installation

```bash
npm install @anthropic/myst
# or
pnpm add @anthropic/myst
```

## Usage

```tsx
import App from '@anthropic/myst';

function MyComponent() {
  return <App onClose={() => console.log('closed')} />;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev
```

## zOS Integration

This app is designed to run within zOS, a web-based operating system. It follows the zOS app specification with:

- Standalone React component
- TypeScript support
- Tailwind CSS styling
- Window management integration

## License

MIT
