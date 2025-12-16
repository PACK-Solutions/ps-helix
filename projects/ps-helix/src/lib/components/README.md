# Components

This directory contains all the core components of the Helix Design System.

## Adding New Components

1. Create a new directory for your component:
```bash
components/
  └── your-component/
      ├── your-component.component.ts
      ├── your-component.component.html
      ├── your-component.component.css
      └── your-component.types.ts
```

2. Export your component types in `lib/types/index.ts`

3. Add your component export to `components/index.ts`

4. Create a demo page in `demo/pages/your-component/`

5. Add the route in `app.routes.ts`

6. Add the navigation item in `demo/constants/navigation.constants.ts`

## Best Practices

- Keep components focused and single-responsibility
- Use proper typing for all props and events
- Follow the established naming conventions
- Include proper accessibility attributes
- Add comprehensive documentation
- Follow the design system guidelines