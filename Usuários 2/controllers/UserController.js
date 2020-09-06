class UserController { //Aplicando MVC(model view controler)o controler coordena o os dados e o view


    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit();
        this.onEditCancel()

    }

    //---------------------------------------------- BOTÃO CANCELAR -------------------------------------------

    onEditCancel() {
        document.querySelector("#box-user-update .btn-default").addEventListener("click", e => {

            document.querySelector('#box-user-create').style.display = "block"
            document.querySelector('#box-user-update').style.display = "none"

        });
    }

    //---------------------------------------------- BOTÃO SALVAR ---------------------------------------------

    onSubmit() {

        this.formEl.addEventListener("submit", (event) => { // Habilitando o botão salvar. 
            // Precisamos da 'arrow function', pois uma 'function' simples ia dar confusão ao usar o this na linha 21. Video:G21 Minuto: 13:30

            event.preventDefault(); //Cancelando o comportamento padrão de atualizar a página, ja que se trata de um "submit"

            this.formEl.querySelector("[type=submit]").disable = true; // Para desativar o botão para o usuário não clicar várias vezes

            var values = this.getValues();

            if (!values) return false; // Caso values for falso, já retorna falso 

            this.getPhoto().then( // Usando o PROMISSE (Caso de certo, faz isso, caso errado faz isso)
                (content) => {

                    values.photo = content

                    this.addLine(values);

                    this.formEl.reset(); // Limpar o formulário
                    this.formEl.querySelector('[type=submit]').disable = false; // Ativando o botão
                },
                function () {
                    console.error()
                }
            );
        });
    }

    //---------------------------------------------- LEITOR DE FOTOS -------------------------------------------

    getPhoto() {

        return new Promise((resolve, reject) => { // Classe para a promise
            var fileReader = new FileReader(); // Classe padrão da API file

            let elements = [...this.formEl.elements].filter(item => { // Pegando só o campo foto

                return item.name === 'photo' ? item : ''

            });

            var file = (elements[0].files[0]);


            fileReader.onload = () => { // Depois que carregar a foto, manda a informação lá para o submit

                resolve(fileReader.result); // Conteúdo do arquivo ta nesse '.result'

            };

            fileReader.onerror = (e) => {

                reject(e);
            }

            if (file) {
                fileReader.readAsDataURL(file); // Método que converte a imagem de binário para URL
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    }

    //---------------------------------------------- PEGANDO DADOS E FORMANDO O OBJETO -------------------------------------------
    getValues() {

        let user = {};
        let isValid = true;
        // Pegando dados do formulário e aplicando no JSON (Criando um blodo de dados para outras aplicações)
        // formEl contem todos os dados do ID, O 'elemets', contem os dados que importam
        // [...this.formEl.elements].forEach------ O colchetes serve para transformar os dados em um Array, sem isso, o ForEach não funcionaria
        // SPREAD (...) foi usado para dizer a máquina que é um array e ele deve bustar todos os elementos, e EU nao precisar informar a quantidade de elementos nesse array, tornando assim o código mais profissional
        [...this.formEl.elements].forEach(function (field) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) { // Caso um dos campos estejam vazios, da mensagem de erro e torne o formulário inválido

                field.parentElement.classList.add('has-error');
                isValid = false

            }
            if (field.name == "gender") { // Para me dar só o campo marcadao (masculino ou feminino)
                if (field.checked)
                    user.gender = field
            } else if (field.name == "admin") {
                user.admin = field.checked
            }
            else {
                user[field.name] = field.value
            };
        });

        if (!isValid) {

            return false
        }
        return new User(// Orientado a objetos, isso permite mandar esse bloco de informações para a ser interpretado na classe User 
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    //---------------------------------------------- ACRESCENTANDO USUÁRIO NA LISTA -------------------------------------------

    addLine(dataUser) {

        //Pega o ID e adiciona essa string em HTML
        let tr = document.createElement('tr')

        //JSON.stringify() serve para guardar todos os dados em string sem perder as informações e o dataset guarda para usar depois (isso vai ajudar no updateCount)
        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = ` 
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin) == true ? 'Sim' : 'Não'}</td>
        <td>${Utils.dateFormat(dataUser.register)}</td>
        <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>`

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            console.log(JSON.parse(tr.dataset.user));
            document.querySelector('#box-user-create').style.display = "none"
            document.querySelector('#box-user-update').style.display = "block"
        });


        this.tableEl.appendChild(tr) // AppendChild para criar novas linhas

        this.updateCount(); // Conta quantas linhas existem
    }

    //---------------------------------------------- CONTANDO QUANTOS USUÁRIOS TEM NA LISTA -------------------------------------------

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => { // Vai dentro da tabela e conta quantas linhas tem 

            numberUsers++;

            let user = JSON.parse(tr.dataset.user); // Passa a String com os dados do usuário de volta para objeto

            if (user._admin) {
                numberAdmin++;
            }

        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }
}