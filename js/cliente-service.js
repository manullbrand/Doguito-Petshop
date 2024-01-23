const criaNovaLinha = (nome, email) => {
  const linhaNovoCliente = document.createElement("tr");

  const conteudo = `
      <td class="td" data-td>${nome}</td>
                <td>${email}</td>
                <td>
                    <ul class="tabela__botoes-controle">
                        <li><a href="../pages/lista_cliente.html" class="botao-simples botao-simples--editar">Edit</a></li>
                        <li><button class="botao-simples botao-simples--excluir" type="button">Remove</button></li>
                    </ul>
                </td>
                `;
  linhaNovoCliente.innerHTML = conteudo;
  return linhaNovoCliente;
};

const tabela = document.querySelector("[data-tabela]");

const http = new XMLHttpRequest();

http.open("GET", "http://127.0.0.1:5500/profile");

http.onreadystatechange = () => {
  if (http.readyState === 4 && http.status === 200) {
    const data = JSON.parse(http.responseText);
    data.forEach((elemento) => {
      tabela.appendChild(criaNovaLinha(elemento.nome, elemento.email));
    });
  }
};

http.send();
