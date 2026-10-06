# Fotus Academy

Portal em React e Vite com módulos de cursos e as ferramentas Conecta Híbridos e Conecta Juros.

## Executar

Use Node.js 22.18 ou superior. Em um ambiente de desenvolvimento com as dependências instaladas, execute `npm run dev`.

- `npm run lint`: verifica o TypeScript.
- `npm test`: verifica os cálculos, compatibilidades e parcelamentos; usa apenas o Node.js.
- `npm run build`: gera a versão de produção quando necessário.

Não é necessário configurar uma chave de API para estas ferramentas. `node_modules`, `dist` e outros arquivos gerados não devem ser enviados ao Git.

Envie `package.json` e `package-lock.json` juntos ao Git. No Vercel, use o preset Vite, o comando de build `npm run build` e o diretório de saída `dist`; esse diretório será gerado pelo Vercel durante o deploy, sem precisar existir no repositório.

## Capas e conteúdos

As sete capas originais estão em `public/assets/covers`, com exibição inteira em retrato e proporção preservada, incluindo Carregador DC Beny e CHINT BESS C&I. A logo fornecida está em `public/assets/fotus-academy.png`. O símbolo Fotus em `public/assets/fotus-symbol.png` aparece no menu recolhido e no ícone do navegador. Os elementos originais da identidade visual estão em `public/assets/brand`.

O menu lateral tem formato de pílula, começa recolhido e abre ao passar o mouse ou navegar pelo teclado. No celular, o menu continua acessível pelo botão do cabeçalho. Os cinco ícones vetoriais próprios estão em `src/components/ToolIcon.tsx` e também aparecem nos atalhos do dashboard.

O calendário compacto do dashboard lê `TRAINING_EVENTS`, em `src/data/coursesData.ts`. Cadastre apenas eventos reais, com `date` no formato `YYYY-MM-DD`. Os dias com eventos recebem um marcador amarelo; selecionar um dia exibe seus treinamentos. Sem eventos cadastrados, o calendário informa que não há programação cadastrada naquele mês.

Os títulos e subtítulos em `src/data/coursesData.ts` correspondem às capas. O vídeo fornecido de Backup com Baterias está em `public/assets/videos/backup-baterias.mp4` e vinculado ao card correspondente. Para os outros módulos, cadastre uma URL real no campo `videoUrl` para habilitar o player. A plataforma não simula reprodução de vídeo, avaliações, progresso, certificados, usuários ou inscrições.

## Ferramentas Conecta

- A terceira aba contém seleção de rede, inventário de cargas, autonomia, DoD, simultaneidade, margem de segurança, seleção de baterias, inversores e resultados com alternativas compatíveis.
- A quarta aba contém os 21 parcelamentos do Conecta Juros, desconto no modo normal, entrada e configuração BKO.

As regras, o catálogo e as taxas foram copiados de `conectahibridosdev` para `src/conecta`. As imagens necessárias foram copiadas para `public/assets/images`. O projeto de origem é independente e não é uma dependência deste portal.

A tabela de taxas é a tabela existente no projeto de origem, sem consulta automática de atualização. Não há uma agenda real de treinamentos cadastrada nesta plataforma; a quinta aba encaminha para o canal Conecta Fotus.
