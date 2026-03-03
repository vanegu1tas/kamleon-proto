# Kamleon — Design System & Docs

Repositorio de referencia para el diseño y prototipado de la plataforma interna de staff.

## Estructura

```
kamleon/
├── design-system/
│   ├── tokens/          # colores, tipografía, spacing (CSS variables + JSON)
│   ├── components/      # componentes React con CSS Modules
│   └── icons/
├── docs/
│   ├── data-model.md    # jerarquía de entidades y cardinalidad
│   ├── navigation.md    # mapa de rutas por rol
│   ├── permissions.md   # matriz de permisos por rol
│   └── features/        # un doc por feature en diseño o desarrollo
├── prototypes/          # páginas para probar flows rápidamente
└── figma/
    └── code-connect/    # mapeo componentes Figma ↔ código (Code Connect)
```

## Docs de referencia

- [Modelo de datos](./docs/data-model.md) — entidades, cardinalidad, estados
- [Navegación](./docs/navigation.md) — rutas y estructura por rol
- [Permisos](./docs/permissions.md) — matriz de permisos por rol

## Stack

- React + CSS Modules
- Figma (diseño y prototipado)
- Figma Code Connect (sincronización componentes ↔ código)
