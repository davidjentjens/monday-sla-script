# Automação de Timers no Monday.com

Este projeto é uma aplicação Dockerizada em Node.js, desenvolvida com TypeScript, que automatiza a gestão de timers em boards do Monday.com. A aplicação visa facilitar o controle de tarefas e melhorar a eficiência do gerenciamento de tempo dentro da plataforma.
<br/><br/>

## Como Funciona

### Automação de Timers

- A aplicação é configurada para rodar continuamente em um container Docker.
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

# Passos para Execução

1. Clone o repositório para sua máquina local.
2. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:
   ```
   MONDAY_API_KEY=your_api_key
   ```
3. Substitua `your_api_key` pelo valor correspondentes da sua conta Monday.com.
4. Execute o comando `docker-compose up` para iniciar a aplicação.
5. A aplicação será executada em um container Docker e os timers serão iniciados e parados automaticamente nos horários programados.
6. Para parar a aplicação, execute `docker-compose down`.
<br/>
