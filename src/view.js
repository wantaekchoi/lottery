import { translate } from "./i18n.js";

export default class View {
  constructor() {
    this.participantsInput = document.getElementById("participants");
    this.participantsCount = document.getElementById("participantsCount");
    this.resultsInput = document.getElementById("results");
    this.resultsCount = document.getElementById("resultsCount");
    this.sumElement = document.getElementById("sum");
    this.outputElement = document.getElementById("output");
    this.participantsFileInput = document.getElementById("participantsFile");
    this.resultsFileInput = document.getElementById("resultsFile");
    this.drawButton = document.getElementById("drawButton");
    this.setLanguage(document.documentElement.lang);
  }

  setLanguage(language) {
    this.language = language;
    this.updateLabels();
  }

  updateLabels() {
    this.emptyItem = translate("EMPTY_ITEM_LABEL", this.language);
    this.duplicateParticipantsMessage = translate(
      "DUPLICATE_PARTICIPANTS_LABEL",
      this.language
    );
    this.sumMessage = translate("SUM_MESSAGE_LABEL", this.language);
    this.drawResultsMessage = translate("DRAW_RESULTS_LABEL", this.language);
  }

  updateSum(sum) {
    this.sumElement.textContent = `${this.sumMessage}: ${sum}`;
  }

  matchParticipantsAndResults(participants, results) {
    const lines = participants.map(
      (participant, index) =>
        `${participant}: ${results[index] || this.emptyItem}`
    );
    return lines.join("<br>");
  }

  addResultToOutput(output) {
    this.outputElement.innerHTML = `<strong>${this.drawResultsMessage}: ${output.drawCount}</strong><br>${output.content}<br>${this.outputElement.innerHTML}`;
  }

  showError(message) {
    alert(message);
  }

  updateItemCount(input, output) {
    const itemCount = input.value.split(",").length;
    output.textContent = `(${itemCount})`;
  }

  disableDrawButton() {
    this.drawButton.disabled = true;
  }

  enableDrawButton() {
    this.drawButton.disabled = false;
  }
}
