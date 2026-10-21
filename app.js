const app = document.querySelector("#app");
const CATEGORIES = ["Food", "Travel", "Other"];

let items = [
  { id: 1, name: "Train pass", cents: 4200, category: "Travel" },
  { id: 2, name: "Coffee", cents: 450, category: "Food" },
];
let filter = "all";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const money = (cents) => fmt.format(cents / 100);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const options = (selected, withAll) =>
  (withAll ? [`<option value="all"${filter === "all" ? " selected" : ""}>All categories</option>`] : [])
    .concat(CATEGORIES.map((c) => `<option${c === selected ? " selected" : ""}>${c}</option>`))
    .join("");

function render() {
  const view = items.filter((i) => filter === "all" || i.category === filter);
  const total = view.reduce((sum, i) => sum + i.cents, 0);

  app.innerHTML = `
    <div class="row space">
      <div><span class="label">Weekly ledger</span><h2>${money(total)}</h2></div>
      <select id="filter" aria-label="Filter by category">${options(filter, true)}</select>
    </div>
    <form id="add" class="grid">
      <input name="name" placeholder="Description" required />
      <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" required />
      <select name="category">${options("", false)}</select>
      <button>Add expense</button>
    </form>
    <p id="error" class="muted small" role="alert"></p>
    <div class="list">
      ${view.length
        ? view.map((i) => `<article class="item"><div><strong>${esc(i.name)}</strong>
            <span class="muted small">${esc(i.category)}</span></div><b>${money(i.cents)}</b></article>`).join("")
        : `<p class="muted">No expenses yet.</p>`}
    </div>`;

  document.querySelector("#filter").onchange = (e) => {
    filter = e.target.value;
    render();
  };

  document.querySelector("#add").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const amount = Number(f.get("amount"));
    const category = f.get("category");
    const err = document.querySelector("#error");

    if (!name) return (err.textContent = "Description is required.");
    if (!Number.isFinite(amount) || amount <= 0) return (err.textContent = "Enter an amount greater than 0.");
    if (!CATEGORIES.includes(category)) return (err.textContent = "Pick a valid category.");

    items.push({ id: Date.now(), name, cents: Math.round(amount * 100), category });
    render();
  };
}

render();