// ***********************************************
// app.js
// é a verdadeira 'porta de entrada' da aplicação
// ***********************************************

import React from 'react';
import Tabela from './Tabela';
import Formulario from './Formulario';


/**
 * função que irá interagir com a API,
 * e ler os dados das Fotografias
 */
async function getFotos() {
  /**
   * não podemos executar esta instrução por causa do CORS
   * https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS
   * let resposta = await fetch("https://localhost:44342/api/FotografiasAPI/"); 
   * Vamos criar um 'proxy', no ficheiro 'package.json'
   * Depois de criado, é necessário re-iniciar o React  
   */
  // fazer o acesso a um 'endpoint', com os dados das Fotos
  let resposta = await fetch("Api/FotografiasAPI/");

  if (!resposta.ok) {
    // não obtivemos o 'código de erro' HTTP 200
    console.error(resposta);
    throw new Error('não foi possível ler os dados das Fotos. Código= ' + resposta.status);
  }

  // devolver os dados a serem usados na componente 
  return await resposta.json();
}

/**
 * invoca a API e envia os dados da nova Fotografia
 * @param {*} dadosNovaFotografia 
 */
 async function adicionaFoto(dadosNovaFotografia) {
  // https://developer.mozilla.org/pt-BR/docs/Web/API/FormData
  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
  let formData = new FormData();
  formData.append("foto", dadosNovaFotografia.UploadFotografia);
  formData.append("dataFoto", dadosNovaFotografia.DataFoto);
  formData.append("localFoto", dadosNovaFotografia.Local);
  formData.append("Fotografo", dadosNovaFotografia.Fotografo);

  let resposta = await fetch("Api/FotografiasAPI", {
    method: "POST",
    body: formData
  });


  if (!resposta.ok) {
    // não obtivemos o 'código de erro' HTTP 200
    console.error(resposta);
    throw new Error('não foi possível enviar os dados da nova fotografia. Código= ' + resposta.status);
  }

  // devolver os dados a serem usados na componente 
  return await resposta.json();
}


/**
 * Componente 'principal' do meu projeto
 */
class App extends React.Component {
  /**
   * o Construtor tem SEMPRE este nome
   */
  constructor(props) {
    // a instrução seguinte É SEMPRE a primeira instrução a ser executada
    // dentro do construtor
    super(props);

    this.state = {
      /**
       * irá guardar a lista de Fotografias vindas da API
       */
      fotos: [],
      /**
       * estados do projeto, durante a leitura de dados na API
       * @type {"carregando dados" | "erro" | "sucesso"}
       */
      loadState: "carregando dados",
      /**
       * se algo correr mal, irá aqui ser colocado a mensagem de erro
       */
      errorMessage: null,
    }
  }

  /**
   * qd o componente é criado, 
   * será executado automaticamente
   */
  componentDidMount() {
    // ler os dados da Fotografias e adicioná-los à state 'fotos'
    this.loadFotos();
  }

  /**
   * invocar o carregamento das Fotografias
   */
  async loadFotos() {
    /** TAREFAS
     * 1. ler os dados da API (fetch)
     * 2. adicionar ao state (setState())
     */
    try {
      // 1.
      this.setState({
        loadState: "carregando dados"
      });
      let fotosDaAPI = await getFotos();

      // 2.
      this.setState({
        fotos: fotosDaAPI,
        loadState: "sucesso"
      });
    } catch (erro) {
      this.setState({
        loadState: "erro",
        errorMessage: erro.toString()
      });
      console.error("Erro ao carregar os dados das Fotos: ", erro)
    }
  }


  /**
   * processar os dados recolhidos pelo Formulário
   * @param {*} dadosDoFormulario 
   */
  handlerDadosForm = async (dadosDoFormulario) => {
    /**
     * TAREFAS:
     * 1. preparar os dados para serem enviados para a API
     * 2. enviar os dados para a API
     * 3. efetuar o reload da tabela
     */

    // 1.
    // já está feito.
    // o parâmetro de entrada -dadosDoFormulario- já contém os dados formatados
    try {
      // 2.
      await adicionaFoto(dadosDoFormulario);

      // 3.
      await this.loadFotos();

    } catch (erro) {
      this.setState({
        errorMessage: erro.toString()
      });
      console.error("Erro ao submeter os dados da nova fotografia: ", erro)
    }
  }

  render() {
    // ler os dados existentes no array
    const { fotos } = this.state;

    switch (this.state.loadState) {
      case "carregando dados":
        return <p>A carregar dados. Aguarde, por favor...</p>
      case "erro":
        return <p>Ocorreu um erro: {this.state.errorMessage}.</p>
      case "sucesso":
        return (
          <div className="container">
            <h1>Fotografias</h1>
            <hr></hr>
            {/* componente para apresentar no ecrã um formulário 
                para efetuarmos o upload de uma imagem */}
            <h4>Carregar nova fotografia</h4>
            <hr></hr>
            <Formulario inDadosFotos={fotos}
              outDadosFotos={this.handlerDadosForm}
            />
            <div className="row">
              <div className="container">
                <hr />
                <h4>Tabela de fotografias</h4>
                {/* Tabela tem um 'parâmetro de entrada', chamado 'inDadosFotos'.
                Neste caso, está a receber o array JSON com os dados das fotos,
                lidas da API */}
                <Tabela inDadosFotos={fotos} />
              </div>
            </div>
            <div class="container">
            &copy; 2020/2021 - TI2 - Cotovia - <a href="https://www.linkedin.com/in/ana-ribeiro-560bb4214/" class="linkext">Ana Ribeiro nº:21283</a> e <a href="https://www.linkedin.com/in/diogo-polidoro-30610a215/" class="linkext">Diogo Polidoro nº:20752</a> - <a href="http://www.ipt.pt/" class="linkext">IPT</a>
          </div><br></br>
          </div>
        );
      default:
        return null;
    }
  }
}



export default App;
