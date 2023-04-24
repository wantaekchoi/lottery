const emptyItem = "EMPTY";

export default class Model {
  constructor() {
    this.participants = [];
    this.results = [];
    this.drawCount = 0;
  }

  filterAndTrim(input) {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
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
      .filter((result) => !isNaN(parseFloat(result)))
      .reduce((sum, result) => sum + parseFloat(result), 0);
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
      if (!file) {
        reject(new Error("No file provided"));
      }

      const reader = new FileReader();
      reader.onload = () => {
        const contents = reader.result;
        targetInput.value = contents.replace(/\r?\n|\r/g, ",");
        resolve();
      };
      reader.readAsText(file);
    });
  }
}
