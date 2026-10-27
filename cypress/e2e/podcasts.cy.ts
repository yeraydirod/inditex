describe('Podcasts list', () => {
  beforeEach(() => {
    cy.mockItunes();
    cy.visit('/');
    cy.wait('@topPodcasts');
  });

  it('shows the top podcasts', () => {
    cy.findPodcastCards().should('have.length', 8);
    cy.get('[aria-label="Podcasts found"]').should('have.text', '8');
    cy.contains('h2', 'The Joe Budden Podcast').should('be.visible');
  });

  it('filters by title and author as the user types', () => {
    cy.get('input[aria-label="Filter podcasts"]').type('popcast');
    cy.findPodcastCards().should('have.length', 1).and('contain.text', 'Popcast');

    cy.get('input[aria-label="Filter podcasts"]').clear().type('buzz knight');
    cy.findPodcastCards().should('have.length', 3);
    cy.get('[aria-label="Podcasts found"]').should('have.text', '3');
  });

  it('stores the list in the client and does not request it again', () => {
    cy.reload();
    cy.findPodcastCards().should('have.length', 8);
    cy.get('@topPodcasts.all').should('have.length', 1);
  });

  it('requests the list again when the cache is older than one day', () => {
    cy.window().then((win) => {
      const key = 'podcaster:top-podcasts';
      const entry = JSON.parse(win.localStorage.getItem(key) ?? '{}');
      entry.storedAt -= 24 * 60 * 60 * 1000 + 1;
      win.localStorage.setItem(key, JSON.stringify(entry));
    });
    cy.reload();
    cy.wait('@topPodcasts');
    cy.get('@topPodcasts.all').should('have.length', 2);
  });
});
