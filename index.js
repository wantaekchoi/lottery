function drawResult() {
  const emptyItem = "입력이 없습니다";
  const participantsInput = document.getElementById("participants");
  const resultsInput = document.getElementById("results");
  const participants = participantsInput.value
    .split(",")
    .filter((item) => item.trim() !== "")
    .map((item) => item.trim());
  const results = resultsInput.value
    .split(",")
    .filter((item) => item.trim() !== "");

  // 참가자 중복 확인
  const uniqueParticipants = [...new Set(participants)];
  if (uniqueParticipants.length !== participants.length) {
    alert("중복된 참가자가 있습니다.");
    return;
  }

  // 참가자를 오름차순으로 정렬
  const sortedParticipants = participants.sort((a, b) => a.localeCompare(b));
  const shuffledResults = results.sort(() => Math.random() - 0.5);

  let output = "";

  sortedParticipants.forEach((participant, index) => {
    output += `${participant ?? emptyItem}: ${
      shuffledResults[index] ?? emptyItem
    }<br>`;
  });

  document.getElementById("output").innerHTML = output;
}

function updateItemCount(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  const itemCount = input.value
    .split(",")
    .filter((item) => item.trim() !== "").length;
  output.innerText = `(${itemCount})`;
}

document
  .getElementById("participants")
  .addEventListener("input", () =>
    updateItemCount("participants", "participantsCount")
  );
document
  .getElementById("results")
  .addEventListener("input", () => updateItemCount("results", "resultsCount"));

updateItemCount("participants", "participantsCount");
updateItemCount("results", "resultsCount");
