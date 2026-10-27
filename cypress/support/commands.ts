/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Intercepta las llamadas a iTunes y responde con fixtures para tener tests deterministas. */
      mockItunes(options?: { delayMs?: number }): Chainable<void>;
      findPodcastCards(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('mockItunes', ({ delayMs = 0 } = {}) => {
  cy.intercept('GET', '**/us/rss/toppodcasts/**', {
    fixture: 'top-podcasts.json',
    delay: delayMs,
  }).as('topPodcasts');
  cy.intercept('GET', '**/lookup?id=*', {
    fixture: 'podcast-detail.json',
    delay: delayMs,
  }).as('podcastDetail');
});

Cypress.Commands.add('findPodcastCards', () => cy.get('ul[aria-label="Podcasts"] > li'));

export {};
