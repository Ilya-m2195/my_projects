(function () {

    let arrayList = [];
    let listName = '';

    // Создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    // Создаем и возвращаем  форму для создания дела
    function createTodoItemForm() {
        // создаем форму
        let form = document.createElement('form');
        // создаем поле ввода
        let input = document.createElement('input');
        // создаем оболочку кнопок
        let buttonWrapper = document.createElement('div');
        // создаем кнопку
        let button = document.createElement('button');

        // добавляем классы форме, полю ввода, кнопке
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        // добавлем текст кнопки
        button.textContent = 'Добавить дело';
        button.disabled = true;

        // Блокируем кнопку создания дела, если поле пустое
        function disabledButton() {
            if (input.value.length === 0) {
                button.disabled = true;
            } else {
                button.disabled = false;
            };
        };

        input.addEventListener('input', disabledButton);

        // добавлем кнопку в оболочку 
        buttonWrapper.append(button);
        // добавлем поле ввода в форму
        form.append(input);
        // добавлем оболочку с кнопкой в форму
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    };


    // создаем и возвращаем список элементов
    function createTodoLisst() {
        // создаем список
        let list = document.createElement('ul');
        //добавляем списку клас
        list.classList.add('list-group');
        return list;
    };

    function createTodoItem(object) {

        // создаем элемент списка
        let item = document.createElement('li');

        // создаем 2 кнопки в div-оолочке
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        // добавляем элементу списка классы 
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // наполняем  элемент содержимым, переданным из объекта.
        item.textContent = object.name;

        // добавляем классы оболочке кнопок
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        // добавляем классы и добавляем текст кнопкам
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';


        //  если свойство об-та done === true, присваиваем об-ту класс
        // (это сделано для того, чтобы при перезагрузке страницы не обнулялся класс)
        
            if (object.done === true) {
                item.classList.add('list-group-item-success');
            }
        

        // вешаем обработчик событий и добавляем/убираем классы кнопкам элемента списка
        doneButton.addEventListener('click', function () {

            item.classList.toggle('list-group-item-success');

            for (const itemElement of arrayList) {
                if (itemElement.id === object.id) {
                    itemElement.done = !itemElement.done;
                };
            };

            saveList(arrayList, listName);
        });


        // проходим циклом по массиву обЪектов и если id элемента массива совпадает с id дела,
        // то мы можем по нажатию кнопки изменить свойство об-кта DONE на противоположное


        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();

                // проходим циклом по массиву обЪектов и если id элемента массива совпадает с id дела,
                // то мы удаляем об-кт
                for (let i = 0; i < arrayList.length; i++) {
                    if (arrayList[i].id == object.id) {
                        arrayList.splice(i, 1);
                    };
                };

                saveList(arrayList, listName);
            };
        });

        //вкладываем кнопки в оболочку
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        // вкладываем оболочку с кнопками в элемент
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        };
    };

    function saveList(array, keyName) {
        localStorage.setItem(keyName, JSON.stringify(array));
    };

    function createTodoApp(conteiner, title = 'Список дел', keyName) {


        let todoAppTitle = createAppTitle(title);
        let todoIntemForm = createTodoItemForm();
        let todoList = createTodoLisst();

        listName = keyName;

        conteiner.append(todoAppTitle);
        conteiner.append(todoIntemForm.form);
        conteiner.append(todoList);

        let localData = localStorage.getItem(listName);

        if (localData !== null && localData !== '') {
            arrayList = JSON.parse(localData);
        };

        for (const itemList of arrayList) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        // браузер создает событие submet на форме по нажатию enter или на кнопку создания дела
        todoIntemForm.form.addEventListener('submit', function (e) {
            //функция предотвращает стандартное событие браузера (перезагрузка страницы после отправки формы)
            e.preventDefault();
            // игнорируем создание элемента, если поле ввода пустое
            if (!todoIntemForm.input.value) {
                return
            };

            //создаем уникальный ID
            function getId(array) {
                let maxNum = 0;
                for (const el of array) {
                    if (el.id > maxNum) {
                        maxNum = el.id;
                    }
                };
                return maxNum + 1;
            };

            //создаем обЪект
            let objectItem = {
                id: getId(arrayList),
                name: todoIntemForm.input.value,
                done: false,
            };

            //передаем объект в функцию.
            let todoItem = createTodoItem(objectItem);
            // длбавляем обЪект в массив
            arrayList.push(objectItem);
            // сохраняем объект локально

            saveList(arrayList, listName);


            // создаем и добавляем в список новое дело с названием, взятым из формы
            todoList.append(todoItem.item);
            // обнуляем поле ввода и блокируем кнопку
            todoIntemForm.input.value = '';
            todoIntemForm.button.disabled = true;

        });
    };

    window.createTodoApp = createTodoApp;
})();