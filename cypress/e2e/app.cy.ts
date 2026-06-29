describe("Habitacion Poblenou", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("promotes the room and lets visitors switch language", () => {
    cy.contains("h1", "Habitacion en Poblenou").should("be.visible");
    cy.contains("a", "Reservar por WhatsApp").should("have.attr", "href").and("include", "wa.me/34664158678");
    cy.get('img[src="/images/room-03.jpg"]').should("be.visible");
    cy.contains("Lo esencial incluido y extras si los necesitas").should("be.visible");
    cy.contains("Poblenou: playa, ciudad y transporte a mano").should("be.visible");

    cy.contains("button", "EN").click();

    cy.contains("h1", "Room in Poblenou").should("be.visible");
    cy.contains("a", "Book on WhatsApp").should("have.attr", "href").and("include", "Hi%2C%20I%20am%20interested");
  });
});