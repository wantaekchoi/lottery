const labels = {
  en: {
    EMPTY_ITEM_LABEL: "EMPTY",
    DUPLICATE_PARTICIPANTS_LABEL: "Duplicate participants found: ",
    SUM_MESSAGE_LABEL: "Sum of Results",
    DRAW_RESULTS_LABEL: "Draw Results",
  },
  ko: {
    EMPTY_ITEM_LABEL: "공백",
    DUPLICATE_PARTICIPANTS_LABEL: "중복된 참가자가 있습니다: ",
    SUM_MESSAGE_LABEL: "결과 값 합계",
    DRAW_RESULTS_LABEL: "추첨 결과",
  },
};

export function translate(key, lang = "ko") {
  if (!(lang in labels) || !(key in labels[lang])) {
    return "";
  }
  return labels[lang][key];
}
