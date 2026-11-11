# TSD - Tempo a Sós com Deus

Aplicação web para cristãos acompanharem sua vida devocional e espiritual.

## 📁 Estrutura do Projeto

```
TSD_ALPHA/
├── backend/          # Node.js + Express + GraphQL
│   ├── src/
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── schema.js
│   │   ├── validation.js
│   │   └── middleware/
│   ├── migrations/
│   └── package.json
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── styles/
│   │   └── main.jsx
│   └── package.json
└── docs/
    └── PLANO_EXECUCAO_TSD_ALPHA.md
```

## 🚀 Início Rápido

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas credenciais Supabase
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 📋 Plano de Execução

Veja `PLANO_EXECUCAO_TSD_ALPHA.md` para guia completo de desenvolvimento.

## 🔒 Segurança

- Validação Joi em todos inputs
- Rate limiting (express-rate-limit)
- Sanitização HTML (DOMPurify)
- JWT seguro sem exposição de password_hash
- Row Level Security (RLS)

## 📄 Licença

Privado - Projeto TSD
