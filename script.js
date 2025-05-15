
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    inicializarBotoesExpandir();
    inicializarFormulario();
    inicializarAlerta();
    inicializarModalDenuncia();
    inicializarMapaInterativo();
    inicializarMascarasCampos();
    inicializarFiltrosInterativos();
});

let map;

navigator.geolocation.getCurrentPosition(function(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    map = L.map('mapa').setView([userLat, userLng], 13);

    // Camada base do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marcador de localização do usuário
    L.marker([userLat, userLng])
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();

    // Pontos de coleta (dados simulados)
    const pontosDeColeta = [
        { nome: "Ecoponto Avenida dos Holandeses", lat: -2.490109, lng: -44.227874 },
        { nome: "Ecoponto Cidade Operária", lat: -2.596097, lng: -44.197332 },
        { nome: "Ecoponto Jardim Renascença", lat: -2.494993, lng: -44.286625},
        { nome: "Ecoponto Bairro de Fátima", lat: -2.550231, lng: -2.550231},
        { nome: "Ecoponto Recanto do Vinhais", lat: 2.520941, lng: -44.260126},
        { nome: "Ecoponto do Anil", lat: -2.551214, lng: -44.236039},
        { nome: "Ecoponto Angelim", lat: -2.531015, lng: -44.233776},
        { nome: "Ecoponto Turu", lat: -2.506294, lng: -44.224204},
        { nome: "Ecoponto Cohaserma II", lat: -2.507116, lng: -44.248519},
        { nome: "Ecoponto São Cristóvão", lat: -2.573325, lng: -44.225337},
        { nome: "Ecoponto São Francisco", lat: -2.517457, lng: -44.299884},
        { nome: "Ecoponto Primavera", lat: -2.539225, lng: -44.196936},
        { nome: "Ecoponto parque dos nobres", lat: -2.558447, lng: -44.275624},
        { nome: "Ecoponto Bequimão", lat: -2.528376, lng: -44.248244},
        { nome: "Ecoponto Cohab Anil", lat: -2.534371, lng: -44.212658},
        { nome: "Ecoponto Itapiracó", lat: -2.534371, lng: -44.212658},
        { nome: "Ecoponto Itapiracó", lat: -2.534371, lng: -44.212658},

    ];

    pontosDeColeta.forEach(ponto => {
        L.marker([ponto.lat, ponto.lng])
            .addTo(map)
            .bindPopup(ponto.nome);
    });

}, function(error) {
    alert("Não foi possível obter sua localização.");
});

function inicializarBotoesExpandir() {
    const botoesExpandir = document.querySelectorAll('.servico__botao-expandir');
    
    botoesExpandir.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const descricao = botao.nextElementSibling;
            const icone = botao.querySelector('i');
            
            // Alternar visibilidade da descrição
            descricao.classList.toggle('escondido');
            
            // Alternar classe ativo no botão
            botao.classList.toggle('ativo');
            
            // Atualizar o texto do botão
            if (botao.classList.contains('ativo')) {
                botao.innerHTML = `Menos informações <i class="fas fa-chevron-up"></i>`;
            } else {
                botao.innerHTML = `Mais informações <i class="fas fa-chevron-down"></i>`;
            }
        });
    });
}

/**
 * Inicializa a validação e manipulação do formulário
 */
function inicializarFormulario() {
    const formularioAgendamento = document.getElementById('formularioAgendamento');
    
    if (formularioAgendamento) {
        formularioAgendamento.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validarFormulario(formularioAgendamento)) {
                // Simulação de envio
                const botaoSubmit = formularioAgendamento.querySelector('button[type="submit"]');
                const textoOriginal = botaoSubmit.innerHTML;
                
                botaoSubmit.disabled = true;
                botaoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                
                // Simula o tempo de processamento
                setTimeout(() => {
                    // Feedback visual de sucesso
                    mostrarNotificacao('Agendamento realizado com sucesso! Em breve entraremos em contato.', 'sucesso');
                    
                    // Resetar o formulário
                    formularioAgendamento.reset();
                    
                    // Restaurar o botão
                    botaoSubmit.disabled = false;
                    botaoSubmit.innerHTML = textoOriginal;
                }, 1500);
            }
        });
    }
    
    // Formulário de denúncia
    const formularioDenuncia = document.getElementById('formularioDenuncia');
    
    if (formularioDenuncia) {
        formularioDenuncia.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validarFormulario(formularioDenuncia)) {
                // Simulação de envio
                const botaoSubmit = formularioDenuncia.querySelector('button[type="submit"]');
                const textoOriginal = botaoSubmit.innerHTML;
                
                botaoSubmit.disabled = true;
                botaoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                
                // Simula o tempo de processamento
                setTimeout(() => {
                    // Feedback visual de sucesso
                    mostrarNotificacao('Denúncia enviada com sucesso! Obrigado por contribuir.', 'sucesso');
                    
                    // Fechar o modal
                    const modal = document.getElementById('modalDenuncia');
                    modal.classList.remove('ativo');
                    
                    // Resetar o formulário
                    formularioDenuncia.reset();
                    
                    // Restaurar o botão
                    botaoSubmit.disabled = false;
                    botaoSubmit.innerHTML = textoOriginal;
                }, 1500);
            }
        });
    }
}

