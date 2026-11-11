# TSD (Tempo a Sós com Deus) — Configuração do Projeto

## Diretrizes Gerais
- Faça exatamente o que foi solicitado; nada a mais, nada a menos.
- Evite criar arquivos desnecessários — priorize a edição dos arquivos existentes.
- Não crie documentação adicional a menos que expressamente solicitado.
- Sempre leia um arquivo antes de editá-lo.
- Nunca faça commit ou exponha segredos, credenciais ou variáveis de ambiente (.env).
- Mantenha os arquivos organizados e limpos (< 500 linhas).
- Valide dados de entrada nas fronteiras do sistema.

## Visão do Projeto
Aplicação completa para acompanhamento e cultivo de disciplinas espirituais cristãs (Bíblia, Oração, Jejum, Devocionais e Grupos de Oração).
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Context API para estado global.
- **Backend**: Node.js, Express, GraphQL, Supabase, JWT / Autenticação.

## Testes e Build
- Frontend: `npm run build` na pasta `frontend`
- Backend: `npm start` ou `npm run dev` na pasta `backend`
