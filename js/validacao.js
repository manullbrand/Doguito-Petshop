export function valida(input) {
  const tipoDeInput = input.dataset.tipo;

  if (validadores[tipoDeInput]) {
    validadores[tipoDeInput](input);
  }

  if (input.validity.valid) {
    input.parentElement.classList.remove("input-container--invalido");
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = "";
  } else {
    input.parentElement.classList.add("input-container--invalido");
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML =
      mostraMensagemDeErro(tipoDeInput, input);
  }
}

const tiposDeErro = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "customError",
];

const mensagensDeErro = {
  nome: {
    valueMissing: "The Name field cannot be empty.",
  },
  email: {
    valueMissing: "The Email field cannot be empty.",
    typeMismatch: "The Email provided is not valid.",
  },
  senha: {
    valueMissing: "The Password field cannot be empty.",
    patternMismatch:
      "The password must be 6 to 12 characters long, with at least one uppercase letter, one number, and no symbols.",
  },
  dataNascimento: {
    valueMissing: "The Date of Birth field cannot be empty.",
    customError: "The Date of Birth field cannot be empty.",
  },
  cpf: {
    valueMissing: "The CPF field cannot be empty.",
    customError: "The provided CPF is not valid (it must present 11 digits).",
  },
  cep: {
    valueMissing: "The CEP field cannot be empty.",
    patternMismatch: "The provided CEP is not valid.",
    customError: "CEP not found.",
  },
  logradouro: {
    valueMissing: "The Street Address field cannot be empty.",
  },
  cidade: {
    valueMissing: "The City field cannot be empty.",
  },
  estado: {
    valueMissing: "The State field cannot be empty.",
  },
  preco: {
    valueMissing: "The CEP field cannot be empty.",
  },
};

const validadores = {
  dataNascimento: (input) => validaDataNascimento(input),
  cpf: (input) => validaCPF(input),
  cep: (input) => recuperarCEP(input),
};

function mostraMensagemDeErro(tipoDeInput, input) {
  let mensagem = "";
  /* deixo sem nada pois a mensagem vai depender de qual input não está preenchido e, portanto, dando erro */
  tiposDeErro.forEach((erro) => {
    if (
      input.validity[erro]
      /* Significa que vai checar o input e ver se tem um erro hipotético. Se sim, o retorno desse if é um booleano 'true', daí entra na condição. */
    ) {
      mensagem = mensagensDeErro[tipoDeInput][erro];
    }
  });

  return mensagem;
}

function validaDataNascimento(input) {
  const dataRecebida = new Date(input.value);
  let mensagem = "";

  if (!maiorQue18(dataRecebida)) {
    mensagem = "You must be over 18 to register..";
  }

  input.setCustomValidity(mensagem);
}

function maiorQue18(data) {
  const dataAtual = new Date(); // vazio assim, ele pega a data de hoje.
  const dataMais18 = new Date(
    data.getUTCFullYear() + 18,
    data.getUTCMonth(),
    data.getUTCDate()
  );

  return dataMais18 <= dataAtual;
}

function validaCPF(input) {
  // Remove any non-numeric characters

  const cpfFormatado = input.value.replace(/[^\d]/g, "");
  //cpf = cpf.replace(/[^\d]/g, '');
  let mensagem = "";

  // Check if the CPF has 11 digits
  if (cpfFormatado.length !== 11) {
    {
      mensagem = "The provided CPF is not valid (11 digits).";
    }
    input.setCustomValidity(mensagem);
    return false;
  }

  // Check for repeated digits (all the same)
  if (/^(\d)\1+$/.test(cpfFormatado)) {
    return false;
  }

  // Validate the CPF using the algorithm
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfFormatado.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpfFormatado.substring(9, 10))) {
    return false;
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfFormatado.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
}

function recuperarCEP(input) {
  const cep = input.value.replace(/\D/g, "");
  /* significa: queremos substituir tudo oq não for número por "nada" */

  /* agora aqui vou fazer uma requisição para uma API que, assim que o cliente se cadastrar com seu cep, as demais informações de endereço serão automaticamente completadas graças a essa API. Essas informações abaixo são necessárias para fazer o 'fetch'. */
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const options = {
    method: "GET",
    mode: "cors",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  };

  if (!input.validity.patternMismatch && !input.validity.valueMissing) {
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          input.setCustomValidity("CEP not found");
          return;
        }
        input.setCustomValidity("");
        preencheCamposComCEP(data);
        return;
      });
  }
}

function preencheCamposComCEP(data) {
  const logradouro = document.querySelector('[data-tipo="logradouro"]');
  const cidade = document.querySelector('[data-tipo="cidade"]');
  const estado = document.querySelector('[data-tipo="estado"]');

  /* todas essas informações de data aparecem dessa forma quando consulto a API retornando o console através do inspect da página */
  logradouro.value = data.logradouro;
  cidade.value = data.localidade;
  estado.value = data.uf;
}