/**
 * Valida um formulário
 * @param {HTMLFormElement} formulario - O formulário a ser validado
 * @returns {boolean} - Retorna true se o formulário for válido, false caso contrário
 */
function validarFormulario(formulario) {
    let formularioValido = true;
    const camposRequeridos = formulario.querySelectorAll('[required]');
    
    // Reseta erros anteriores
    formulario.querySelectorAll('.formulario__erro').forEach(erro => {
        erro.style.display = 'none';
    });
    
    formulario.querySelectorAll('.invalido').forEach(campo => {
        campo.classList.remove('invalido');
    });
    
    // Verifica cada campo obrigatório
    camposRequeridos.forEach(campo => {
        const tipoInput = campo.getAttribute('type');
        let mensagemErro = '';
        
        // Verificação específica por tipo de campo
        if (!campo.value.trim()) {
            mensagemErro = 'Este campo é obrigatório';
        } else if (tipoInput === 'email' && !validarEmail(campo.value)) {
            mensagemErro = 'Por favor, insira um email válido';
        } else if (tipoInput === 'tel' && !validarTelefone(campo.value)) {
            mensagemErro = 'Por favor, insira um telefone válido';
        } else if (campo.id === 'cep' && !validarCEP(campo.value)) {
            mensagemErro = 'Por favor, insira um CEP válido';
        }
        
        // Para tipos radio, verificar se algum está selecionado
        if (tipoInput === 'radio') {
            const nome = campo.getAttribute('name');
            const grupoRadio = formulario.querySelectorAll(`input[name="${nome}"]`);
            const alguemSelecionado = Array.from(grupoRadio).some(radio => radio.checked);
            
            if (!alguemSelecionado) {
                const mensagemErroRadio = formulario.querySelector(`[name="${nome}"]`).closest('.formulario__grupo').querySelector('.formulario__erro');
                mensagemErroRadio.textContent = 'Por favor, selecione uma opção';
                mensagemErroRadio.style.display = 'block';
                formularioValido = false;
            }
            
            // Processa apenas o primeiro do grupo
            if (campo !== grupoRadio[0]) return;
        }
        
        // Exibe mensagem de erro se houver
        if (mensagemErro) {
            formularioValido = false;
            campo.classList.add('invalido');
            
            // Exibir mensagem de erro
            const elementoErro = campo.nextElementSibling;
            if (elementoErro && elementoErro.classList.contains('formulario__erro')) {
                elementoErro.textContent = mensagemErro;
                elementoErro.style.display = 'block';
            }
        }
    });
    
    return formularioValido;
}

/**
 * Valida endereço de email
 * @param {string} email - O email a ser validado
 * @returns {boolean} - Retorna true se o email for válido, false caso contrário
 */
function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

/**
 * Valida número de telefone
 * @param {string} telefone - O telefone a ser validado
 * @returns {boolean} - Retorna true se o telefone for válido, false caso contrário
 */
function validarTelefone(telefone) {
    // Remove caracteres não numéricos
    const telNumerico = telefone.replace(/\D/g, '');
    
    // Verifica se o telefone tem pelo menos 10 dígitos (DDD + número)
    return telNumerico.length >= 10 && telNumerico.length <= 11;
}

/**
 * Valida CEP
 * @param {string} cep - O CEP a ser validado
 * @returns {boolean} - Retorna true se o CEP for válido, false caso contrário
 */
function validarCEP(cep) {
    // Remove caracteres não numéricos
    const cepNumerico = cep.replace(/\D/g, '');
    
    // Verifica se o CEP tem 8 dígitos
    return cepNumerico.length === 8;
}

/**
 * Inicializa o sistema de alerta/notificações
 */
function inicializarAlerta() {
    // Criar o container de notificações se não existir
    if (!document.getElementById('notificacoes')) {
        const notificacoesContainer = document.createElement('div');
        notificacoesContainer.id = 'notificacoes';
        notificacoesContainer.className = 'notificacoes';
        document.body.appendChild(notificacoesContainer);
    }
}

