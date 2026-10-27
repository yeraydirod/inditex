const PODCAST_ID = '1535809341';
const EPISODE_ID = '1000797415244';

describe('Navigation between views', () => {
  it('goes from the list to a podcast, an episode and back home without reloading', () => {
    cy.mockItunes({ delayMs: 400 });
    cy.visit('/');
    cy.window().then((win) => {
      // Marca en window: si la página se recargase por completo, desaparecería.
      (win as Window & { __spa?: boolean }).__spa = true;
    });

    // Vista principal -> detalle del podcast (con indicador de navegación)
    cy.contains('a', 'The Joe Budden Podcast').click();
    cy.get('header [role="status"]').should('be.visible');
    cy.location('pathname').should('eq', `/podcast/${PODCAST_ID}`);
    cy.get('header [role="status"]').should('not.exist');

    cy.contains('h2', 'Episodes: 773').should('be.visible');
    cy.get('tbody tr').should('have.length', 5);
    cy.get('tbody tr')
      .first()
      .within(() => {
        cy.contains('Episode 975');
        cy.contains('24/10/2026');
        cy.contains('03:23:05');
      });

    // Detalle del podcast -> detalle del episodio
    cy.contains('a', `Episode 974`).click();
    cy.location('pathname').should('eq', `/podcast/${PODCAST_ID}/episode/${EPISODE_ID}`);
    cy.get('[data-testid="episode-description"]').within(() => {
      cy.get('strong').should('have.text', 'HTML');
      cy.contains('a', 'our Patreon').should(
        'have.attr',
        'href',
        'https://www.patreon.com/joebudden',
      );
    });
    cy.get('audio').should('have.attr', 'controls');
    cy.get('audio')
      .should('have.attr', 'src')
      .and('match', /^https?:\/\//);

    // Barra lateral -> detalle del podcast
    cy.get('[aria-label="Podcast information"]').contains('a', 'The Joe Budden Network').click();
    cy.location('pathname').should('eq', `/podcast/${PODCAST_ID}`);

    // Título de la aplicación -> vista principal
    cy.contains('header a', 'Podcaster').click();
    cy.location('pathname').should('eq', '/');
    cy.window().its('__spa').should('eq', true);
  });

  it('supports deep links to an episode with clean URLs', () => {
    cy.mockItunes();
    cy.visit(`/podcast/${PODCAST_ID}/episode/${EPISODE_ID}`);
    cy.contains('h2', 'Episode 974').should('be.visible');
    cy.get('[aria-label="Podcast information"]').should('contain.text', 'The Joe Budden Podcast');
  });
});
