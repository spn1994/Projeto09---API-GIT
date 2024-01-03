import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados

// eu passei pra classe qual root eu queria usar, classe contrutora
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()/* essa daqui faz carregar os dados */
  }
//aqui foi guardado e carregado os dados da aplicação (JSONparse faz modificaar em objeto)
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }
  //aqui faz salva os meus itens
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  //essa parte é assincrona, vai executando parte a parte
  async add(username) {
    try {
      //find encontra
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    //entradas filtradas(imutabilidade é vc criar novo item)
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    //novo array que é o filteredentries
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)/* essa linah fez criar a ponte entre a classe lá em cima, ele é o construtor la em */

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }
  //quando clicar no botao de adicionar, vai add o valor achado
  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }
  //sempre que houver update , ele remove
  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
        //evento criado pro evento de click, se precisa de + de um evento de click, eu acrescento addeventlistner
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')/* confirm retorna boolean */
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }
  //criei a tabela em js, precisa ser criado com a DOM, 
  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
        <a href="https://github.com/maykbrito" target="_blank">
          <p>Mayk Brito</p>
          <span>maykbrito</span>
        </a>
      </td>
      <td class="repositories">
        76
      </td>
      <td class="followers">
        9589
      </td>
      <td>
        <button class="remove">&times;</button>
      </td>
    `
    // retornou o meu tr
    return tr
  }
//função pra remover as tr
  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })  
  }
}