
export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    //foi usado ideia de desestruturar e usar como argumento
    //ele só pega esses itens q coloquei do JSON
    .then(data => data.json())
    .then(({ login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers
    }))
  }
}
