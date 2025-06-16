# Dashboard Metricas

Projeto para capturar dados das squads e criar um dashboard para acompanhamento da saúde e qualidade das squads.

---
## Como os dados são extraidos?
Hoje estamos utilizando o Azure Devops para gerenciamento das squads, as informações de cada squad são extraidas via a api do azure devops:

https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-6.1

É necessário usar um perssonal token para extrair os dados.

https://docs.microsoft.com/pt-br/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows

É necessário criar um arquivo .env com o token e os dados do projeto (Ex: .env.exemple)

    # Personal token
    NEXT_PUBLIC_TOKEN=""

    # https://dev.azure.com/${organization}
    NEXT_PUBLIC_ORGANIZATION=""

    # id do projeto e pode ser achado via api
    # https://dev.azure.com/{organization}/_apis/projects?api-version=7.1-preview.3
    NEXT_PUBLIC_PROJECT=""




---
## Como executar o projeto localmente?

Para executar o projeto é necessário instalar o yarn: https://yarnpkg.com/getting-started/install e executar os seguintes comandos:

- Para instalar as dependências do projeto:
  
  ``yarn install ``

- Observação: Caso retornado erro na instalação do yarn "Error: https://registry.yarnpkg.com/@mui/icons-material/-/icons-material-5.2.0.tgz: ESOCKETTIMEDOUT", basta executar o comando abaixo:

  ``yarn install --network-timeout 500000`` ou
  ``yarn add @mui/icons-material --network-timeout 500000``

- Para executar o projeto

  ``yarn dev``

---
## Tecnologias utilizadas
Utilizamos como framework de desenvolvimento o React junto com Typescript