/**
 * Mostra uma notificação na tela
 * @param {string} mensagem - A mensagem a ser exibida
 * @param {string} tipo - O tipo de notificação (sucesso, erro, alerta)
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacoesContainer = document.getElementById('notificacoes');
    
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao--${tipo}`;
    
    // Ícone baseado no tipo
    let icone = 'info-circle';
    if (tipo === 'sucesso') icone = 'check-circle';
    if (tipo === 'erro') icone = 'exclamation-circle';
    if (tipo === 'alerta') icone = 'exclamation-triangle';
    
    notificacao.innerHTML = `
        <i class="fas fa-${icone}"></i>
        <p>${mensagem}</p>
        <button class="notificacao__fechar"><i class="fas fa-times"></i></button>
    `;
    
    // Adicionar ao container
    notificacoesContainer.appendChild(notificacao);
    
    // Adicionar evento para fechar notificação
    const botaoFechar = notificacao.querySelector('.notificacao__fechar');
    botaoFechar.addEventListener('click', () => {
        notificacao.classList.add('fechando');
        setTimeout(() => {
            notificacoesContainer.removeChild(notificacao);
        }, 300); // Tempo da animação de saída
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (notificacoesContainer.contains(notificacao)) {
            notificacao.classList.add('fechando');
            setTimeout(() => {
                if (notificacoesContainer.contains(notificacao)) {
                    notificacoesContainer.removeChild(notificacao);
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Inicializa o modal de denúncia
 */
function inicializarModalDenuncia() {
    const botoesDenuncia = document.querySelectorAll('[data-modal="abrir"]');
    const botoesFechar = document.querySelectorAll('[data-modal="fechar"]');
    const overlay = document.querySelector('.modal__overlay');
    
    // Abrir modal
    botoesDenuncia.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = botao.getAttribute('data-alvo');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('ativo');
                document.body.style.overflow = 'hidden'; // Previne scroll no body
            }
        });
    });
    
    // Fechar modal
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', () => {
            const modal = botao.closest('.modal');
            
            if (modal) {
                modal.classList.remove('ativo');
                document.body.style.overflow = ''; // Restaura o scroll
            }
        });
    });
    
    // Fechar ao clicar no overlay
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                const modal = overlay.closest('.modal');
                
                if (modal) {
                    modal.classList.remove('ativo');
                    document.body.style.overflow = ''; // Restaura o scroll
                }
            }
        });
    }
    
    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modalAtivo = document.querySelector('.modal.ativo');
            
            if (modalAtivo) {
                modalAtivo.classList.remove('ativo');
                document.body.style.overflow = ''; // Restaura o scroll
            }
        }
    });
}

/**
 * Inicializa o mapa interativo com pontos de coleta
 */
function inicializarMapaInterativo() {
    const containerMapa = document.getElementById('mapaColeta');
    
    if (containerMapa && window.L) { // Verificar se o Leaflet está carregado
        // Inicializar o mapa
        const mapa = L.map('mapaColeta').setView([-23.5505, -46.6333], 12); // São Paulo como exemplo
        
        // Adicionar tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);
        
        // Exemplo de pontos de coleta (em um caso real, viriam de uma API)
        const pontosColeta = [
            { nome: 'Ponto de Coleta - Centro', lat: -23.5505, lng: -46.6333, tipo: 'reciclaveis' },
            { nome: 'Ponto de Coleta - Norte', lat: -23.5105, lng: -46.6433, tipo: 'eletronicos' },
            { nome: 'Ponto de Coleta - Leste', lat: -23.5605, lng: -46.6133, tipo: 'organicos' }
        ];
        
        // Adicionar marcadores ao mapa
        pontosColeta.forEach(ponto => {
            // Configurar ícone baseado no tipo
            let iconeClasse = 'fa-recycle'; // Padrão
            if (ponto.tipo === 'eletronicos') iconeClasse = 'fa-laptop';
            if (ponto.tipo === 'organicos') iconeClasse = 'fa-leaf';
            
            // Criar HTML do ícone
            const iconeHtml = `<div class="mapa__marcador mapa__marcador--${ponto.tipo}">
                <i class="fas ${iconeClasse}"></i>
            </div>`;
            
            // Criar ícone personalizado
            const icone = L.divIcon({
                html: iconeHtml,
                className: 'mapa__marcador-container',
                iconSize: [30, 30]
            });
            
            // Adicionar marcador
            const marcador = L.marker([ponto.lat, ponto.lng], { icon: icone }).addTo(mapa);
            
            // Adicionar popup
            marcador.bindPopup(`
                <div class="mapa__popup">
                    <h3>${ponto.nome}</h3>
                    <p>Tipo: ${ponto.tipo.charAt(0).toUpperCase() + ponto.tipo.slice(1)}</p>
                    <button class="botao botao--pequeno botao--primario" onclick="abrirDetalhes('${ponto.nome}')">
                        Ver detalhes
                    </button>
                </div>
            `);
        });
        
        // Atualizar mapa quando a janela for redimensionada
        window.addEventListener('resize', () => {
            mapa.invalidateSize();
        });
    }
}

