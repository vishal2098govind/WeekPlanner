// Add todo:
const days = document.querySelectorAll('.day');
const addInpBtns = document.querySelectorAll('.add');
let todoListActions = document.querySelectorAll('.list-group');

let weekdays = ['weeks', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// Objects for saving in LS:

let todo = {
  weeks: [],
  mon: [],
  tue: [],
  wed: [],
  fri: [],
  thu: [],
  sat: [],
  sun: []
};

loadEventListeners();

function loadEventListeners() {
  // On reload:
  document.addEventListener('DOMContentLoaded', restoreOnReload);

  // todoListCheck:
  todoListActions.forEach(function(action) {
    action.addEventListener('click', performListAction);
  });

  days.forEach(function(day) {
    day.addEventListener('click', performDayAction);
  });

  addInpBtns.forEach(function(addTodoBtn) {
    addTodoBtn.addEventListener('click', appendTodo);
  });
}

// On reload:
function restoreOnReload(e) {
  let todos;
  if (localStorage.getItem('todos') !== null) {
    todos = JSON.parse(localStorage.getItem('todos'));
    Object.keys(todos).forEach(function(day) {
      for (let d = 0; d < todos[day].length; d++) {
        console.log(todos[day][d], day);
        todoListItem = createNewTodoListItem(
          todos[day][d][0],
          todos[day][d][1],
          d
        );
        console.log(todoListItem);
        document.getElementById(day + '-todos').appendChild(todoListItem);
      }
    });
  }
}

// Add todo for the day:
function performDayAction(e) {
  // console.log(e.target);
  if (weekdays.indexOf(e.target.id) != -1) {
    document.querySelector('#' + e.target.id + '-inp').style.display = 'block';
    e.preventDefault();
  } else if (e.target.classList.contains('dayListCheck')) {
    e.target.style.color = 'green';
    let dayName;
    parent = e.target;
    while (parent.classList.contains('day-heading') === false) {
      parent = parent.parentElement;
    }
    if (parent.firstElementChild.textContent.split(' ')[0] === "Week's") {
      dayName = 'weeks';
    } else {
      dayName = parent.firstElementChild.textContent;
      dayName = dayName.split(' ').join('');
      dayName = dayName.toLowerCase();
    }
    console.log(dayName);
    let dayList;
    dayList = document.querySelector(`#${dayName}-todos`);
    let dayListItems = dayList.childNodes;

    let todos;
    // For each todoItem:
    dayListItems.forEach(item => {
      // Strike
      let todoTitle = item.childNodes[0].childNodes[0].childNodes[0];
      let title = todoTitle.innerHTML;
      todoTitle.innerHTML = '';
      todoTitle.innerHTML = `<strike style="color:green;">${title}</strike>`;

      // Update in LS
      let taskId = item.id;
      if (localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
        todos[dayName][parseInt(taskId) - 1][1] = true;
        console.log(dayName, todos[dayName]);
        localStorage.setItem('todos', JSON.stringify(todos));
      }

      // Check
      let itemAction = item.childNodes[0].childNodes[0].childNodes[1];
      itemAction.childNodes[0].childNodes[0].childNodes[0].style.color =
        'green';
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    e.preventDefault();
  }
}

// Append todo: (circular-check)
function appendTodo(e) {
  // console.log(e.target);
  let newToDo =
    e.target.parentElement.parentElement.firstElementChild.firstElementChild;
  // console.log(newToDo.value);
  let inpField = e.target.parentElement.id;
  console.log(inpField);
  let dayName = inpField.split('-')[0];
  console.log(dayName);
  let newTodoListItem;
  let len;
  let todos;
  if (localStorage.getItem('todos') === null) {
    len = 0;
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
    len = todos[dayName].length;
  }
  newTodoListItem = createNewTodoListItem(newToDo.value, false, len);
  document.getElementById(dayName + '-inp').style.display = 'none';

  // Push in todo Object:
  todo[dayName].push([newToDo.value, false]);
  document.getElementById(dayName + '-todos').appendChild(newTodoListItem);
  console.log(todo);

  // Storing todo object in LS:
  if (localStorage.getItem('todos') === null) {
    localStorage.setItem('todos', JSON.stringify(todo));
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
    todos[dayName].push([newToDo.value, false]);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  newToDo.value = '';
  e.preventDefault();
}

// createNewTodoListItem()
function createNewTodoListItem(newToDo, check, len) {
  let listGrpItem = document.createElement('li');
  listGrpItem.id = len + 1;
  listGrpItem.className = 'list-group-item shadow-lg p-0';
  let todoContainer = document.createElement('div');
  todoContainer.className = 'container';
  let row = document.createElement('div');
  row.className = 'row todo text-center';
  todoContainer.appendChild(row);
  listGrpItem.appendChild(todoContainer);
  let title = document.createElement('h6');
  title.className = 'card-title mb-0 col-sm-8 col-xs-3';
  let done;
  if (check === false) {
    title.appendChild(document.createTextNode(newToDo));
    done = 'black';
  } else {
    title.style.color = 'green';
    title.innerHTML = newToDo.strike();
    done = 'green';
  }

  row.append(title);

  actions = document.createElement('div');
  actions.className = 'col-sm-4 col-xs-3 actions';
  actionRow = document.createElement('div');
  actionRow.className = 'row d-flex justify-content-around';
  checkLink = document.createElement('a');
  checkLink.setAttribute('href', '#');
  checkLink.className = 'card-link';
  checkLink.innerHTML = `<i class="fas fa-check-square todoListCheck" style="color: ${done}"></i>`;
  actionRow.appendChild(checkLink);
  trashLink = document.createElement('a');
  trashLink.setAttribute('href', '#');
  trashLink.className = 'card-link';
  trashLink.innerHTML =
    '<i class="fas fa-trash-alt todoListRemove" style="color:red"></i>';
  actionRow.appendChild(trashLink);
  actions.appendChild(actionRow);
  row.append(actions);
  // console.log(listGrpItem);
  return listGrpItem;
}

// actions:
function performListAction(e) {
  // console.log(e.target.classList.contains('todoListCheck'));
  if (e.target.classList.contains('todoListCheck')) {
    let parent = e.target.parentElement;
    while (parent.classList.contains('actions') === false) {
      parent = parent.parentElement;
    }
    todoTitle = parent.parentElement.firstElementChild;
    let title = todoTitle.innerHTML;
    todoTitle.innerHTML = title.strike();
    todoTitle.style.color = 'green';
    e.target.style.color = 'green';

    let listGrpItem;
    while (parent.classList.contains('list-group-item') === false) {
      parent = parent.parentElement;
    }
    listGrpItem = parent;
    todos = JSON.parse(localStorage.getItem('todos'));
    let dayName;
    while (parent.classList.contains('list-group') === false) {
      parent = parent.parentElement;
    }
    dayName = parent.id.split('-')[0];
    console.log(dayName);
    todos[dayName][parseInt(listGrpItem.id) - 1][1] = true;
    localStorage.setItem('todos', JSON.stringify(todos));
  } else if (e.target.classList.contains('todoListRemove')) {
    let todo = e.target.parentElement;
    while (todo.classList.contains('list-group-item') === false) {
      todo = todo.parentElement;
    }
    let remTodo = todo;
    let todos;
    todoId = parseInt(todo.id);
    todos = JSON.parse(localStorage.getItem('todos'));
    let dayName;

    while (todo.classList.contains('list-group') === false) {
      todo = todo.parentElement;
    }
    dayName = todo.id.split('-')[0];
    todos[dayName].splice(todoId - 1, 1);
    remTodo.remove();
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}
