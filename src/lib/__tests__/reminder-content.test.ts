import { buildReminderContent, toHourMinute } from "@/lib/reminder-content";

describe("contenu du rappel quotidien", () => {
  it("reprend le texte de la maquette, avec la durée choisie", () => {
    expect(buildReminderContent(15)).toEqual({
      title: "Nanga def ! C'est l'heure du wolof",
      body: "Ta leçon de 15 min t'attend.",
    });
  });

  it.each([
    [1140, { hour: 19, minute: 0 }],
    [750, { hour: 12, minute: 30 }],
    [0, { hour: 0, minute: 0 }],
  ])("découpe %d minutes en heure + minute", (minutes, expected) => {
    expect(toHourMinute(minutes)).toEqual(expected);
  });
});
