export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.bindEvents();
    this.init();
  }

  init() {
    this.updateItemCount(
      this.view.participantsInput,
      this.view.participantsCount
    );
    this.updateItemCount(this.view.resultsInput, this.view.resultsCount);
    this.updateSum();
    this.view.participantsInput.addEventListener("input", () =>
      this.updateItemCount(
        this.view.participantsInput,
        this.view.participantsCount
      )
    );
    this.view.resultsInput.addEventListener("input", () => {
      this.updateItemCount(this.view.resultsInput, this.view.resultsCount);
      this.updateSum();
    });

    this.view.participantsFileInput.addEventListener("change", async () => {
      try {
        await this.model.loadCSV(
          this.view.participantsFileInput.files[0],
          this.view.participantsInput
        );
        this.updateItemCount(
          this.view.participantsInput,
          this.view.participantsCount
        );
      } catch (error) {
        console.error(error);
      }
    });

    this.view.resultsFileInput.addEventListener("change", async () => {
      try {
        await this.model.loadCSV(
          this.view.resultsFileInput.files[0],
          this.view.resultsInput
        );
        this.updateItemCount(this.view.resultsInput, this.view.resultsCount);
        this.updateSum();
      } catch (error) {
        console.error(error);
      }
    });

    this.view.drawButton.addEventListener("click", () => {
      this.drawResult();
    });
  }

  updateItemCount(input, output) {
    const itemCount = this.model.filterAndTrim(input.value).length;
    output.innerText = `(${itemCount})`;
  }

  updateSum() {
    const results = this.model.filterAndTrim(this.view.resultsInput.value);
    const sum = this.model.sumNumericResults(results);
    this.view.updateSum(sum);
  }

  async drawResult() {
    const participants = this.model.filterAndTrim(
      this.view.participantsInput.value
    );
    const results = this.model.filterAndTrim(this.view.resultsInput.value);

    const duplicateParticipants =
      this.model.findDuplicateParticipants(participants);
    if (duplicateParticipants.length > 0) {
      this.view.showError(
        `${this.view.duplicateParticipantsMessage}${duplicateParticipants.join(
          ", "
        )}`
      );
      return;
    }

    const sortedParticipants = participants.sort((a, b) => a.localeCompare(b));
    while (results.length < sortedParticipants.length) {
      results.push(this.view.emptyItem);
    }

    const shuffledResults = this.model.fisherYatesShuffle(results);
    const output = this.view.matchParticipantsAndResults(
      sortedParticipants,
      shuffledResults
    );

    this.model.drawCount += 1;
    this.view.addResultToOutput({
      drawCount: this.model.drawCount,
      content: output,
    });
  }

  bindEvents() {
    this.updateItemCount = this.updateItemCount.bind(this);
    this.updateSum = this.updateSum.bind(this);
    this.drawResult = this.drawResult.bind(this);
  }
}
