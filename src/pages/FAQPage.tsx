import { Link } from "react-router-dom";
// dayjs import not strictly needed for this page unless you add dynamic date content
// import dayjs from 'dayjs';
// import 'dayjs/locale/pt-br';
// dayjs.locale('pt-br');

const FAQPage = () => {
  return (
    <>
      <div className="background-div-no-image text-white">
        <div className="container py-5">
          <h1 className="mb-4" style={{ fontWeight: "bold" }}>Perguntas Frequentes (FAQ)</h1>

          <section className="mb-5">
            <p className="text-light" style={{ fontSize: "1.1em" }}>
              Aqui você encontrará respostas para as dúvidas mais comuns sobre as Atividades Complementares (AC) e o uso da nossa plataforma. Se sua pergunta não estiver listada, não hesite em entrar em contato com a Coordenação do Curso.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>Dúvidas Gerais sobre AC</h2>

            <div className="accordion accordion-flush" id="faqAccordionGeral">
              {/* Pergunta 1 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="false"
                    aria-controls="collapseOne"
                  >
                    O que são Atividades Complementares e por que são obrigatórias?
                  </button>
                </h3>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#faqAccordionGeral"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </div>
                </div>
              </div>

              {/* Pergunta 2 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Qual a carga horária mínima de ACs para o meu curso?
                  </button>
                </h3>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#faqAccordionGeral"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin interdum justo eget justo fermentum, a finibus eros tincidunt. Fusce ut libero at magna finibus semper. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed vel justo a elit fermentum tristique.
                  </div>
                </div>
              </div>

              {/* Pergunta 3 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Disciplinas Eletivas podem ser usadas como ACs? Qual o limite?
                  </button>
                </h3>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#faqAccordionGeral"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac velit vel quam fringilla fermentum. Nam bibendum turpis nec mi finibus, in euismod quam eleifend. Praesent eget mauris quis libero accumsan facilisis. Nullam eu sem eu felis laoreet eleifend.
                  </div>
                </div>
              </div>

              {/* Pergunta 4 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingFour">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Onde consigo a Tabela de Pontuação completa das Atividades Complementares?
                  </button>
                </h3>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFour"
                  data-bs-parent="#faqAccordionGeral"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed justo ac odio mollis efficitur. In hac habitasse platea dictumst. Quisque dapibus dolor vel nunc finibus, a lacinia purus hendrerit. Etiam id felis eget sapien euismod efficitur.
                    <br/><br/>
                    Você pode consultar nossa <Link to="/atividades" className="text-info text-decoration-underline">página sobre Atividades Complementares</Link> para mais informações e links para os documentos oficiais.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-5 mt-5">
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>Dúvidas sobre a Plataforma e o SRAC</h2>

            <div className="accordion accordion-flush" id="faqAccordionPlataforma">
              {/* Pergunta 5 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingFive">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFive"
                    aria-expanded="false"
                    aria-controls="collapseFive"
                  >
                    Como registro minhas atividades na plataforma?
                  </button>
                </h3>
                <div
                  id="collapseFive"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFive"
                  data-bs-parent="#faqAccordionPlataforma"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet libero ut velit accumsan volutpat. Duis efficitur, dolor nec eleifend varius, velit neque gravida erat, id feugiat justo magna vel justo. Nam eu justo vitae libero dictum cursus.
                    <br/><br/>
                    Acesse seu <Link to="/dashboard" className="text-info text-decoration-underline">Dashboard</Link> para começar a registrar suas atividades.
                  </div>
                </div>
              </div>

              {/* Pergunta 6 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingSix">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSix"
                    aria-expanded="false"
                    aria-controls="collapseSix"
                  >
                    A plataforma gera o Formulário SRAC automaticamente?
                  </button>
                </h3>
                <div
                  id="collapseSix"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingSix"
                  data-bs-parent="#faqAccordionPlataforma"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat. Proin efficitur enim sit amet urna tincidunt, vel finibus libero interdum. Sed vel sapien vel dolor fermentum venenatis. Nunc eu purus in justo accumsan dapibus.
                  </div>
                </div>
              </div>

              {/* Pergunta 7 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingSeven">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSeven"
                    aria-expanded="false"
                    aria-controls="collapseSeven"
                  >
                    Qual o prazo para enviar o SRAC para a Coordenação?
                  </button>
                </h3>
                <div
                  id="collapseSeven"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingSeven"
                  data-bs-parent="#faqAccordionPlataforma"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, elit eu tincidunt accumsan, justo justo ullamcorper velit, nec lacinia justo ipsum vel ipsum. Sed id nulla ut libero tincidunt bibendum.
                  </div>
                </div>
              </div>

              {/* Pergunta 8 */}
              <div className="accordion-item bg-dark text-white border-bottom border-light border-opacity-25">
                <h3 className="accordion-header" id="headingEight">
                  <button
                    className="accordion-button collapsed bg-dark text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseEight"
                    aria-expanded="false"
                    aria-controls="collapseEight"
                  >
                    O que fazer se minha atividade não se encaixa na tabela de pontuação?
                  </button>
                </h3>
                <div
                  id="collapseEight"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingEight"
                  data-bs-parent="#faqAccordionPlataforma"
                >
                  <div className="accordion-body text-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel turpis in nunc tincidunt fermentum. Integer vel justo id felis malesuada malesuada. Quisque nec nisl ac libero tincidunt eleifend.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>Ainda tem dúvidas?</h2>
            <p className="text-light" style={{ fontSize: "1.1em" }}>
              Se você não encontrou a resposta para sua pergunta, por favor, entre em contato com a Coordenação do Curso de Ciência da Computação da UFF, ou utilize os canais de suporte da nossa plataforma (se houver).
            </p>
            {/* Opcional: Adicionar um botão ou link para contato/suporte */}
            {/* <div className="text-center mt-4">
              <Link to="/contato" className="btn btn-info btn-lg">Entrar em Contato</Link>
            </div> */}
          </section>
        </div>
      </div>
    </>
  );
};

export default FAQPage;