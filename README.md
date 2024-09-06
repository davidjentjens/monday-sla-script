# Automação de Timers no Monday.com

Este projeto é uma aplicação Dockerizada em Node.js, desenvolvida com TypeScript, que automatiza a gestão de timers em boards do Monday.com. A aplicação visa facilitar o controle de tarefas e melhorar a eficiência do gerenciamento de tempo dentro da plataforma Monday.com.
<br/><br/>

## Como Funciona

### Automação de Timers

- A aplicação é configurada para rodar continuamente em um contêiner Docker.
- Utiliza a biblioteca `node-cron` para agendar tarefas que ocorrem em horários específicos durante a semana (de segunda a sexta-feira).

### Início dos Timers

- Todos os dias úteis, às 9h da manhã, a aplicação envia uma solicitação à API do Monday.com.
- A solicitação busca todos os itens em um board específico que possuem o tipo de SLA "Horas Comerciais".
- Para esses itens, a aplicação inicia timers ajustando a coluna correspondente a "Iniciar Timer".

### Parada dos Timers

- Todos os dias úteis, às 17h, a aplicação envia outra solicitação à API.
- A solicitação busca novamente itens com o tipo de SLA "Horas Comerciais".
- Desta vez, a aplicação atualiza a coluna de status (`status__1`) dos itens para um status que indica que o timer deve ser considerado como "Parado". Este status pode ser um valor pré-definido no board, como "Concluído" ou qualquer outro apropriado para seu fluxo de trabalho.
<br/>

## Configuração e Execução

- A aplicação é empacotada em uma imagem Docker, permitindo fácil execução e implantação em diferentes ambientes.
- O `Dockerfile` define a configuração do ambiente, incluindo a instalação das dependências e a execução do script.
- O `docker-compose.yml` gerencia a configuração dos serviços, incluindo a configuração das portas e o carregamento de variáveis de ambiente a partir de um arquivo `.env`.
<br/>

