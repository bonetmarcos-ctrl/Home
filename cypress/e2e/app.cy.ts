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
    cy.contains("Fotos reales").should("not.exist");
    cy.get(".gallery-section").contains("Fotos").should("be.visible");
    cy.contains(/trabajar en remoto/i).should("not.exist");
    cy.contains("limpieza").should("not.exist");
    cy.get('img[src="/images/room-01.jpg"]').should("be.visible");
    cy.contains("Un piso luminoso para sentirse cerca de casa").should("be.visible");
    cy.contains("Salón compartido").should("be.visible");
    cy.get(".gallery-section").contains("Habitación con escritorio").should("be.visible");
    cy.get(".gallery-section").should("not.contain", "Descanso tranquilo");
    cy.get(".gallery-section").should("not.contain", "Escritorio para trabajar");
    cy.contains("Habitación privada con cama simple o doble").should("be.visible");
    cy.contains("Cama simple o doble").should("be.visible");
    cy.get('img[src="/images/room-double.jpg"]').should("be.visible");
    cy.contains("Hola, somos Marcos y Sofi").should("be.visible");
    cy.contains("Esperamos darte la bienvenida pronto.").should("be.visible");
    cy.get('img[src="/images/hosts.jpg"]').should("be.visible");
    cy.contains("Extras bajo pedido").should("be.visible");
    cy.contains("article", "Recogida en aeropuerto").should("not.contain", "35");
    cy.contains("Playa Nova Icaria").should("not.exist");
    cy.contains("Conectado con toda Barcelona").should("be.visible");

    cy.contains("button", "EN").click();

    cy.contains("h1", "Your calm base in Barcelona").should("be.visible");
    cy.contains("Hi, we are Marcos and Sofi").should("be.visible");
    cy.contains("Single or double bed").should("be.visible");
    cy.contains(/working remotely/i).should("not.exist");
    cy.contains("Solo traveller rate: ask us").should("be.visible");
    cy.contains("Extras on request").should("be.visible");
    cy.contains("Nova Icaria Beach").should("not.exist");
    cy.contains("a", "Book on WhatsApp").should("have.attr", "href").and("include", "Hi%2C%20I%20am%20interested");
  });
});