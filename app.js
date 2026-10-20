const app = document.querySelector("#app");
let items = [
    { id: 1, n: "Train pass", a: 42, c: "Travel" },
    { id: 2, n: "Coffee", a: 4.5, c: "Food" },
  ],
  filter = "all";
const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );
function render() {
  const view = items.filter((i) => filter === "all" || i.c === filter),
    total = view.reduce((sum, i) => sum + i.a, 0);
  app.innerHTML = `<div class="row space"><div><span class="label">Weekly ledger</span><h2>${money(total)}</h2></div><select id="filter"><option value="all">All categories</option><option>Food</option><option>Travel</option><option>Other</option></select></div><form id="add" class="grid"><input name="name" placeholder="Description"/><input name="amount" type="number" placeholder="Amount"/><select name="category"><option>Food</option><option>Travel</option><option>Other</option></select><button>Add expense</button></form><div class="list">${view.map((i) => `<article class="item"><div><strong>${i.n}</strong><span class="muted small">${i.c}</span></div><b>${money(i.a)}</b></article>`).join("")}</div>`;
  document.querySelector("#filter").onchange = (e) => {
    filter = e.target.value;
    render();
  };
  document.querySelector("#add").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    items.push({
      id: Date.now(),
      n: f.get("name"),
      a: f.get("amount"),
      c: f.get("category"),
    });
    e.currentTarget.reset();
    render();
  };
}
render();


// Added organizer feature: category summary and deletion controls.
function renderCategorySummary() {
  const host = document.querySelector("#app"); if (!host || document.querySelector("#category-summary")) return;
  const totals = items.reduce((out, item) => { out[item.c] = (out[item.c] || 0) + Number(item.a); return out; }, {});
  const summary = document.createElement("p"); summary.id = "category-summary"; summary.className = "muted small";
  summary.textContent = Object.entries(totals).map(([key, value]) => key + " " + money(value)).join(" · "); host.querySelector("h2")?.after(summary);
}
renderCategorySummary();


// Finance expansion: budget target and item removal.
(() => {
  const baseRender = render; let budget = 100;
  const enhance = () => {
    if (document.querySelector("#budget-tools")) return;
    const panel = document.createElement("section"); panel.id = "budget-tools"; panel.className = "item";
    panel.innerHTML = '<strong>Budget tools</strong><div class="row"><input id="budget" type="number" value="100" min="0"/><button id="apply-budget" type="button">Apply budget</button></div><p id="budget-summary" class="muted small"></p>';
    document.querySelector("#app")?.append(panel);
    const update = () => { const total = items.reduce((sum, item) => sum + Number(item.a), 0); panel.querySelector("#budget-summary").textContent = money(total) + " of " + money(budget) + " budget used"; };
    panel.querySelector("#apply-budget").onclick = () => { budget = Number(panel.querySelector("#budget").value); update(); };
    update();
  };
  render = () => { baseRender(); enhance(); };
  enhance();
})();
