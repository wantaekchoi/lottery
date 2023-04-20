const emptyItem = "EMPTY";
const duplicateParticipantsMessage = "중복된 참가자가 있습니다: ";
const sumMessage = "결과 값 합계";
const drawResultsMessage = "추첨 결과:";

class Model {
  constructor() {
    this.participants = [];
    this.results = [];
    this.drawCount = 0;
  }

  filterAndTrim(input) {
    return input
      .split(",")
      .filter((item) => item.trim() !== "")
      .map((item) => item.trim());
  }

  findDuplicateParticipants(participants) {
    const uniqueParticipants = [...new Set(participants)];
    if (uniqueParticipants.length === participants.length) return [];

    const duplicateParticipants = participants.filter(
      (item, index) => participants.indexOf(item) !== index
    );
    return [...new Set(duplicateParticipants)];
  }

  sumNumericResults(results) {
    return results
      .map((result) => parseFloat(result))
      .filter((result) => !isNaN(result))
      .reduce((a, b) => a + b, 0);
  }

  fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  loadCSV(file, targetInput) {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          targetInput.value = contents.replace(/\r?\n|\r/g, ",");
          resolve();
        };
        reader.readAsText(file);
      } else {
        reject(new Error("No file provided"));
      }
    });
  }
}

class View {
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
  }

  updateSum(sum) {
    this.sumElement.innerText = `${sumMessage}: ${sum}`;
  }

  matchParticipantsAndResults(participants, results) {
    let output = "";
    participants.forEach((participant, index) => {
      output += `${participant}: ${results[index]}<br>`;
    });
    return output;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

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
        this.updateItemCount(
          this.view.resultsInput,
          this.view.resultsCount
        );
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
      alert(
        `${duplicateParticipantsMessage}${duplicateParticipants.join(", ")}`
      );
      return;
    }

    const sortedParticipants = participants.sort((a, b) => a.localeCompare(b));
    while (results.length < sortedParticipants.length) {
      results.push(emptyItem);
    }

    const shuffledResults = this.model.fisherYatesShuffle(results);
    const output = this.view.matchParticipantsAndResults(
      sortedParticipants,
      shuffledResults
    );

    this.model.drawCount += 1;
    this.view.outputElement.innerHTML = `<strong>${drawResultsMessage} ${this.model.drawCount}회차</strong><br>${output}<br>` + this.view.outputElement.innerHTML;
  }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);
