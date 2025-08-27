# Development Guide

## Project Structure

```
dust-cms/
├── staticleaf-core/       # Core library
│   ├── src/
│   │   ├── lib.rs        # Library entry point
│   │   ├── models.rs     # Data models
│   │   ├── database.rs   # Database operations
│   │   ├── auth.rs       # JWT authentication
│   │   ├── config.rs     # Configuration handling
│   │   ├── password.rs   # Password utilities
│   │   ├── error.rs      # Error types
│   │   └── image_processing.rs # Image optimization
│   └── Cargo.toml
├── staticleaf-cli/        # CLI tool
│   ├── src/main.rs       # CLI commands
│   └── Cargo.toml
├── staticleaf-server/     # Web server
│   ├── src/main.rs       # HTTP server & routes
│   └── Cargo.toml
├── frontend/              # SolidJS frontend
│   ├── src/
│   │   ├── App.tsx       # Main app component
│   │   ├── lib/          # Utilities
│   │   └── pages/        # Page components
│   ├── package.json
│   └── vite.config.ts
└── migrations/            # Database migrations
```

## Building & Testing

### Backend

```bash
# Check compilation
cargo check

# Run tests
cargo test

# Build release
cargo build --release

# Run specific binary
cargo run --bin staticleaf -- --help
cargo run --bin staticleaf-server
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production  
npm run build
```

## Adding Features

### New CLI Command

1. Add command to `staticleaf-cli/src/main.rs`
2. Implement handler function
3. Add any new database operations to `staticleaf-core/src/database.rs`

### New API Endpoint

1. Add route to `staticleaf-server/src/main.rs`
2. Implement handler function
3. Add request/response types if needed

### New Frontend Page

1. Create component in `frontend/src/pages/`
2. Add route to `App.tsx`
3. Add API calls to `lib/api.ts` if needed

## Code Style

- Use `cargo fmt` for Rust formatting
- Use `npm run format` for TypeScript formatting
- Follow existing patterns for error handling
- Add documentation comments for public APIs

## Testing Strategy

- Unit tests for core logic
- Integration tests for API endpoints
- Manual testing for UI workflows
- CLI testing with temporary directories