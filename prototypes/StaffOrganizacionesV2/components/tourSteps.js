// Contenido del onboarding tour por rol. Cada rol tiene un mensaje de bienvenida
// (modal centrado, sin apuntar a nada) y una secuencia de spotlights sobre
// elementos reales de la interfaz (marcados con data-tour-id="...").
// Roles sin entrada acá simplemente no disparan el tour.

export const TOUR_STEPS = {
  orgAdmin: {
    welcome: {
      title: name => `Welcome, ${name} 👋`,
      body: orgName => `You're set up as Org Admin for ${orgName}. Want a quick tour of where everything is?`,
    },
    steps: [
      {
        target: '[data-tour-id="org-tabs"]',
        title: 'Centers, Users, Details',
        body: 'Everything about your organization lives under these three tabs.',
      },
      {
        target: '[data-tour-id="org-settings"]',
        title: 'Organization settings',
        body: "Manage your organization's info and invite other admins from here.",
      },
      {
        target: '[data-tour-id="centers-list"]',
        title: 'Your centers',
        body: 'Click into any center to see its teams, users and units.',
      },
      {
        target: null,
        title: "You're all set",
        body: 'Explore Astonia FC.',
        final: true,
      },
    ],
  },

  centerAdmin: {
    welcome: {
      title: name => `Welcome, ${name} 👋`,
      body: () => "Here are the centers you manage. Want a quick tour of where everything is?",
    },
    steps: [
      {
        target: '[data-tour-id="centers-list"]',
        title: 'Your centers',
        body: 'Switch between the centers assigned to you.',
      },
      {
        target: '[data-tour-id="center-create-menu"]',
        title: 'Quick actions',
        body: 'Quickly create a team or invite a user.',
        // En mobile/tablet la lista y el detalle no se ven a la vez — hay que
        // "entrar" al primer centro antes de poder señalar algo que vive adentro.
        beforeShow: () => document.querySelector('[data-tour-id="centers-list"] button')?.click(),
      },
      {
        target: '[data-tour-id="center-tabs"]',
        title: 'Teams & Users',
        body: 'Manage rosters from these tabs.',
        beforeShow: () => document.querySelector('[data-tour-id="centers-list"] button')?.click(),
      },
      {
        target: null,
        title: "You're all set",
        body: 'Explore your centers.',
        final: true,
      },
    ],
  },

  teamAdmin: {
    welcome: {
      title: name => `Welcome, ${name} 👋`,
      body: () => 'Here are the teams you manage. Want a quick tour of where everything is?',
    },
    steps: [
      {
        target: '[data-tour-id="team-list"]',
        title: 'Your teams',
        body: 'Switch between the teams assigned to you.',
      },
      {
        target: '[data-tour-id="team-new-user"]',
        title: 'Invite users',
        body: 'Use the + to invite a new user to this team.',
        // En mobile/tablet la lista y el detalle no se ven a la vez — hay que
        // "entrar" al primer equipo antes de poder señalar el botón "+".
        beforeShow: () => document.querySelector('[data-tour-id="team-list"] button')?.click(),
      },
      {
        target: null,
        title: "You're all set",
        body: 'Explore your teams.',
        final: true,
      },
    ],
  },
};

export function hasTour(role) {
  return Boolean(TOUR_STEPS[role]);
}
