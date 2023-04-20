const emptyItem = "EMPTY";
const duplicateParticipantsMessage = "중복된 참가자가 있습니다: ";
const sumMessage = "결과 값 합계";

function filterAndTrim(input) {
  return input
    .split(",")
    .filter((item) => item.trim() !== "")
    .map((item) => item.trim());
}

function findDuplicateParticipants(participants) {
  const uniqueParticipants = [...new Set(participants)];
  if (uniqueParticipants.length === participants.length) return [];

  const duplicateParticipants = participants.filter(
    (item, index) => participants.indexOf(item) !== index
  );
  return [...new Set(duplicateParticipants)];
}

function sumNumericResults(results) {
  return results
    .map((result) => parseFloat(result))
    .filter((result) => !isNaN(result))
    .reduce((a, b) => a + b, 0);
}

function updateSum() {
  const resultsInput = document.getElementById("results");
  const results = filterAndTrim(resultsInput.value);
  const sum = sumNumericResults(results);
  document.getElementById("sum").innerText = `${sumMessage}: ${sum}`;
}

function matchParticipantsAndResults(participants, results) {
  let output = "";
  participants.forEach((participant, index) => {
    output += `${participant}: ${results[index]}<br>`;
  });
  return output;
}

function fisherYatesShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawResult() {
  const participantsInput = document.getElementById("participants");
  const resultsInput = document.getElementById("results");

  const participants = filterAndTrim(participantsInput.value);
  const results = filterAndTrim(resultsInput.value);

  const duplicateParticipants = findDuplicateParticipants(participants);
  if (duplicateParticipants.length > 0) {
    alert(`${duplicateParticipantsMessage}${duplicateParticipants.join(", ")}`);
    return;
  }

  const sortedParticipants = participants.sort((a, b) => a.localeCompare(b));
  while (results.length < sortedParticipants.length) {
    results.push(emptyItem);
  }

  const shuffledResults = fisherYatesShuffle(results);
  const output = matchParticipantsAndResults(
    sortedParticipants,
    shuffledResults
  );
  document.getElementById("output").innerHTML = output;
}

function updateItemCount(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  const itemCount = filterAndTrim(input.value).length;
  output.innerText = `(${itemCount})`;
}

function init() {
  updateItemCount("participants", "participantsCount");
  updateItemCount("results", "resultsCount");
  updateSum();
}

document
  .getElementById("participants")
  .addEventListener("input", () =>
    updateItemCount("participants", "participantsCount")
  );
document.getElementById("results").addEventListener("input", () => {
  updateItemCount("results", "resultsCount");
  updateSum();
});

init();
