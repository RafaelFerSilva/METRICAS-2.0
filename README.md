# Dashboard Metricas

Projeto para capturar dados das squads e criar um dashboard para acompanhamento da saúde e qualidade das squads.

---
## Como os dados são extraidos?
Hoje estamos utilizando o Azure Devops para gerenciamento das squads, as informações de cada squad são extraidas via a api do azure devops:

https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-6.1

É necessário usar um perssonal token para extrair os dados.

https://docs.microsoft.com/pt-br/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows

É necessário saber o Organization do projeto para realizar o login. Normalmente encontramos o Organization na url quando estamos navegando no azure devops. Exemplo: https://dev.azure.com/Orbia/Engineering que o Organization é "Orbia".


---
## Como executar o projeto localmente?

Para executar o projeto utilizamos o pnpm, para instalar o pnpm basta executar o comando abaixo:

``npm install -g pnpm``

Para instalar as dependências do projeto:

``pnpm install``

Para executar o projeto:

``pnpm dev``

---
## Tecnologias utilizadas
Utilizamos como framework de desenvolvimento o React junto com Typescript


