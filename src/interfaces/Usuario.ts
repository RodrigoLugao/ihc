import type { CurriculoTipo } from "../utils/acutils";

export interface Usuario{
    email: string;
    senha: string;
    nome: string;
    curriculo: CurriculoTipo;
    id: number;
    matricula: string;
    telefone: string;
};

export const usuarioData: Usuario[] = [
    {
        email: "larissaalves@id.uff.br",
        senha: "larissa",
        nome: "Larissa Alves",
        curriculo: "31.02.003",
        id: 1,
        matricula: "1",
        telefone: "999999991"
    },
    {
        email: "lucasmenezes@id.uff.br",
        senha: "lucas",
        nome: "Lucas Menezes",
        curriculo: "31.02.002",
        id: 2,
        matricula: "2",
        telefone: "999999992"
    },
    {
        email: "nataliafernandes@id.uff.br",
        senha: "natalia",
        nome: "Natália Fernandes",
        curriculo: "31.02.003",
        id: 3,
        matricula: "3",
        telefone: "999999993"
    },
    {
        email: "marcelovilla@id.uff.br",
        senha: "marcelo",
        nome: "Marcelo Villa",
        curriculo: "31.02.003",
        id: 4,
        matricula: "4",
        telefone: "999999994"
    },
];