let last_color = "#8080ff";

document.getElementById("add").addEventListener("click", function () {
  createItem();
});

function createItem(name = "", color = last_color) {
  let item = document.createElement("div");
  item.style.background = color;

  let nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "item-name";
  nameInput.value = name;
  nameInput.placeholder = "...";

  let colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = color;
  colorInput.addEventListener("change", function () {
    item.style.backgroundColor = colorInput.value;
    last_color = colorInput.value;
  });

  let del = document.createElement("button");
  del.textContent = "🗑";
  del.title = "Delete";
  del.className = "item-button";
  del.addEventListener("click", function () {
    item.remove();
  });

  let completed = document.createElement("button");
  completed.textContent = "✅";
  completed.title = "Mark completed";
  completed.className = "item-button";
  completed.addEventListener("click", function () {
    let name = item.children[0].value;
    if (name.length > 0) {
      createCompleted(
        name,
        new Intl.DateTimeFormat(
          Intl.DateTimeFormat().resolvedOptions().locale,
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          },
        ).format(new Date()),
        item.children[1].value,
      );
      item.remove();
    }
  });

  item.className = "item";
  item.appendChild(nameInput);
  item.appendChild(colorInput);
  item.appendChild(del);
  item.appendChild(completed);

  document.getElementById("items").appendChild(item);
}

function createCompleted(nameText, time, color = "#8080ff") {
  let completed_item = document.createElement("div");

  let name = document.createElement("p");
  name.className = "item-name";
  name.textContent = nameText;

  let at = document.createElement("p");
  at.textContent = time;
  at.className = "item-time";

  let restore = document.createElement("button");
  restore.textContent = "⤴️";
  restore.title = "Mark not completed";
  restore.className = "item-button";
  restore.addEventListener("click", function () {
    createItem(nameText, color);
    completed_item.remove();
    updateCompletedHeader();
  });

  completed_item.className = "item";
  completed_item.style.backgroundColor = color;
  completed_item.appendChild(name);
  completed_item.appendChild(at);
  completed_item.appendChild(restore);

  document.getElementById("completed").prepend(completed_item);
  updateCompletedHeader();
}

function updateCompletedHeader() {
  document.getElementById("completed-header").style.display = document
    .getElementById("completed")
    .hasChildNodes()
    ? "block"
    : "none";
}

function save() {
  let data = {
    items: [],
    completed: [],
  };
  for (let item of document.getElementById("items").children) {
    data.items.push({
      name: item.children[0].value,
      color: item.children[1].value,
    });
  }
  for (let item of document.getElementById("completed").children) {
    data.completed.unshift({
      name: item.children[0].textContent,
      time: item.children[1].textContent,
      color: item.style.backgroundColor,
    });
  }
  localStorage.setItem("data", JSON.stringify(data));
}

setInterval(save, 1000);

let data = localStorage.getItem("data");
if (data == null) {
  data = {
    items: [],
    completed: [],
  };
} else {
  data = JSON.parse(data);
}

for (let item of data.items) createItem(item.name, item.color);
for (let item of data.completed)
  createCompleted(item.name, item.time, item.color);
