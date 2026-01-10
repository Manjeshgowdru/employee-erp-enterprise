const API_URL = "http://127.0.0.1:8000";

/* ================= TRANSLATIONS ================= */

const translations = {
  en: {
    app_title: "Employee ERP",
    app_subtitle: "Enterprise Workforce Management",
    page_title: "Employee Management",
    page_desc: "Manage your organization’s workforce in one centralized system",
    add_employee: "Add New Employee",
    create_employee: "Create Employee",
    refresh: "Refresh",
    employees: "Employees",
    th_name: "Name",
    th_email: "Email",
    th_role: "Role",
    th_status: "Status"
  },
  sk: {
    app_title: "Zamestnanecký ERP",
    app_subtitle: "Podnikový systém správy zamestnancov",
    page_title: "Správa zamestnancov",
    page_desc: "Spravujte zamestnancov vašej organizácie na jednom mieste",
    add_employee: "Pridať nového zamestnanca",
    create_employee: "Vytvoriť zamestnanca",
    refresh: "Obnoviť",
    employees: "Zamestnanci",
    th_name: "Meno",
    th_email: "Email",
    th_role: "Pozícia",
    th_status: "Stav"
  }
};

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = translations[lang][el.dataset.i18n];
  });
}

/* ================= LOAD EMPLOYEES ================= */

async function loadEmployees() {
  const table = document.getElementById("employeeTable");
  table.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const res = await fetch(`${API_URL}/employees`);
    const data = await res.json();

    table.innerHTML = "";

    if (data.length === 0) {
      table.innerHTML =
        "<tr><td colspan='4' class='empty'>No employees found</td></tr>";
      return;
    }

    data.forEach(emp => {
      table.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${emp.first_name} ${emp.last_name || ""}</td>
          <td>${emp.email}</td>
          <td>${emp.role || "-"}</td>
          <td>${emp.status}</td>
        </tr>`
      );
    });
  } catch (err) {
    console.error(err);
    table.innerHTML =
      "<tr><td colspan='4'>Failed to load employees</td></tr>";
  }
}

/* ================= CREATE EMPLOYEE ================= */

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("employeeForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      const payload = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value
      };

      try {
        const res = await fetch(`${API_URL}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.detail || "Failed to create employee");
          return;
        }

        e.target.reset();
        loadEmployees();
      } catch (err) {
        alert("Backend not reachable");
      }
    });

  setLanguage("en");
  loadEmployees();
});
