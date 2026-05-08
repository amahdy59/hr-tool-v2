const lessons = [
  {
    category: "DCS Building",
    title: "MSL Level Control Inadequate",
    summary:
      "A control loop review revealed level instability caused by incomplete signal validation and handover notes.",
    department: "Industrial Automation",
    tag: "DCS Building",
    keyword: "technology",
    author: "Noor Ahmed",
    count: 13,
  },
  {
    category: "Automation Practices",
    title: "Customer-Centric Automation: Meeting User Needs",
    summary:
      "User interviews helped the automation team prioritize simpler alarms, clearer states, and fewer operator decisions.",
    department: "Industrial Automation",
    tag: "Automation Practices",
    keyword: "customer",
    author: "Mona Hassan",
    count: 21,
  },
  {
    category: "Energy Solutions",
    title: "Harnessing Technology: Key Takeaways from Automation Projects",
    summary:
      "Reusable templates improved commissioning speed while reducing repeated configuration errors across sites.",
    department: "Energy",
    tag: "Energy Solutions",
    keyword: "technology",
    author: "Omar Nabil",
    count: 18,
  },
  {
    category: "IoT Solutions",
    title: "Sustainability in Automation: Lessons for the Future",
    summary:
      "Remote monitoring and early anomaly detection reduced site visits and improved energy reporting quality.",
    department: "Digital Solutions",
    tag: "IoT Solutions",
    keyword: "technology",
    author: "Laila Samir",
    count: 9,
  },
  {
    category: "Control Systems",
    title: "Overcoming Obstacles: Insights from Industrial Automation Challenges",
    summary:
      "A structured escalation matrix helped resolve vendor dependencies and reduced waiting time during testing.",
    department: "Project Services",
    tag: "Control Systems",
    keyword: "samples",
    author: "Karim Youssef",
    count: 13,
  },
  {
    category: "Automation Practices",
    title: "Shipping Samples Without Losing Traceability",
    summary:
      "A standard packaging checklist helped teams keep sample status, owner, and destination visible to everyone.",
    department: "Project Services",
    tag: "Automation Practices",
    keyword: "samples",
    author: "Salma Adel",
    count: 7,
  },
];

const lessonGrid = document.querySelector("#lessonGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const departmentFilter = document.querySelector("#departmentFilter");
const tagFilter = document.querySelector("#tagFilter");
const resetButton = document.querySelector("#resetFilters");
const viewButtons = document.querySelectorAll(".view-switch button");
const chips = document.querySelectorAll(".chip");
const menuButton = document.querySelector(".menu-button");
const primaryNav = document.querySelector("#primary-navigation");
const createLessonButton = document.querySelector("#createLessonButton");
const lessonDialog = document.querySelector("#lessonDialog");

let activeKeyword = "all";

const createLessonCard = (lesson) => {
  const article = document.createElement("article");
  article.className = "lesson-card";
  article.innerHTML = `
    <div class="card-meta">
      <span>${lesson.category}</span>
      <span aria-label="${lesson.count} related notes">(${lesson.count})</span>
    </div>
    <span class="tag">${lesson.department}</span>
    <h3>${lesson.title}</h3>
    <p>${lesson.summary}</p>
    <div class="card-footer">
      <span class="author">By: ${lesson.author}</span>
      <a href="#" aria-label="Open lesson: ${lesson.title}">View lesson</a>
    </div>
  `;
  return article;
};

const getFilteredLessons = () => {
  const query = searchInput.value.trim().toLowerCase();
  const department = departmentFilter.value;
  const tag = tagFilter.value;

  return lessons.filter((lesson) => {
    const matchesQuery = !query
      || lesson.title.toLowerCase().includes(query)
      || lesson.summary.toLowerCase().includes(query)
      || lesson.author.toLowerCase().includes(query)
      || lesson.category.toLowerCase().includes(query);
    const matchesDepartment = department === "all" || lesson.department === department;
    const matchesTag = tag === "all" || lesson.tag === tag;
    const matchesKeyword = activeKeyword === "all" || lesson.keyword === activeKeyword;
    return matchesQuery && matchesDepartment && matchesTag && matchesKeyword;
  });
};

const renderLessons = () => {
  const filteredLessons = getFilteredLessons();
  lessonGrid.innerHTML = "";
  filteredLessons.forEach((lesson) => lessonGrid.appendChild(createLessonCard(lesson)));
  emptyState.hidden = filteredLessons.length !== 0;
};

searchInput.addEventListener("input", renderLessons);
departmentFilter.addEventListener("change", renderLessons);
tagFilter.addEventListener("change", renderLessons);

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  departmentFilter.value = "all";
  tagFilter.value = "all";
  activeKeyword = "all";
  chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.keyword === "all"));
  renderLessons();
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeKeyword = chip.dataset.keyword;
    chips.forEach((item) => item.classList.toggle("active", item === chip));
    renderLessons();
  });
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((item) => item.classList.toggle("active", item === button));
    lessonGrid.classList.toggle("list", button.dataset.view === "list");
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("keydown", (event) => {
  const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
  if (isSearchShortcut) {
    event.preventDefault();
    searchInput.focus();
  }
});

createLessonButton.addEventListener("click", () => {
  if (typeof lessonDialog.showModal === "function") {
    lessonDialog.showModal();
  }
});

renderLessons();
