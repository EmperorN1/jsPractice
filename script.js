class View {
  constructor() {
    // получаем из html необходимые для работы элементы
    this.searchInput = document.querySelector('input')
    this.searchDDBox = document.querySelector('.drop-down_box')
    this.result = document.querySelector('.result')
    
    this.searchInput.addEventListener('keyup', this.debounce(this.searchReps.bind(this), 500))    // придаем полю ввода обработчик событий 
  }
  
  async searchReps() {
    if(this.searchInput.value.trim()) {     //проверка на наличие пробелов или же пустоту
      return await fetch(`https://api.github.com/search/repositories?q=${this.searchInput.value}&per_page=5`)
      .then((result) => {
        this.searchDDBox.replaceChildren()  //очищаем выпадающее меню перед выводом нового 
        if (result.ok) {
          result.json().then (result => {
            result.items.forEach(rep => this.createDDBox(rep))    //поочерёдно вызываем функцию для создания каждого элемента в выпадающее меню 
          })
        } else throw new Error('He получен ответ от сервера')     //вывод ошибки в случе необработки запроса
      })
    } else this.searchDDBox.replaceChildren()   //очищаем выпадающее меню если удалили все в инпуте
  }

  createDDBox(data) {   //функция для создания выпадающего меню
    const element = this.createElement('li', '')
    element.insertAdjacentHTML('afterbegin', `${data.name}`)
    element.addEventListener('click', () => this.addRep(data))  //придаём элементу обработчик события на создание элемента списка репозиториев
    this.searchDDBox.append(element)
  }

  addRep(data) {    //функция для создания элемента для списка репозиториев
    const element = this.createElement('div', 'repository')
    const deleteX = this.createElement('div', 'delete')   //создаём кнопку удаления элемента
    element.insertAdjacentHTML('afterbegin', 
    `<span class='text'>Name: ${data.name}</span><br>
     <span class='text'>Owner: ${data.owner.login}</span><br>
     <span class='text'>Stars: ${data.stargazers_count}</span><br>
     `)

    element.append(deleteX)
    this.result.append(element)
    // очищение инпута и удаление выпадающего меню при записи элемента
    this.searchInput.value = ''
    this.searchDDBox.replaceChildren()

    deleteX.addEventListener('click', this.deleteRep)   //обработчик событий для удаления элемента
  }



  createElement(e, cls) {   //упрощение функции для создания элементов сразу с необходимым классом
    const elem = document.createElement(e);
    if (cls) {elem.classList.add(cls)}
    return elem
  }

  deleteRep() {     //функция удаления элемента с удалением обработчика событий
    this.parentElement.remove();
    this.removeEventListener('click', this.deleteRep)
  }
  
  debounce = (fn, debounceTime) => {    //функция для временной задержки вывода выпадающего меню
    let sTOlink
    return function() {
      const func = () => {fn.apply(this, arguments)}
      clearTimeout(sTOlink)
      sTOlink = setTimeout(func, debounceTime)
    }
  };
}

new View;