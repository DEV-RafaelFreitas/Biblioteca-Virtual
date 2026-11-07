
//vai ler a lista 
function lerLista(chave){
    const texto = localStorage.getItem(chave);
    if(texto === null){
        return[];
    }
    return JSON.parse(texto);
}

// vai salvar a lista no local storage passando para string
function salvarLista(chave, lista){
    localStorage.setItem(chave,JSON.stringify(lista));
}

// refletir os livros que paracerem na hoje
function livrosIncial(){
    if(localStorage.getItem("livros") === null){

        salvarLista("livros", [{ id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, genero: "Romance", imagem: "img/dom-casmurro.jpg" },
        { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, genero: "Romance", imagem: "img/o-cortico.jpg" },
        { id: 3, titulo: "Capitães da Areia", autor: "Jorge Amado", ano: 1937, genero: "Romance", imagem: "img/capitaes-da-areia.jpg" },
        { id: 4, titulo: "Fundação", autor: "Isaac Asimov", ano: 1951, genero: "Ficção", imagem: "img/fundacao.jpg" },
        { id: 5, titulo: "Duna", autor: "Frank Herbert", ano: 1965, genero: "Ficção", imagem: "img/duna.jpg" },
        { id: 6, titulo: "Eu, Robô", autor: "Isaac Asimov", ano: 1950, genero: "Ficção", imagem: "img/eu-robo.jpg" }])
    }
}
// puxa texto do configurar cadastro e exibe de acordo com a conficao for False ou true
function mostrarMensagem(idElemento, texto, tipo){
    const paragrafo = document.getElementById(idElemento);
    paragrafo.textContent = texto;
    paragrafo.className = tipo;
}

// ira validar o usuario e mostrar nas pages o usuairio e o botao de out.
function atualizarMenu(){
    const emailLogado = localStorage.getItem("usuarioLogado");
    if(emailLogado === null){
        return;
    }
    const linkLogin = document.querySelector('nav a[href="/Login_Cadastro/Login/login.html"]')
    if(linkLogin === null){
    return
    }
    
    // percorrer a lista e comparar com o user logado
    const usuarios = lerlista("usuarios");
    const usuario = usuarios.find((u) => u.email === emailLogado);
    const primeiroNome = usuario ? usuario.nome.split("u")[0] : "usuário";

    linkLogin.textContent = "Sair (" + primeiroNome + ")";
    linkLogin.href = "/Home/home.html";
    linkLogin.addEventListener("click", function (){
        localStorage.removeItem("usuarioLogado"); // desloga o user antes de ir até a homepage
    });
}



function criarCardLivro(livro){
    const card = document.createElement("img");
    card.className = "livro";

    if(livro.imagem){
        const imagem = document.createElement("img");
        imagem.src = livro.imagem;
        imagem.alt = "Capa do livro" + livro.titulo;
        imagem.addEventListener("error", function(){
            imagem.remove();
        });
        card.appendChild(imagem);
    }

    const titulo = document.createElement ("h3");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("p");
    autor.textContent = livro.autor;

    const detalhes = document.createElement ("p");
    detalhes.textContent = livro.detalhes;

    card.appendChild(titulo);
    card.appendChild(autor);
    card.appendChild(detalhes);

    return card;
}

function mostrarCatalogo(){
    const container = document.getElementById("lista-livros")
    if(container === null){
        return;
    }

    const livros = lerlista("livros");
    container.innerHTML = ""; // limpa conteudo old

    if(livros.length === 0){
        const aviso = document.createElement("p");
        aviso.textContent = "Nenhum livro cadastrado ainda.";
        container.appendChild(aviso);
        return;
    }

    livros.forEach(function (livro) {
    container.appendChild(criarCardLivro(livro));
    });
}

// cadastro de cliente , pega as infos e guarda

function configurarCadastro(){
    const form = document.getElementById("form-cadastro");
    if(form == null){
        return;
    }

    form.addEventListener("submit", function(evento){
        evento.preventDefault();

        // cria as variaveis que sera preenchida e posteriormente guardada na lista no LocalStorage
        const senha = document.getElementById("cad-senha").value;
        const confirmar = document.getElementById("cad-confirmar-senha").value;
        const cpf = document.getElementById("cad-cpf").value.replace(/\D/g, "");
        const email = document.getElementById("cad-email").value.trim().toLowerCase();
        const nascimento = document.getElementById("cad-nascimento").value;

        // verifica se a senha é a mesma do confirmar senha nos campos de criar a senha nova 
        if(senha !== confirmar){
            mostrarMensagem("mensagem-cadastro", "As senhas não são iguais.", "erro");
            return;
        }

        // valida quantidade de caracteres do cpf limitando a 11 
        if(cpf.length !== 11){
            mostrarMensagem("mensagem-cadastro", "O CPF deve ter 11 números.", "erro");
            return;
        }

        const usuarios = lerLista("usuarios");

        // percorre a lista e verifica  o e-mail ja existe 
        if(usuarios.some((u) => u.email === email)){
            mostrarMensagem("mensagem-cadastro", "Este e-mail já está cadastrado.", "erro");
            return;
        }

        // guarda os dados dos campos que o user esta preenchendo
        usuarios.push({
                nome: document.getElementById("cad-nome").value.trim(),
                cpf: cpf,
                nascimento: nascimento,
                genero: document.getElementById("cad-genero").value,
                email: email,
                telefone: document.getElementById("cad-telefone").value.trim(),
                cep: document.getElementById("cad-cep").value.trim(),
                estado: document.getElementById("cad-estado").value,
                rua: document.getElementById("cad-rua").value.trim(),
                numero: document.getElementById("cad-numero").value.trim(),
                complemento: document.getElementById("cad-complemento").value.trim(),
                bairro: document.getElementById("cad-bairro").value.trim(),
                cidade: document.getElementById("cad-cidade").value.trim(),
                senha: senha
        });

        // salve a lista de users com o user novo na lista no Local Storage
        salvarLista("usuarios", usuarios);

        form.reset(); // reseta campos do forms, limpa eles
        mostrarMensagem("mensagem-cadastro", "Cadastro realizado! Indo para o login...", "sucesso");

        // após o login o settime espera 1,5 segundos e leva o user pra home com o nome dele no header e fins
        setTimeout(function(){
            window.location.href = "/Home/home.html";
        }, 1500);
    })
}







