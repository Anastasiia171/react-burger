describe('Конструктор бургера работает корректно', () => {
  const BASE_URL = 'http://localhost:3000/react-burger';
  const SELECTORS = {
    bunSection: 'h2:contains("Булки")',
    fillingSection: 'h2:contains("Начинки")',
    ingredient: '[data-cy^="ingredient-"]',
    constructor: '[data-cy="constructor"]',
    orderButton: '[data-cy="order-button"]',
    modal: '[data-cy="modal"]',
    modalCloseButton: '[data-cy="modal-close-button"]',
  };
  const email = 'fffff@gmail.com';
  const password = 'password123';

  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('должен перетащить булку и ингредиент в конструктор, затем перенаправить на логин, если нет аутентификации', () => {
    const dataTransfer = new DataTransfer();

    cy.get(SELECTORS.bunSection)
      .parent()
      .find(SELECTORS.ingredient)
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.fillingSection)
      .parent()
      .find(SELECTORS.ingredient)
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.constructor).trigger('drop', { dataTransfer });

    cy.get(SELECTORS.orderButton).click();

    cy.url().should('include', '/login');
  });

  it('должен открыть модальное окно с деталями ингредиента', () => {
    cy.get(SELECTORS.bunSection)
      .parent()
      .find(SELECTORS.ingredient)
      .first()
      .click();

    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.modalCloseButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('должен успешно создать заказ после логина и открыть модальное окно заказа', () => {
    cy.visit(`${BASE_URL}/login`);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    const dataTransfer = new DataTransfer();

    cy.get(SELECTORS.bunSection)
      .parent()
      .find(SELECTORS.ingredient)
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.fillingSection)
      .parent()
      .find(SELECTORS.ingredient)
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get(SELECTORS.constructor).trigger('drop', { dataTransfer });

    cy.intercept('POST', '**/api/orders').as('createOrder');
    cy.get(SELECTORS.orderButton).click();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);
    cy.wait(3000);
    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.modalCloseButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });
});
