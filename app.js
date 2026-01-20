const scale = [1, 2, 3, 4, 5];

const container = document.getElementById("surveyContainer");
const form = document.getElementById("surveyForm");
const resetBtn = document.getElementById("resetBtn");
const output = document.getElementById("output");

let groups = [];
let flat = [];
let answers = [];

/* ===== Load JSON ===== */
fetch("question.json")
  .then(res => res.json())
  .then(data => {
    groups = data;
    buildFlat();
    render();
  })
  .catch(err => {
    console.error("❌ Không load được questions.json", err);
  });

/* ===== Flatten data ===== */
function buildFlat() {
  flat = [];
  let stt = 0;

  groups.forEach((g, gi) => {
    g.items.forEach(text => {
      stt++;
      flat.push({ stt, groupIndex: gi, text });
    });
  });

  answers = Array(flat.length).fill(null);
}

/* ===== Render ===== */
function render() {
  container.innerHTML = "";

  groups.forEach((group, gi) => {
    const h3 = document.createElement("h3");
    h3.textContent = group.title;
    container.appendChild(h3);

    const table = document.createElement("table");
    table.className = "likert";

    table.innerHTML = `
      <thead>
        <tr>
          <th class="col-stt">STT</th>
          <th>Nội dung lấy ý kiến</th>
          <th colspan="5">Các mức độ đồng ý</th>
        </tr>
        <tr>
          <th></th><th></th>
          <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    flat
      .filter(q => q.groupIndex === gi)
      .forEach(q => {
        const idx = q.stt - 1;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="col-stt">${q.stt}</td>
          <td>${q.text}</td>
        `;

        scale.forEach(val => {
          const td = document.createElement("td");
          td.innerHTML = `
            <input
              type="radio"
              name="q${idx}"
              value="${val}"
              data-idx="${idx}"
              ${answers[idx] === val ? "checked" : ""}
            />
          `;
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

    container.appendChild(table);
  });
}

/* ===== Radio change ===== */
container.addEventListener("change", (e) => {
  if (e.target.matches('input[type="radio"]')) {
    const idx = Number(e.target.dataset.idx);
    answers[idx] = Number(e.target.value);
  }
});

/* ===== Submit ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const missing = answers
    .map((v, i) => v == null ? i + 1 : null)
    .filter(Boolean);

  if (missing.length) {
    alert("Chưa chọn ở STT: " + missing.join(", "));
    return;
  }

  const result = answers.join("@");
  output.hidden = false;
  output.textContent = result;

  console.log("OUTPUT:", result);
});

/* ===== Reset ===== */
resetBtn.addEventListener("click", () => {
  answers = Array(flat.length).fill(null);
  form.reset();
  output.hidden = true;
  output.textContent = "";
  render();
});
