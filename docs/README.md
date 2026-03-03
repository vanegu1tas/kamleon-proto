# Docs — Kamleon

Documentación de referencia de la plataforma interna de staff.
Forma parte del repositorio [kamleon-proto](https://github.com/vanegu1tas/kamleon-proto).

## Contenido

| Documento | Descripción |
|---|---|
| [data-model.md](./data-model.md) | Jerarquía de entidades (Org → Centro → Equipo → Usuario) y cardinalidad |
| [navigation.md](./navigation.md) | Mapa de rutas por rol: Panel Staff y Panel Admin de Centro |
| [permissions.md](./permissions.md) | Matriz de permisos — qué puede hacer cada rol sobre cada entidad |
| [project-summary.md](./project-summary.md) | Estado del proyecto: componentes, tokens, prototipos y pendientes |
| [features/](./features/) | Un doc por feature en diseño o desarrollo _(pendiente)_ |

## Contexto rápido

**Stack:** React + CSS Modules · Figma · Storybook

**Jerarquía de datos:**
```
Organización → Centro → Equipo → Usuario
                └── Admin de Centro
```

**Roles:**
- **Super Admin / Admin** — staff con acceso global
- **Admin de Centro completo** — gestiona su centro
- **Admin de Centro restringido** — solo permisos habilitados por el staff

**Ver en vivo:**
- [Prototipo](https://vanegu1tas.github.io/kamleon-proto/prototype/) — panel staff navegable
- [Storybook](https://vanegu1tas.github.io/kamleon-proto/storybook/) — componentes del design system
