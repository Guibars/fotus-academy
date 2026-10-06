# Fotus Academy

Portal em React e Vite com módulos de cursos e as ferramentas Conecta Híbridos e Conecta Juros.

## Executar

Use Node.js 22.18 ou superior. Em um ambiente de desenvolvimento com as dependências instaladas, execute `npm run dev`.

- `npm run lint`: verifica o TypeScript.
- `npm test`: verifica os cálculos, compatibilidades e parcelamentos; usa apenas o Node.js.
- `npm run build`: gera a versão de produção quando necessário.

Não é necessário configurar uma chave de API para estas ferramentas. `node_modules`, `dist` e outros arquivos gerados não devem ser enviados ao Git.

## Capas e conteúdos

As cinco capas originais estão em `public/assets/covers`, com exibição inteira em retrato 9:16. A logo fornecida está em `public/assets/fotus-academy.png`.

Os títulos e subtítulos em `src/data/coursesData.ts` correspondem às capas. Os arquivos de vídeo não foram fornecidos; cadastre uma URL real no campo `videoUrl` de cada módulo para habilitar o player. A plataforma não simula reprodução de vídeo, avaliações, progresso, certificados, usuários ou inscrições.

## Ferramentas Conecta

- A terceira aba contém seleção de rede, inventário de cargas, autonomia, DoD, simultaneidade, margem de segurança, seleção de baterias, inversores e resultados com alternativas compatíveis.
- A quarta aba contém os 21 parcelamentos do Conecta Juros, desconto no modo normal, entrada e configuração BKO.

As regras, o catálogo e as taxas foram copiados de `conectahibridosdev` para `src/conecta`. As imagens necessárias foram copiadas para `public/assets/images`. O projeto de origem é independente e não é uma dependência deste portal.

A tabela de taxas é a tabela existente no projeto de origem, sem consulta automática de atualização. Não há uma agenda real de treinamentos cadastrada nesta plataforma; a quinta aba encaminha para o canal Conecta Fotus.
