import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate aqui
import { useEffect } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
dayjs.locale('pt-br');

const AtividadesPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegação programática

  // Efeito para rolar a página para a seção específica
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Função para lidar com o clique do botão Voltar
  const handleGoBack = () => {
    navigate(-1); // Volta uma entrada no histórico do navegador
  };

  return (
    <>
      <div className="background-div-no-image text-white">
        <div className="container py-5">
          {/* DIV para alinhar o título e o botão de voltar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0" style={{ fontWeight: "bold" }}>Atividades Complementares (AC)</h1>
            <button
              onClick={handleGoBack}
              className="btn btn-outline-light btn-sm" // Botão claro, pequeno e com outline
            >
              <span className="d-none d-md-block">Voltar</span>
              <span className="d-block d-md-none"><FontAwesomeIcon icon={faArrowLeft} /></span>
            </button>
          </div>

          <section className="mb-5">
            <p className="text-light" style={{ fontSize: "1.1em" }}>
              As Atividades Complementares (AC) são componentes curriculares <strong className="text-warning">obrigatórios</strong> e essenciais para a integralização do currículo de todos os cursos de graduação da UFF, estando vinculadas diretamente às Coordenações de Cursos. Elas visam estimular o estudo independente, a atualização profissional contínua e a complementação de estudos, inclusive por meio de atividades realizadas fora do ambiente acadêmico tradicional.
              <br/><br/>
              Para auxiliar você nesse processo, <strong className="text-info">nossa plataforma foi desenvolvida para simplificar o registro e o acompanhamento das suas horas de AC</strong>, permitindo que você gerencie seu progresso de forma eficiente e sem complicações.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="mb-3" style={{ fontWeight: "bold" }}>Objetivo e Requisitos</h2>
            <p className="text-light" style={{ fontSize: "1.1em" }}>
              Atualmente, o curso de Ciência da Computação possuí dois currículos ativos:
              <ul>
                <li><strong className="text-info">31.02.002</strong>, protocolado em 2017</li>
                <li><strong className="text-info">31.02.003</strong>, protocolado em 2023</li>
              </ul>
              Para efeito de integralização curricular do curso de Ciência da Computação, o aluno deverá cumprir um mínimo de <strong className="text-warning">148 horas</strong> de Atividades Complementares no <strong className="text-info">currículo 31.02.003</strong> ou <strong className="text-warning">240 horas</strong> no <strong className="text-info">currículo 31.02.002</strong>, seguindo as normas específicas estabelecidas. É importante ressaltar que <strong className="text-warning">existe um limite de contribuição de horas para cada Atividade Complementar</strong>. Não é possível completar todas as horas com uma única atividade.
            </p>
            <p className="text-light" style={{ fontSize: "1.1em" }}>
              A carga horária de <strong className="text-info">Disciplinas Eletivas</strong> cursadas na UFF pode ser utilizada para compor a carga horária de Atividades Complementares, desde que aprovada pela Comissão de Atividades Complementares. Contudo, a carga horária proveniente de disciplinas eletivas <strong className="text-warning">não poderá ser superior à metade da carga horária total</strong> exigida para as ACs.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="mb-3" style={{ fontWeight: "bold" }}>Procedimento para Registro (SRAC)</h2>
            <p className="text-light" style={{ fontSize: "1.1em"}}>
              Para que uma atividade seja contabilizada como Atividade Complementar, o aluno interessado deverá realizar uma solicitação específica à Coordenação de Curso. <strong className="text-info">Nossa ferramenta simplifica este processo, permitindo que você gerencie suas atividades e gere o formulário necessário de forma automatizada.</strong>
            </p>

            <h3 className="mb-3 mt-4" style={{ fontWeight: "bold" }}>Passos para a Solicitação com o apoio da Ferramenta:</h3>
            <ol className="list-group list-group-numbered list-group-flush bg-transparent">
              <li className="list-group-item bg-transparent text-light border-light border-opacity-25 py-3">
                <strong className="text-warning">1. Registre e Acompanhe suas Atividades:</strong> Utilize o <Link to="/dashboard" className="text-info text-decoration-underline">Dashboard da nossa plataforma</Link> para registrar cada uma das suas atividades complementares, incluindo detalhes e comprovantes. Nossa ferramenta o ajudará a acompanhar o total de horas acumuladas por categoria.
              </li>
              <li className="list-group-item bg-transparent text-light border-light border-opacity-25 py-3">
                <strong className="text-warning">2. Geração do Formulário SRAC:</strong> Após registrar e consolidar suas atividades em nossa plataforma, você poderá <strong className="text-info">gerar um Formulário de Solicitação de Registro de Atividade Complementar (SRAC) pré-preenchido</strong> com todas as informações e horas calculadas, pronto para ser submetido.
              </li>
              <li className="list-group-item bg-transparent text-light border-light border-opacity-25 py-3">
                <strong className="text-warning">3. Anexe Comprovantes e Envie:</strong> Imprima o formulário gerado pela plataforma, assine-o, anexe todos os comprovantes físicos (ou digitais, conforme as instruções da Coordenação) e envie-o para o e-mail: <a href="mailto:tgi.tic@id.uff.br" className="text-info text-decoration-underline">tgi.tic@id.uff.br</a>.
              </li>
              <li className="list-group-item bg-transparent text-light border-light border-opacity-25 py-3">
                <strong className="text-warning">4. Prazo:</strong> A solicitação deve ser enviada com, no mínimo, <strong className="text-info">60 dias antes do fim do período letivo</strong> determinado no calendário escolar. Este prazo é essencial para a análise da Comissão de Atividades Complementares.
              </li>
              <li className="list-group-item bg-transparent text-light border-light border-opacity-25 py-3">
                <strong className="text-warning">5. Resultado:</strong> A Coordenação de Curso informará ao aluno solicitante sobre o resultado da análise da Comissão de Atividades Complementares, registrando a ciência do aluno na cópia da SRAC.
              </li>
            </ol>
            <p className="text-light mt-4" style={{ fontSize: "0.95em" }} id="tabela-atividades">
              <strong className="text-warning">Nota:</strong> Embora a ferramenta automatize o preenchimento, a responsabilidade final pela exatidão das informações e pela entrega dentro do prazo e nos moldes exigidos pela Coordenação é do aluno. Certifique-se sempre de anexar a documentação comprobatória correta.
            </p>
          </section>

          {/* Seção da Tabela de Atividades - ADICIONADO O ID AQUI */}
          <section className="mb-5" >
            <h2 className="mb-3" style={{ fontWeight: "bold" }}>Tabela de Pontuação para Atividades Complementares</h2>
            <p className="text-light" style={{ fontSize: "1.1em" }}>
              Abaixo, um resumo das categorias de atividades e sua pontuação, conforme a "Tabela de Pontuação para Atividades Complementares". Para o cálculo exato e limites, sempre consulte a <strong className="text-info">tabela completa</strong> e o <strong className="text-info">regulamento oficial</strong> do curso, pois os currículos podem ter critérios distintos (Antigo/Novo).
            </p>

            <div className="table-responsive">
              <table className="table table-dark table-striped table-bordered text-center">
                <thead>
                  <tr>
                    <th scope="col" className="text-warning">TIPO DE ATIVIDADE</th>
                    <th scope="col" className="text-info">HORAS EQUIVALENTES / MÁXIMO DE HORAS EQUIV.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Disciplina Eletiva presencial ou a distância - UFF</td>
                    <td>34 horas cursadas = 17 horas/AC / 17 horas/AC</td>
                  </tr>
                  <tr>
                    <td>Iniciação a Docência</td>
                    <td>1 ano = 34 horas/AC / 34 horas/AC</td>
                  </tr>
                  <tr>
                    <td>Participação em seminários, congressos e eventos</td>
                    <td>3 horas cursadas = 1 hora/AC / 17 horas</td>
                  </tr>
                  <tr>
                    <td>Publicação de trabalho completo em periódico / livro</td>
                    <td>1 trabalho = 34 horas/AC / 34 horas/AC</td>
                  </tr>
                  <tr>
                    <td>Participação em cursos e treinamentos na área de Computação</td>
                    <td>60 horas cursadas = 17 horas/AC / 17 horas</td>
                  </tr>
                  <tr>
                    <td>Participação em Competição de Base Tecnológica e Caráter Educacional / Maratona</td>
                    <td>1 hora = 0,5 hora/AC / 34 horas</td>
                  </tr>
                  <tr>
                    <td>Hackaton</td>
                    <td>4 horas = 1 hora/AC / 17 horas</td>
                  </tr>
                  <tr>
                    <td>Organização de eventos na área de Computação ou afins</td>
                    <td>1 evento organizado = 3 horas/AC / 6 horas</td>
                  </tr>
                  <tr>
                    <td>Estágio Não Obrigatório</td>
                    <td>60 horas = 1 hora/AC / 34 horas</td>
                  </tr>
                  <tr>
                    <td>Cursos de Línguas Estrangeiras</td>
                    <td>34 horas cursadas = 34 horas/AC / 34 horas</td>
                  </tr>
                  <tr>
                    <td>Membro de Entidade Estudantil (DA, CA, Atlética)</td>
                    <td>1 ano = 34 horas/AC / 34 horas/AC</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-light mt-3" style={{ fontSize: "0.9em" }}>
              <strong className="text-warning">Observação:</strong> Esta tabela é um extrato. Consulte a <a href="/Tabela_AC.pdf" target="_blank" rel="noopener noreferrer" className="text-info text-decoration-underline">"Tabela de Pontuação para Atividades Complementares"</a> completa e o <a href="/001-2015_regulamento_do_curso_de_graduacao_0.pdf" target="_blank" rel="noopener noreferrer" className="text-info text-decoration-underline">"Regulamento dos Cursos de Graduação da UFF"</a> (Resolução Nº 001/2015, Título II, Capítulo III, Art. 19 a Art. 21) para detalhes e demais atividades elegíveis.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AtividadesPage;