/**
 * Função para abrir detalhes de um ponto de coleta
 * @param {string} nomePonto - O nome do ponto de coleta
 */
function abrirDetalhes(nomePonto) {
    // Em uma implementação real, isso abriria um modal ou redirecionaria
    // para uma página de detalhes do ponto específico
    mostrarNotificacao(`Detalhes do ponto: ${nomePonto}`, 'info');
}

/**
 * Inicializa máscaras para campos do formulário
 */
function inicializarMascarasCampos() {
    // Aplicar máscaras aos campos
    const camposTelefone = document.querySelectorAll('input[type="tel"]');
    const camposCEP = document.querySelectorAll('#cep');
    
    // Máscara para telefone
    camposTelefone.forEach(campo => {
        campo.addEventListener('input', (e) => {
            let telefone = e.target.value.replace(/\D/g, '');
            
            if (telefone.length > 0) {
                // Formatar como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
                
                if (telefone.length > 13) {
                    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
                } else {
                    telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
                }
            }
            
            e.target.value = telefone;
        });
    });
    
    // Máscara para CEP
    camposCEP.forEach(campo => {
        campo.addEventListener('input', (e) => {
            let cep = e.target.value.replace(/\D/g, '');
            
            if (cep.length > 0) {
                // Formatar como XXXXX-XXX
                cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = cep;
            
            // Auto-completar endereço se o CEP estiver completo
            if (cep.length === 9) {
                buscarEnderecoPorCEP(cep.replace('-', ''));
            }
        });
    });
}

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 * @param {string} cep - O CEP a ser consultado
 */
function buscarEnderecoPorCEP(cep) {
    if (cep.length !== 8) return;
    
    // Mostrar feedback visual de carregamento
    const campoCEP = document.getElementById('cep');
    if (campoCEP) {
        campoCEP.classList.add('carregando');
    }
    
    // Fazer a consulta na API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                // Preencher os campos do formulário
                const campoRua = document.getElementById('rua');
                const campoBairro = document.getElementById('bairro');
                const campoCidade = document.getElementById('cidade');
                const campoEstado = document.getElementById('estado');
                
                if (campoRua) campoRua.value = data.logradouro;
                if (campoBairro) campoBairro.value = data.bairro;
                if (campoCidade) campoCidade.value = data.localidade;
                if (campoEstado) campoEstado.value = data.uf;
            } else {
                mostrarNotificacao('CEP não encontrado', 'erro');
            }
        })
        .catch(erro => {
            mostrarNotificacao('Erro ao buscar CEP', 'erro');
            console.error('Erro na consulta de CEP:', erro);
        })
        .finally(() => {
            // Remover feedback visual de carregamento
            if (campoCEP) {
                campoCEP.classList.remove('carregando');
            }
        });
}

/**
 * Inicializa filtros interativos para listas de serviços ou materiais
 */
function inicializarFiltrosInterativos() {
    const campoFiltro = document.getElementById('filtroMateriais');
    
    if (campoFiltro) {
        campoFiltro.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            const itens = document.querySelectorAll('.material__item, .servico__item');
            
            // Filtrar itens
            itens.forEach(item => {
                const texto = item.textContent.toLowerCase();
                const match = texto.includes(termo);
                
                item.style.display = match ? '' : 'none';
            });
            
            // Mostrar mensagem se nenhum resultado
            const containerResultados = document.querySelector('.materiais__lista, .servicos__lista');
            const mensagemVazia = document.querySelector('.mensagem-vazia');
            
            if (containerResultados) {
                const itensVisiveis = containerResultados.querySelectorAll('.material__item:not([style*="display: none"]), .servico__item:not([style*="display: none"])');
                
                if (itensVisiveis.length === 0) {
                    // Criar mensagem se não existir
                    if (!mensagemVazia) {
                        const mensagem = document.createElement('p');
                        mensagem.className = 'mensagem-vazia';
                        mensagem.textContent = 'Nenhum resultado encontrado para sua busca.';
                        containerResultados.appendChild(mensagem);
                    } else {
                        mensagemVazia.style.display = 'block';
                    }
                } else if (mensagemVazia) {
                    mensagemVazia.style.display = 'none';
                }
            }
        });
    }
    
    // Filtros por categoria
    const botoesFiltro = document.querySelectorAll('[data-filtro]');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover classe ativo de todos os botões
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            
            // Adicionar classe ativo ao botão clicado
            botao.classList.add('ativo');
            
            const filtro = botao.getAttribute('data-filtro');
            const itens = document.querySelectorAll('.material__item, .servico__item');
            
            // Filtrar itens
            itens.forEach(item => {
                if (filtro === 'todos') {
                    item.style.display = '';
                } else {
                    const categorias = item.getAttribute('data-categorias');
                    
                    if (categorias && categorias.includes(filtro)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}