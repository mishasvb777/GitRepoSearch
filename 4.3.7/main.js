const inputText = document.querySelector('.input_text')
const container = document.querySelector('.container')
const resultSearch = document.querySelector('.result_search')
const listAddRepo = document.querySelector('.list_add_repo')
console.log(inputText.value)


const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(fnCall, debounceTime)
  }
};


function getPostFetch(nameRepo) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.github.com/search/repositories?${nameRepo}`)
    .then(response => response.json())  
    .then(post => resolve(post))
    .catch(err => console.log(err)) 
  })
}

function getRepo(string){
 while (resultSearch.firstChild){
  resultSearch.removeChild(resultSearch.firstChild)
 }
 getPostFetch(string).then(data => {    
    let listUsers = data.items  
    if(listUsers.length === 0){
      const emptyText = document.createElement('div')
      emptyText.textContent = `Ничего не найдено`
      resultSearch.appendChild(emptyText)
    }
    for (let i = 0; i < listUsers.length && i < 5; i++){
      const textName = document.createElement('div')
      textName.classList.add('search-result')
      textName.textContent = `repo: ${listUsers[i].name}, owner: ${listUsers[i].owner.login}`
      resultSearch.appendChild(textName)   

      textName.addEventListener('click', () => {
        while (resultSearch.firstChild){
          resultSearch.removeChild(resultSearch.firstChild)
         }
        const elementRepoList = document.createElement('div')
        elementRepoList.classList.add('elementRepoList')
        listAddRepo.appendChild(elementRepoList)

        const description = document.createElement('p')
        description.classList.add('description')       
        elementRepoList.appendChild(description)

        const name = document.createElement('span')
        name.textContent =  `name: ${listUsers[i].name}`
        description.appendChild(name)

        const owner = document.createElement('span')
        owner.textContent =  `owner: ${listUsers[i].owner.login}`
        description.appendChild(owner)

        const stars = document.createElement('span')
        stars.textContent =  `stars: ${listUsers[i].stargazers_count}`
        description.appendChild(stars)

        const link = document.createElement('a')
        link.href = listUsers[i].clone_url
        link.textContent = 'Перейти на GIT'
        description.appendChild(link)
        
        const deleteElement = document.createElement('button')
        deleteElement.classList.add('button-delete')
        elementRepoList.appendChild(deleteElement)   

        inputText.value = ""            

        deleteElement.addEventListener('click', () => {
          listAddRepo.removeChild(elementRepoList)                    
        })

        resultSearch.removeChild(textName)
      }) 
 


      console.log(`name: ${listUsers[i].name}`)
      console.log(`owner: ${listUsers[i].owner.login}`)
      console.log(`stars: ${listUsers[i].stargazers_count}`)
      console.log(`url: ${listUsers[i].clone_url}`)
    }  
    
  })
}


function onChange(e) {
  let searchName = e.target.value
  const queryString = 'q=' + encodeURIComponent(`${searchName} in:name`);
  getRepo(queryString)
}

onChange = debounce(onChange, 800)

inputText.addEventListener('input', onChange)













