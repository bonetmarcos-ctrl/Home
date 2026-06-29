describe("Habitacion Poblenou", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("promotes the room and lets visitors switch language", () => {
    cy.contains("h1", "Tu refugio en Barcelona").should("be.visible");
    cy.contains("Habitación acogedora en piso familiar tranquilo, balcón con vistas verdes y acceso a los servicios del hogar.").should("be.visible");
    cy.contains("a", "Reservar por WhatsApp").should("have.attr", "href").and("include", "wa.me/34664158678");
    cy.contains("80").should("be.visible");
    cy.contains("Precio individual: consultar").should("be.visible");
    cy.contains("Balcón verde").should("not.exist");
    cy.contains("limpieza").should("not.exist");
    cy.get('img[src="/images/room-01.jpg"]').should("be.visible");
    cy.contains("Un piso luminoso para sentirse cerca de casa").should("be.visible");
    cy.contains("Extras bajo pedido").should("be.visible");
    cy.contains("article", "Recogida en aeropuerto").should("not.contain", "35");
    cy.contains("Poblenou: playa, ciudad y transporte a mano").should("be.visible");

    cy.contains("button", "EN").click();

    cy.contains("h1", "Your calm base in Barcelona").should("be.visible");
    cy.contains("Solo traveller rate: ask us").should("be.visible");
    cy.contains("Extras on request").should("be.visible");
    cy.contains("a", "Book on WhatsApp").should("have.attr", "href").and("include", "Hi%2C%20I%20am%20interested");
  });
});