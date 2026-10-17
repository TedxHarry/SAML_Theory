export function shuffleOptions(options, random = Math.random) {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function evaluateChoice(question, optionId) {
  const selected = question.options.find((option) => option.id === optionId);
  const correct = question.options.find(
    (option) => option.id === question.correctId,
  );
  if (!selected || !correct) throw new Error("Unknown quiz option");
  return { isCorrect: selected.id === correct.id, selected, correct };
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function initializeQuiz() {
  const payload = document.querySelector("#quiz-data");
  if (!payload) return;
  const data = JSON.parse(payload.textContent);
  const answered = new Set();
  const progress = document.querySelector("#quiz-progress");
  for (const q of data.questions) {
    const card = document.getElementById(q.id);
    const options = shuffleOptions(q.options);
    const group = card.querySelector(".quiz-options");
    const labels = new Map(
      [...group.children].map((label) => [
        label.querySelector("input").value,
        label,
      ]),
    );
    options.forEach((option, index) => {
      const label = labels.get(option.id);
      label.querySelector(".option-letter").textContent = String.fromCharCode(
        65 + index,
      );
      group.append(label);
    });
    const feedback = card.querySelector(".quiz-feedback");
    const result = feedback.querySelector(".quiz-result");
    const rationales = feedback.querySelector("ul");
    for (const option of options) {
      const li = element("li");
      li.append(
        element(
          "strong",
          "",
          `${option.id === q.correctId ? "Correct" : "Incorrect"}: ${option.text}`,
        ),
      );
      li.append(element("p", "", option.explanation));
      rationales.append(li);
    }
    group.addEventListener("change", (event) => {
      if (!event.target.matches("input[type=radio]")) return;
      const answer = evaluateChoice(q, event.target.value);
      for (const [id, label] of labels) {
        label.classList.toggle("is-correct", id === answer.correct.id);
        label.classList.toggle(
          "is-incorrect",
          id === answer.selected.id && !answer.isCorrect,
        );
      }
      feedback.hidden = false;
      feedback.classList.toggle("is-correct", answer.isCorrect);
      feedback.classList.toggle("is-incorrect", !answer.isCorrect);
      const heading = element(
        "p",
        "quiz-verdict",
        answer.isCorrect
          ? "Correct."
          : "Not quite. Your selected answer is incorrect.",
      );
      const explanation = element("p", "", answer.selected.explanation);
      const correctAnswer = element("p");
      correctAnswer.append(
        element("strong", "", "Correct answer: "),
        document.createTextNode(answer.correct.text),
      );
      const nodes = [heading, correctAnswer, explanation];
      if (!answer.isCorrect)
        nodes.push(element("p", "", answer.correct.explanation));
      result.replaceChildren(...nodes);
      card.querySelector(".quiz-announcement").textContent =
        card.querySelector(".quiz-meta").textContent +
        ". " +
        nodes.map((node) => node.textContent).join(" ");
      answered.add(q.id);
      progress.textContent = `${answered.size} of ${data.questions.length} answered${answered.size === data.questions.length ? ". All questions explored. You can revisit any answer." : ""}`;
    });
    group.hidden = false;
  }
  progress.hidden = false;
}

if (typeof document !== "undefined") initializeQuiz();
