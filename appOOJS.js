// Object Oriented Approach according to ES6

// Todo Constructor
let todoItems = document.querySelectorAll('.list-group');
class Todo {
  // day can be [weeks, mon, tue, wed, thu, fri, sat, sun]
  constructor(day, todo, todoId, done) {
    this.day = day;
    this.todo = todo;
    this.todoId = todoId;
    this.done = done;
  }

  createNewTodoListItem() {
    // li.list-group#this.todoId
    let listGrpItem = document.createElement('li');
    listGrpItem.id = this.todoId;
    listGrpItem.className = 'list-group-item shadow-lg p-0';

    // .container
    let todoContainer = document.createElement('div');
    todoContainer.className = 'container';

    // .row.
    let row = document.createElement('div');
    row.className = 'row todo text-center';
    todoContainer.appendChild(row);
    listGrpItem.appendChild(todoContainer);

    // h6.card-title
    let title = document.createElement('h6');
    title.className = 'card-title mb-0 col-sm-8 col-xs-3';
    row.appendChild(title);

    // actions:
    // 1. check todo
    // // .actions
    let actions = document.createElement('div');
    actions.className = 'col-sm-4 col-xs-3 actions';
    // // .row
    let actionRow = document.createElement('div');
    actionRow.className = 'row d-flex justify-content-around';

    // // check-link
    let color;
    if (this.done) {
      color = 'green';
    } else {
      color = 'black';
    }

    let checkLink = document.createElement('a');
    checkLink.setAttribute('href', '#');
    checkLink.className = 'card-link';
    checkLink.innerHTML = `<i class="fas fa-check-square todoListCheck" style= "color: ${color};"></i>`;
    actionRow.appendChild(checkLink);

    // 2. trash todo
    // // trash-link
    let trashLink = document.createElement('a');
    trashLink.setAttribute('href', '#');
    trashLink.className = 'card-link';
    trashLink.innerHTML =
      '<i class="fas fa-trash-alt todoListRemove" style="color:red"></i>';
    actionRow.appendChild(trashLink);

    actions.appendChild(actionRow);

    row.appendChild(actions);

    return listGrpItem;
  }
}

const todosLS = {
  weeks: [],
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: []
};

