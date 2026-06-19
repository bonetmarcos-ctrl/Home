describe("Habitacion Poblenou", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("logs in, navigates, creates an inquiry, edits and deletes imported service data", () => {
    cy.contains("button", "Entrar a la app").click();
    cy.contains("Gestion diaria", { timeout: 10000 }).should("be.visible");
    cy.get('[title="Resetear datos iniciales"]').click();

    cy.contains("button", "Consultas").click();
    cy.contains("Bandeja de interesados").should("be.visible");
    cy.get('input').eq(0).clear().type("Cypress Guest");
    cy.get('input[type="date"]').eq(0).type("2026-06-27");
    cy.get('input[type="date"]').eq(1).type("2026-06-30");
    cy.get("textarea").type("Consulta creada por E2E");
    cy.contains("button", "Guardar consulta").click();
    cy.contains("Cypress Guest").should("be.visible");
    cy.wait(800);
    cy.request("/api/state").its("body.inquiries").should((inquiries) => {
      expect(inquiries.some((inquiry: { guestName: string; startDate: string; endDate: string; message: string }) =>
        inquiry.guestName === "Cypress Guest" &&
        inquiry.startDate === "2026-06-27" &&
        inquiry.endDate === "2026-06-30" &&
        inquiry.message === "Consulta creada por E2E"
      )).to.equal(true);
    });

    cy.contains("button", "Contenido").click();
    cy.contains("Datos editables importados").should("be.visible");
    cy.contains(".list-row", "WiFi").find('[title="Editar servicio"]').click();
    cy.contains("label", "Nombre ES").find("input").clear().type("WiFi fibra");
    cy.contains("button", "Actualizar servicio").click();
    cy.contains(".list-row", "WiFi fibra").should("be.visible");
    cy.wait(800);
    cy.request("/api/state").its("body.services").should((services) => {
      expect(services.some((service: { id: string; name: { es: string } }) => service.id === "wifi" && service.name.es === "WiFi fibra")).to.equal(true);
    });

    cy.contains(".list-row", "WiFi fibra").find('[title="Eliminar servicio"]').click();
    cy.contains(".list-row", "WiFi fibra").should("not.exist");
    cy.wait(800);
    cy.request("/api/state").its("body.services").should((services) => {
      expect(services.some((service: { id: string }) => service.id === "wifi")).to.equal(false);
    });
  });
});