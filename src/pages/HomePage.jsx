// HomePage.jsx
import { Link } from "react-router-dom";
import listaJogoImg from "../assets/images-readme/lista_jogo.png";
import blocoNotasImg from "../assets/images-readme/blocoNotas.png";
import addColaboradorImg from "../assets/add-colaborador.png"; // Adicione esta imagem
import inventarioVazioImg from "../assets/inventario-vazio.png"; // Adicione esta imagem

const copyPrompt = () => {
  const codeContent = document.getElementById("prompt")?.textContent || "";

  navigator.clipboard
    .writeText(codeContent)
    .then(() => {
      console.log("Copiado!");
    })
    .catch((err) => {
      console.error("Erro:", err);
    });
};

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>EDTMS - Elite Dangerous Tabela de Materiais Sincronizada</h1>
        <h5>Desenvolvido por Gabriel Mazzuchello Dal Molin</h5>
      </header>

      {/* Codigo de alertas (manterei para possiveis avizos futuros) */}
      {/* <div className="beta-alert">
        <h3>⚠️ Versão Beta - Aviso Importante</h3>
        <p>
          Devido às limitações do domínio gratuito, recarregar a página fora da
          Home pode resultar em erro 404. Para continuar, retorne ao{" "}
          <Link className="home_link" to="/">
            início
          </Link>
          .
        </p>
      </div> */}

      <div className="guide-section">
        <h2>📘 Guia Rápido de Uso</h2>
        <h3>
          App para ler seu cargo e contabilizar automaticamente os materiais
          comprados
        </h3>
        <br />
        <p>
          Coloque seu UID e carregue as construções da sua conta após isso so
          selecionar a construção que esteja fazendo
        </p>
        <div className="tools-grid">
          <a className="tool-card" href="arquivos/EDTMS-CS.zip" download>
            EDTMS-CS
          </a>
        </div>
        <br />
        <p>
          <strong>Temos duas formas de criar um inventário:</strong>
        </p>
        <ol className="feature-list">
          <li>
            <a href="#inventory-files" className="home_link">
              Criar Inventário a partir de um Arquivo CSV ou JSON (Recomendado)
            </a>
          </li>
          <li>
            <a href="#inventory-empty" className="home_link">
              Criar Inventário Vazio
            </a>
          </li>
        </ol>
        {/* Seção de Inventário Vazio */}
        <div className="step">
          <div className="step-content">
            <h3 id="inventory-empty">📥 Criar Inventário Vazio</h3>
            <ol className="feature-list">
              <li>Clique em "Novo Inventário"</li>
              <li>Clique em "Criar Inventário vazio"</li>
              <li>
                De o nome para a tabela e clique em "Criar Vazio" na tabela terá
                sempre no final os campos para adicionar materiais manualmente
              </li>
              <li>
                Preencha os campos:
                <ul className="sublist">
                  <li>
                    <strong>Nome do Material</strong> (digite o nome exato)
                  </li>
                  <li>
                    <strong>Quantidade</strong> (valor numérico)
                  </li>
                </ul>
              </li>
              <li>
                Clique em <strong>➕ Adicionar</strong>
              </li>
              <li className="highlight">
                Materiais com nomes iguais serão somados automaticamente!
              </li>
            </ol>
            <img
              src={inventarioVazioImg}
              alt="Formulário para adicionar materiais manualmente"
              className="guide-image"
            />
          </div>
        </div>
        {/* Seção de Colaboração */}
        <div className="step">
          <div className="step-content">
            <h3>👥 Adicionar Colaborador</h3>
            <ol className="feature-list">
              <li>
                Peça ao colaborador seu <strong>UID</strong> (disponível na
                barra de navegação)
              </li>
              <li>
                No inventário desejado, localize a seção "Adicionar Colaborador
                por UID" embaixo da tabela.
              </li>
              <li>Cole o UID no campo indicado</li>
              <li>
                Clique em <strong>Adicionar Colaborador</strong>
              </li>
            </ol>
            <div className="image-group">
              <img
                src={addColaboradorImg}
                alt="Campo para adicionar colaborador via UID"
                className="guide-image"
              />
            </div>
          </div>
        </div>{" "}
        {/* Seção de criação de inventário por arquivos */}
        <div className="step">
          <div className="step-content">
            <h3 id="inventory-files">
              📥 Criar Inventário por Arquivos (recomendado)
            </h3>
            <h3>Tire prints dos itens no jogo</h3>
            <img
              src={listaJogoImg}
              alt="Campo para adicionar colaborador via UID"
              className="guide-image"
            />
            <h4>
              Após isso você pode levar as fotos para o chatgpt ou deepseek e
              pedir para converter para json
            </h4>
            <br />

            <h3>Conversão para JSON</h3>
            <p>
              Use uma das ferramentas abaixo para conversão:
              <div className="tools-grid">
                <a
                  className="tool-card"
                  href="https://www.deepseek.com"
                  target="_blank"
                  rel="noopener"
                >
                  DeepSeek
                </a>
                <a
                  className="tool-card"
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noopener"
                >
                  ChatGPT
                </a>
              </div>
              Prompt: (Esse é o prompt que eu uso, mas você pode usar o que
              quiser e ordernar do seu jeito)
              <br />
              <code id="prompt">
                <button id="copyButton" onClick={copyPrompt}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1621/1621635.png"
                    alt="Copiar"
                  />
                </button>
                Converta as tabelas dos arquivos fornecidos em um único objeto
                JSON, seguindo estas regras: 1. Use os nomes dos materiais como
                chaves, sem acentuação. 2. A primeira letra de cada palavra
                principal deve ser maiúscula, exceto preposições/artigos (ex:
                "de", "e"). 3. Mantenha os valores numéricos como inteiros
                (exemplo: "2.466" vira 2466). 4. Ordene as entradas do maior
                para o menor valor numérico. Exemplo de conversão e ordenação: -
                Entrada original: "Aço": 2.466 → "Aco": 2466 (primeiro item no
                JSON) - "Titânio": 1.805 → "Titanio": 1805 (segundo item)
              </code>
            </p>
            <p>
              Agora você salva o arquivo como na imagem abaixo e é só carregar
              no site na opção "Carregar arquivo" para criar o inventário
            </p>
            <img
              src={blocoNotasImg}
              alt="Exemplo bloco de notas"
              className="guide-image"
            />
          </div>
        </div>
      </div>

      <div className="quick-start">
        <h2>🚀 Vamos Começar</h2>
        <br />
        <div className="cta-buttons">
          <Link to="/inventory/new" className="cta-button">
            📤 Criar inventario
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