const days = ['weeks', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

class UI {
  setWeekStatus(weekStatus) {
    document.getElementById('completed').innerHTML = '';
    document.getElementById('completed').innerHTML = weekStatus[0];
    document.getElementById('pending').innerHTML = '';
    document.getElementById('pending').innerHTML = weekStatus[1];
  }

  getTodoIdDay(actionBtn) {
    // traverse upward (Event Deligation)
    let parent = actionBtn;
    console.log(actionBtn);
    // Traverse for todo
    while (parent.classList.contains('todo') === false) {
      parent = parent.parentElement;
    }
    let todoTitle = parent.firstElementChild;

    // Traverse for todoId
    while (parent.classList.contains('list-group-item') === false) {
      parent = parent.parentElement;
    }
    let todoId = parseInt(parent.id);

    // Traverse for todo-day:
    let todoDay = parent.parentElement.id.split('-')[0];

    const ui = new UI();
    // if actionBtn is checkBtn
    if (actionBtn.classList.contains('todoListCheck')) {
      ui.toggleCheckTodo(actionBtn, todoTitle);
    } else if (actionBtn.classList.contains('todoListRemove')) {
      ui.deleteTodo(parent);
    }

    return [todoId, todoDay];
  }

  addDaysTodo(dayName, max) {
    const todoInpDiv = document.getElementById(`${dayName}-inp`);
    if (max) {
      todoInpDiv.style.display = 'block';
    } else {
      todoInpDiv.style.display = 'none';
    }
  }

  addTodoToList(todo, reloaded) {
    let weekStatus = Store.getWeekStatus();
    if (reloaded === false) {
      // Update pending in LS
      weekStatus[1] += 1;
      Store.setWeekStatus(weekStatus);
    }

    // Update pending in UI
    const ui = new UI();
    ui.setWeekStatus(weekStatus);

    // Append to child of ul of day:
    const daysListGrp = document.querySelector(`#${todo.day}-todos`);

    let newTodoListItem;
    newTodoListItem = todo.createNewTodoListItem();

    // Add title:
    newTodoListItem.querySelector('h6').innerHTML = todo.todo;

    daysListGrp.appendChild(newTodoListItem);

    // // Make the input-form display: none
    document.getElementById(`${todo.day}-inp`).style.display = 'none';
  }

  deleteTodo(deleteTodo) {
    let weekStatus = Store.getWeekStatus();
    let todoStatus = deleteTodo.querySelector('.todoListCheck').style.color;
    if (todoStatus === 'black') {
      weekStatus[1] -= 1;
    } else {
      weekStatus[0] -= 1;
    }

    // Update weekStatus in UI
    const ui = new UI();
    ui.setWeekStatus(weekStatus);
    // Update weekStatus in LS
    Store.setWeekStatus(weekStatus);
    deleteTodo.remove();
  }

  toggleCheckTodo(checkBtn, todoTitle) {
    let weekStatus = Store.getWeekStatus();
    // check checkBtn to green
    // console.log(checkBtn, todoTitle);
    checkBtn.style.color === 'green'
      ? (checkBtn.style.color = 'black')
      : (checkBtn.style.color = 'green');

    // Strike todo if done is false
    let title = todoTitle.innerHTML;
    todoTitle.textContent = '';
    if (title[0] === '<') {
      todoTitle.textContent = title.split('>')[1].split('<')[0];
      // console.log(title);
      weekStatus[1] += 1;
      weekStatus[0] -= 1;
    } else {
      todoTitle.innerHTML = `<strike style = "color: green">${title}</strike>`;
      weekStatus[0] += 1;
      weekStatus[1] -= 1;
    }

    // Update weekStatus in UI
    const ui = new UI();
    ui.setWeekStatus(weekStatus);

    // Update weekStatus in LS
    Store.setWeekStatus(weekStatus);
  }
}

// Local Storage
class Store {
  static updateDoneTodosInLS(todoId, todoDay) {
    const daysTodos = Store.getTodos();

    daysTodos[todoDay].forEach(function(todo) {
      if (todo.todoId === todoId) {
        if (todo.done) {
          todo.done = false;
          let task = todo.todo;
          todo.todo = task.split('>')[1].split('<')[0];
        } else {
          todo.done = true;
          let task = todo.todo;
          todo.todo = `<strike style = "color: green">${task}</strike>`;
        }
      }
    });

    // Update LS
    localStorage.setItem('todos', JSON.stringify(daysTodos));
  }

  static deleteTodo(todoId, todoDay) {
    let daysTodo = Store.getTodos();
    daysTodo[todoDay].forEach(function(todo, index) {
      if (todo.todoId === todoId) {
        console.log(todo, index);
        daysTodo[todoDay].splice(index, 1);
      }
    });

    localStorage.setItem('todos', JSON.stringify(daysTodo));
  }

  static getTodos() {
    let daysTodos;
    if (localStorage.getItem('todos') === null) {
      daysTodos = todosLS;
    } else {
      daysTodos = JSON.parse(localStorage.getItem('todos'));
    }
    return daysTodos;
  }

  static getTodoFor(dayName) {
    const daysTodos = Store.getTodos();

    return daysTodos[dayName];
  }

  static addTodo(todo) {
    const daysTodos = Store.getTodos();
    daysTodos[todo.day].push(todo);

    // set Item
    localStorage.setItem('todos', JSON.stringify(daysTodos));
  }

  static displayTodos() {
    // Show week status in UI
    let weekStat = Store.getWeekStatus();
    const ui = new UI();
    ui.setWeekStatus(weekStat);

    // Show todos
    const daysTodos = Store.getTodos();

    days.forEach(function(day) {
      const ui = new UI();
      daysTodos[day].forEach(function(todo) {
        let newTodo = new Todo(todo.day, todo.todo, todo.todoId, todo.done);
        ui.addTodoToList(newTodo, true);
      });
    });
  }

  static getWeekStatus() {
    let completed, pending;
    if (localStorage.getItem('completed') === null) {
      completed = 0;
    } else {
      completed = JSON.parse(localStorage.getItem('completed'));
    }

    if (localStorage.getItem('pending') === null) {
      pending = 0;
    } else {
      pending = JSON.parse(localStorage.getItem('pending'));
    }
    console.log(completed, pending);
    return [completed, pending];
  }

  static setWeekStatus(weekStatus) {
    localStorage.setItem('completed', JSON.stringify(weekStatus[0]));
    localStorage.setItem('pending', JSON.stringify(weekStatus[1]));
  }
}

// EventListeners:

// DOMLoaded:
document.addEventListener('DOMContentLoaded', Store.displayTodos());

// plus-circle button to add day's todo:
addDaysTodoBtn = document.querySelectorAll('.addDaysToDo');
addDaysTodoBtn.forEach(function(day) {
  day.addEventListener('click', function(e) {
    const ui = new UI();

    if (e.target.classList.contains('fa-plus-circle')) {
      e.target.classList.remove('fa-plus-circle');
      e.target.classList.add('fa-minus-circle');
      ui.addDaysTodo(e.target.id, true);
    } else {
      e.target.classList.remove('fa-minus-circle');
      e.target.classList.add('fa-plus-circle');
      ui.addDaysTodo(e.target.id, false);
    }
    e.preventDefault();
  });
});

// check-circle button to add todoList's todo for the day
let addTodoListBtn = document.querySelectorAll('.fa-check-circle');
addTodoListBtn.forEach(function(check) {
  check.addEventListener('click', function(e) {
    const ui = new UI();

    // day
    let day = e.target.parentElement.id.split('-')[0],
      // inp value
      todo =
        e.target.parentElement.parentElement.firstElementChild
          .firstElementChild,
      // todoId
      todoId = Store.getTodoFor(day).length + 1,
      // done
      done = false;

    const newtodo = new Todo(day, todo.value, todoId, done);

    ui.addTodoToList(newtodo, false);

    // Store in LS:
    Store.addTodo(newtodo);
    // Set Inp Field
    todo.value = '';

    e.preventDefault();
  });
});

// Action buttons for each todo:
todoItems.forEach(function(listGrp) {
  listGrp.addEventListener('click', function(e) {
    if (e.target.classList.contains('todoListCheck')) {
      // check-square buttons for each task:
      const ui = new UI();

      // Check in UI
      let todoIdDay = ui.getTodoIdDay(e.target);
      Store.updateDoneTodosInLS(todoIdDay[0], todoIdDay[1]);
      e.preventDefault();
    } else if (e.target.classList.contains('todoListRemove')) {
      // trash buttons for each task:
      // console.log(e.target);
      const ui = new UI();

      // Remove from UI
      let todoIdDay = ui.getTodoIdDay(e.target);
      console.log(todoIdDay[0], todoIdDay[1]);

      // Remove from LS
      Store.deleteTodo(todoIdDay[0], todoIdDay[1]);
      e.preventDefault();
    }
  });
});
