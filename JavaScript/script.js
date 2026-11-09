
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

        salvarLista("livros", [
        { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, genero: "Romance",preco: 29.90, imagem: "/Image/Dom casmurro.jpg" },
        { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, genero: "Romance",preco: 24.90, imagem: "/Image/O cortiço.jpg" },
        { id: 3, titulo: "Capitães da Areia", autor: "Jorge Amado", ano: 1937, genero: "Romance",preco: 34.90, imagem: "/Image/Capitães de Areia.jpg" },
        { id: 4, titulo: "Fundação", autor: "Isaac Asimov", ano: 1951, genero: "Ficção",preco: 49.90, imagem: "/Image/A fundação.jpg" },
        { id: 5, titulo: "Duna", autor: "Frank Herbert", ano: 1965, genero: "Ficção",preco: 59.90, imagem: "/Image/Duna.jpg" },
        { id: 6, titulo: "Eu, Robô", autor: "Isaac Asimov", ano: 1950, genero: "Ficção",preco: 39.90, imagem: "/Image/Eu, robo.jpg" }])
    }
}
// puxa texto do configurar cadastro e exibe de acordo com a conficao for False ou true
function mostrarMensagem(idElemento, texto, tipo){
    const paragrafo = document.getElementById(idElemento);
    paragrafo.textContent = texto;
    paragrafo.className = tipo;
}

// ira validar o usuario e mostrar nas pages o usuairio e o botao de sair.
function atualizarMenu(){
    const emailLogado = localStorage.getItem("usuarioLogado");
    if(emailLogado === null){
        return;
    }

    const linkLogin = document.querySelector('nav a[href="/Login_Cadastro/Login/login.html"]');
    const linkCadastro = document.querySelector('nav a[href="/Login_Cadastro/Cadastro/cadastro_cliente.html"]');
    if(linkLogin === null || linkCadastro === null){
        return;
    }

    const usuarios = lerLista("usuarios");
    const usuario = usuarios.find((u) => u.email === emailLogado);
    const primeiroNome = usuario ? usuario.nome.split(" ")[0] : "usuário";

    // o link "Login" vira o nome do usuário
    linkLogin.textContent = "Olá, " + primeiroNome;
    linkLogin.href = "/Home/home.html";

    // o link "Cadastre-se" vira o botão de sair
    linkCadastro.textContent = "Sair";
    linkCadastro.href = "/Home/home.html";
    linkCadastro.addEventListener("click", function(){
        localStorage.removeItem("usuarioLogado"); // desloga o user antes de ir até a homepage
    });
}



function criarCardLivro(livro){
    const card = document.createElement("div");
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

    const detalhes = document.createElement("p");
    detalhes.textContent = livro.ano + " • " + livro.genero;

    const preco = document.createElement("p");
    preco.textContent = "R$ " + livro.preco.toFixed(2).replace(".", ",");

    const botao = document.createElement("button");
    botao.textContent = "Adicionar ao carrinho";
    botao.addEventListener("click", function(){
        adicionarAoCarrinho(livro);
    });

    card.appendChild(titulo);
    card.appendChild(autor);
    card.appendChild(detalhes);
    card.appendChild(preco);
    card.appendChild(botao);

    return card;
}

function mostrarCatalogo(){
    const container = document.getElementById("lista-livros")
    if(container === null){
        return;
    }

    const livros = lerLista("livros");
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
        localStorage.setItem("usuarioLogado", email);

        form.reset(); // reseta campos do forms, limpa eles
        mostrarMensagem("mensagem-cadastro", "Cadastro realizado! Indo para a home...", "sucesso");

        // após o login o settime espera 1,5 segundos e leva o user pra home com o nome dele no header e fins
        setTimeout(function(){
            window.location.href = "/Home/home.html";
        }, 1500);
    })
}

