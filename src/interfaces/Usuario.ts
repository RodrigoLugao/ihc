export interface Usuario{
    email: string;
    senha: string;
    nome: string;
    curriculoNovo: boolean;
    id: number;
    matricula: string;
    telefone: string;
};

export const usuarioData: Usuario[] = [
    {
        email: "larissaalves@id.uff.br",
        senha: "larissa",
        nome: "Larissa Alves",
        curriculoNovo: true,
        id: 1,
        matricula: "1",
        telefone: "999999991"
    },
    {
        email: "lucasmenezes@id.uff.br",
        senha: "lucas",
        nome: "Lucas Menezes",
        curriculoNovo: true,
        id: 2,
        matricula: "2",
        telefone: "999999992"
    },
    {
        email: "nataliafernandes@id.uff.br",
        senha: "natalia",
        nome: "Natália Fernandes",
        curriculoNovo: true,
        id: 3,
        matricula: "3",
        telefone: "999999993"
    },
    {
        email: "marcelovilla@id.uff.br",
        senha: "marcelo",
        nome: "Marcelo Villa",
        curriculoNovo: true,
        id: 4,
        matricula: "4",
        telefone: "999999994"
    },
];