
"use strict";

// Dữ liệu khởi tạo gồm 5 công việc mẫu
const items = [
  {
    id: 1,
    title: "Viết báo cáo HTML",
    dueDate: "2026-10-20",
    priority: "Cao",
    status: "pending"
  },
  {
    id: 2,
    title: "Ôn Flexbox",
    dueDate: "2026-10-23",
    priority: "Trung bình",
    status: "pending"
  },
  {
    id: 3,
    title: "Làm bài DOM",
    dueDate: "2026-10-19",
    priority: "Cao",
    status: "done"
  },
  {
    id: 4,
    title: "Đọc tài liệu CSS",
    dueDate: "2026-10-25",
    priority: "Thấp",
    status: "pending"
  },
  {
    id: 5,
    title: "Thiết kế trang cá nhân",
    dueDate: "2026-10-21",
    priority: "Trung bình",
    status: "done"
  }
];

// Lấy các phần tử HTML
const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const dueDateInput = document.querySelector("#task-due-date");
const priorityInput = document.querySelector("#task-priority");
const titleError = document.querySelector("#title-error");
const searchInput = document.querySelector("#task-search");
const statusFilter = document.querySelector("#status-filter");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const taskCount = document.querySelector("#task-count");

// Tạo ID mới cho công việc
function createNewId() {
  if (items.length === 0) {
    return 1;
  }

  return Math.max(...items.map(item => item.id)) + 1;
}

// Định dạng ngày tháng
function formatDate(dateString) {
  if (!dateString) {
    return "Chưa đặt hạn";
  }

  const parts = dateString.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Xác định màu của mức ưu tiên
function getPriorityClass(priority) {
  if (priority === "Cao") {
    return "priority-high";
  }

  if (priority === "Thấp") {
    return "priority-low";
  }

  return "priority-medium";
}

// C1 + C3: Hiển thị, tìm kiếm và lọc công việc
function renderTasks() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("vi");
  const selectedStatus = statusFilter.value;

  const filteredItems = items.filter(item => {
    const matchesTitle = item.title
      .toLocaleLowerCase("vi")
      .includes(keyword);

    const matchesStatus =
      selectedStatus === "all" ||
      item.status === selectedStatus;

    return matchesTitle && matchesStatus;
  });

  // Xóa danh sách cũ trước khi hiển thị
  taskList.replaceChildren();

  filteredItems.forEach(item => {
    // Tạo thẻ công việc
    const card = document.createElement("article");

    card.className = "task-card";

    if (item.status === "done") {
      card.classList.add("is-done");
    }

    // Phần thông tin công việc
    const main = document.createElement("div");
    main.className = "task-main";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const dueDate = document.createElement("span");
    dueDate.textContent = "Hạn: " + formatDate(item.dueDate);

    const priority = document.createElement("span");
    priority.className =
      "priority " + getPriorityClass(item.priority);
    priority.textContent = "Ưu tiên: " + item.priority;

    const status = document.createElement("span");
    status.className = "status-label " + item.status;

    status.textContent =
      item.status === "done"
        ? "Đã hoàn thành"
        : "Chưa hoàn thành";

    meta.append(dueDate, priority, status);
    main.append(title, meta);

    // Phần nút thao tác
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className =
      "button button-small button-complete";

    toggleButton.textContent =
      item.status === "done"
        ? "↶ Đánh dấu chưa xong"
        : "✓ Hoàn thành";

    toggleButton.addEventListener("click", function () {
      toggleTaskStatus(item.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className =
      "button button-small button-delete";
    deleteButton.textContent = "Xóa";

    deleteButton.addEventListener("click", function () {
      deleteTask(item.id);
    });

    actions.append(toggleButton, deleteButton);
    card.append(main, actions);
    taskList.append(card);
  });

  // Thông báo khi không tìm thấy công việc
  emptyMessage.hidden = filteredItems.length !== 0;

  // Cập nhật số lượng công việc
  const doneCount = items.filter(
    item => item.status === "done"
  ).length;

  taskCount.textContent =
    `${items.length} công việc · ${doneCount} hoàn thành`;
}

// C2: Thêm công việc từ form
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();

  // Kiểm tra tên công việc không được để trống
  if (title === "") {
    titleError.textContent =
      "Vui lòng nhập tên công việc.";

    titleInput.setAttribute("aria-invalid", "true");
    titleInput.focus();
    return;
  }

  titleError.textContent = "";
  titleInput.removeAttribute("aria-invalid");

  // Thêm bản ghi mới vào mảng
  const newTask = {
    id: createNewId(),
    title: title,
    dueDate: dueDateInput.value,
    priority: priorityInput.value,
    status: "pending"
  };

  items.push(newTask);

  // Xóa nội dung form sau khi thêm thành công
  taskForm.reset();
  priorityInput.value = "Trung bình";

  // Cập nhật giao diện ngay, không tải lại trang
  renderTasks();
  titleInput.focus();
});

// Xóa thông báo lỗi khi bắt đầu nhập
titleInput.addEventListener("input", function () {
  if (titleInput.value.trim() !== "") {
    titleError.textContent = "";
    titleInput.removeAttribute("aria-invalid");
  }
});

// C3: Tìm kiếm theo tên và lọc trạng thái
searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);

// C4: Đánh dấu hoặc bỏ đánh dấu hoàn thành theo ID
function toggleTaskStatus(id) {
  const task = items.find(item => item.id === id);

  if (!task) {
    return;
  }

  task.status =
    task.status === "done" ? "pending" : "done";

  renderTasks();
}

// C4: Xóa công việc theo ID
function deleteTask(id) {
  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return;
  }

  items.splice(index, 1);

  renderTasks();
}

// Hiển thị dữ liệu mẫu khi mở trang
renderTasks();