// faz o login: confere e-mail e senha e guarda quem entrou
function configurarLogin(){
    const form = document.getElementById("form-login");
    if(form === null){
        return;
    }

    form.addEventListener("submit", function(evento){
        evento.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;

        const usuarios = lerLista("usuarios");

        // procura alguém com esse e-mail E essa senha
        const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

        if(usuario === undefined){
            mostrarMensagem("mensagem-login", "E-mail ou senha incorretos.", "erro");
            return;
        }

        // guarda o e-mail de quem entrou (o atualizarMenu lê essa chave)
        localStorage.setItem("usuarioLogado", usuario.email);

        mostrarMensagem("mensagem-login", "Login realizado! Indo para a home...", "sucesso");

        setTimeout(function(){
            window.location.href = "/Home/home.html";
        }, 1000);
    });
}

// guarda o livro na lista "carrinho" do localStorage
function adicionarAoCarrinho(livro){
    if(localStorage.getItem("usuarioLogado") === null){
        alert("Faça login para adicionar livros ao carrinho.");
        window.location.href = "/Login_Cadastro/Login/login.html";
        return;
    }

    const carrinho = lerLista("carrinho");

    // se o livro já está no carrinho, só aumenta a quantidade
    const item = carrinho.find((i) => i.id === livro.id);
    if(item){
        item.quantidade++;
    } else {
        carrinho.push({
            id: livro.id,
            titulo: livro.titulo,
            autor: livro.autor,
            preco: livro.preco,
            quantidade: 1
        });
    }

    salvarLista("carrinho", carrinho);
    alert(livro.titulo + " foi adicionado ao carrinho!");
}

// transforma 29.9 em "R$ 29,90"
function formatarPreco(valor){
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

// cria uma célula <td> com um texto dentro
function criarCelula(texto){
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

// desenha o carrinho na tabela
function mostrarCarrinho(){
    const corpo = document.getElementById("itens");
    if(corpo === null){
        return;
    }

    if(localStorage.getItem("usuarioLogado") === null){
        alert("Faça login para ver seu carrinho.");
        window.location.href = "/Login_Cadastro/Login/login.html";
        return;
    }

    const carrinho = lerLista("carrinho");
    corpo.innerHTML = "";
    let total = 0;

    carrinho.forEach(function(item, posicao){
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const linha = document.createElement("tr");
        linha.appendChild(criarCelula(item.titulo));
        linha.appendChild(criarCelula(item.autor));
        linha.appendChild(criarCelula(formatarPreco(item.preco)));

        // campo de quantidade
        const tdQuantidade = document.createElement("td");
        const campo = document.createElement("input");
        campo.type = "number";
        campo.min = 1;
        campo.value = item.quantidade;
        campo.addEventListener("change", function(){
            const nova = parseInt(campo.value);
            if(nova >= 1){
                carrinho[posicao].quantidade = nova;
                salvarLista("carrinho", carrinho);
            }
            mostrarCarrinho();
        });
        tdQuantidade.appendChild(campo);
        linha.appendChild(tdQuantidade);

        linha.appendChild(criarCelula(formatarPreco(subtotal)));

        // botão remover
        const tdAcao = document.createElement("td");
        const botaoRemover = document.createElement("button");
        botaoRemover.className = "remover";
        botaoRemover.textContent = "Remover";
        botaoRemover.addEventListener("click", function(){
            carrinho.splice(posicao, 1);
            salvarLista("carrinho", carrinho);
            mostrarCarrinho();
        });
        tdAcao.appendChild(botaoRemover);
        linha.appendChild(tdAcao);

        corpo.appendChild(linha);
    });

    // carrinho vazio: esconde a tabela e mostra o aviso
    const tabela = document.querySelector("table");
    const vazio = document.getElementById("vazio");
    if(carrinho.length === 0){
        tabela.style.display = "none";
        vazio.style.display = "block";
    } else {
        tabela.style.display = "";
        vazio.style.display = "none";
    }

    document.getElementById("total").textContent = "Total: " + formatarPreco(total);
}

// esvazia o carrinho e agradece
function finalizarCompra(){
    const carrinho = lerLista("carrinho");
    if(carrinho.length === 0){
        alert("Seu carrinho está vazio.");
        return;
    }
    alert("Compra finalizada! Obrigado!");
    salvarLista("carrinho", []);
    mostrarCarrinho();
}

livrosIncial();
atualizarMenu();
mostrarCatalogo();
configurarCadastro();
configurarLogin();
mostrarCarrinho();