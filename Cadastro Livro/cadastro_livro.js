
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const CHAVE_STORAGE = "livros";

    // Cria (uma vez) o espaço para mensagens de sucesso/erro acima do formulário
    const mensagem = document.createElement("p");
    mensagem.id = "mensagem-form";
    mensagem.setAttribute("role", "alert");
    form.insertAdjacentElement("beforebegin", mensagem);

    function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.style.color = tipo === "erro" ? "#b00020" : "#1b7f3b";
        mensagem.style.fontWeight = "bold";
    }

    // Lê a lista de livros salva (ou lista vazia)
    function obterLivros() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || [];
        } catch (e) {
            return [];
        }
    }

    function salvarLivros(livros) {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(livros));
    }

    // Valida ISBN-10 ou ISBN-13 (aceita hífens e espaços). Campo opcional.
    function isbnValido(isbn) {
        const limpo = isbn.replace(/[-\s]/g, "").toUpperCase();

        if (/^\d{13}$/.test(limpo)) {
            let soma = 0;
            for (let i = 0; i < 12; i++) {
                soma += Number(limpo[i]) * (i % 2 === 0 ? 1 : 3);
            }
            const digito = (10 - (soma % 10)) % 10;
            return digito === Number(limpo[12]);
        }

        if (/^\d{9}[\dX]$/.test(limpo)) {
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += Number(limpo[i]) * (10 - i);
            }
            const ultimo = limpo[9] === "X" ? 10 : Number(limpo[9]);
            soma += ultimo;
            return soma % 11 === 0;
        }

        return false;
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault(); // impede o envio padrão (action="#")

        const dados = new FormData(form);

        const livro = {
            id: Date.now(),
            titulo: dados.get("titulo").trim(),
            autor: dados.get("autor").trim(),
            editora: dados.get("editora").trim(),
            ano: dados.get("ano") ? Number(dados.get("ano")) : null,
            paginas: dados.get("paginas") ? Number(dados.get("paginas")) : null,
            isbn: dados.get("isbn").trim(),
            genero: dados.get("genero"),
            status: dados.get("status"),
            sinopse: dados.get("sinopse").trim(),
            cadastradoEm: new Date().toISOString()
        };

        // Validações
        if (!livro.titulo || !livro.autor) {
            mostrarMensagem("Preencha o título e o autor do livro.", "erro");
            return;
        }

        if (!livro.genero) {
            mostrarMensagem("Selecione um gênero.", "erro");
            return;
        }

        const anoAtual = new Date().getFullYear();
        if (livro.ano !== null && (livro.ano < 1000 || livro.ano > anoAtual + 1)) {
            mostrarMensagem(`Informe um ano de publicação entre 1000 e ${anoAtual + 1}.`, "erro");
            return;
        }

        if (livro.paginas !== null && livro.paginas < 1) {
            mostrarMensagem("O número de páginas deve ser maior que zero.", "erro");
            return;
        }

        if (livro.isbn && !isbnValido(livro.isbn)) {
            mostrarMensagem("ISBN inválido. Use ISBN-10 ou ISBN-13 (ex: 978-8533613379).", "erro");
            return;
        }

        // Evita duplicados (mesmo ISBN ou mesmo título + autor)
        const livros = obterLivros();
        const duplicado = livros.some((l) => {
            const mesmoIsbn = livro.isbn && l.isbn &&
                l.isbn.replace(/[-\s]/g, "") === livro.isbn.replace(/[-\s]/g, "");
            const mesmoTituloAutor =
                l.titulo.toLowerCase() === livro.titulo.toLowerCase() &&
                l.autor.toLowerCase() === livro.autor.toLowerCase();
            return mesmoIsbn || mesmoTituloAutor;
        });

        if (duplicado) {
            mostrarMensagem("Esse livro já está cadastrado.", "erro");
            return;
        }

        // Salva
        livros.push(livro);
        salvarLivros(livros);

        mostrarMensagem(`Livro "${livro.titulo}" cadastrado com sucesso!`, "sucesso");
        form.reset();
        document.getElementById("titulo").focus();
    });
});
