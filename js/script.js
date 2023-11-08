class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {

        if (localStorage.getItem('id') === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        return parseInt(localStorage.getItem('id')) + 1
    }

    gravar(d) {
        const id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        const id = localStorage.getItem('id')
        const despesas = Array()

        //Recuperar todoas as despesas cadastradas em localStrorage
        for (let i = 1; i <= id; i++) {
            const despesa = JSON.parse(localStorage.getItem(i))

            //* Existe a possibilidade de haver ídicices
            //  que forma pulados/removidos
            //  nesse caso vamos pular esses índices
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano 
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
            // console.log(!despesa.ano == despesa.ano);
        }
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function exibirMensagem(titulo, mensagem, classe) {
    const modalTitulo = document.getElementById('modal_titulo');
    const divModalTitulo = document.getElementById('div_modal_titulo');
    const modalConteudo = document.getElementById('modal-conteudo');
    const modalBtn = document.getElementById('modal-btn');

    modalTitulo.innerHTML = titulo;
    divModalTitulo.className = `modal-header ${classe}`;
    modalConteudo.innerHTML = mensagem;
    modalBtn.innerHTML = 'Voltar';
    modalBtn.className = `btn ${classe === 'text-success' ? 'btn-success' : 'btn-danger'}`;

    $('#modalRegistraDespesa').modal('show');
}

function cadastrarDespesa() {
    const campos = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor'];
    const valores = campos.map(campo => document.getElementById(campo).value);
    const despesa = new Despesa(...valores);

    if (despesa.validarDados()) {
        bd.gravar(despesa);
        exibirMensagem('Registro inserido com sucesso', 'Despesa foi cadastrada com sucesso!', 'text-success');
        campos.forEach(campo => (document.getElementById(campo).value = ''));
    } else {
        exibirMensagem('Erro na Gravação', 'Existem campos obrigatórios que não foram preenchidos', 'text-danger');
    }
}

function carregaListadespesas(despesas = [], filtro = false) {
    //Selecionando o elemento tbady da tebela
    const listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //Só será exibido todas as despesas se:
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }

    //Pecorrer o array, listando cada despesa de forma dinâmica
    despesas.forEach(function (d) {
        //Criando a linha (tr)
        const linha = listaDespesas.insertRow()

        //Criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        // ajustar o tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break;
            case '2': d.tipo = 'Educação'

                break;
            case '3': d.tipo = 'Lazer'

                break;
            case '4': d.tipo = 'Saúde'

                break;
            case '5': d.tipo = 'Transporte'

                break;
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //Criar botão editar
        const btnEditar = document.createElement('button')
        btnEditar.className = 'btn btn-primary btn-acao'
        btnEditar.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        btnEditar.id = `btn_editar_${d.id}`
        btnEditar.onclick = function () {
            const id = this.id.replace(/\D/g, '')
            editarDespesa(id)

            const btnSalvar = document.getElementById('save')
            const btnCancel = document.getElementById('cancel')
            const btnSearch = document.getElementById('search')
            //Remover a class hide
            btnSalvar.classList.remove('hide')
            btnCancel.classList.remove('hide')
            btnSearch.classList.add('hide')
            const headerMsg = document.getElementById('headerMsg')
            headerMsg.innerHTML = `Editando a Despesa » id ${id}`
        }

        //Criar o botão de exclusão 
        const btnRemover = document.createElement('button')
        btnRemover.className = 'btn btn-danger btn-acao'
        btnRemover.innerHTML = '<i class="fas fa-times"></i>'
        btnRemover.id = `id_despesa_${d.id}`
        btnRemover.onclick = function () {
            //Remover a despesa 
            const id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            //Atualizar a página 
            window.location.reload()
        }

        const colunaAcao = linha.insertCell(4)
        colunaAcao.className = 'd-flex justify-content-around align-items-center flex-wrap'
        colunaAcao.append(btnEditar, btnRemover)
    });
}

function cancelarEdicao() {
    const campos = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor'];
    //Limpando os campos do formulário
    campos.forEach(campo => (document.getElementById(campo).value = ''));

    const btnSalvar = document.getElementById('save')
    const btnCancel = document.getElementById('cancel')
    const btnSearch = document.getElementById('search')

    btnSalvar.classList.add('hide')
    btnCancel.classList.add('hide')
    btnSearch.classList.remove('hide')

    const headerMsg = document.getElementById('headerMsg')
    headerMsg.innerHTML = `Consulta de despesas`
}

function pesquisarDespesa() {
    const campos = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor'];
    const valores = campos.map(campo => document.getElementById(campo).value);
    const despesa = new Despesa(...valores);
    const despesas = bd.pesquisar(despesa);
    carregaListaDespesas(despesas, true);
}

function editarDespesa(id) {
    //Despesa encontrada atrvés do ID em localStorage para
    //submetermos a edição dos dados
    const despesa = JSON.parse(localStorage.getItem(id));

    const campos = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor'];
    //Preenchimento dos campos do formulário com os valores da despesa.
    campos.forEach((campo, index) => (document.getElementById(campo).value = despesa[campo]));

    //Definição de ID para os dados editados
    //(aplicando variável global). ex:
    window.despesaEditandoId = id;
}

function salvarEdicaoDespesa() {
    const campos = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor'];
    const valores = campos.map(campo => document.getElementById(campo).value);
    const despesa = new Despesa(...valores);

    if (despesa.validarDados()) {
        //Atualização da despesa em localStorage usando o ID da despesa em edição.
        localStorage.setItem(window.despesaEditandoId, JSON.stringify(despesa));

        exibirMensagem('Registro atualizado com sucesso', 'Sua alteração foi concluída!', 'text-success');

        document.getElementById('search').innerHTML = '<i class="fas fa-search"></i>';
        document.getElementById('search').onclick = pesquisarDespesa;

        carregaListadespesas();

    } else {
        exibirMensagem('Erro na Atualização dos Dados', 'Existem campos obrigatórios que não foram preenchidos', 'text-danger');
    }
}