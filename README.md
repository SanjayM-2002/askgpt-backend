# ASK GPT

ASP GPT is a virtual assistant powered by the Llama 3 model from Groq API

## Tech Stack and Other details

- Backend: **Node.js, Express**
- **MongoDB** as Database
- **Groq-sdk** for accessing Groq API
- **Zod** for validation
- **JWT** for authentication
- **Bcrypt** for hashing

- Frontend: **React.js**
- Used **Tailwind CSS** for responsive UI design
- Used **Recoil** for efficient state management
- Only authenticated users can access chaat page

## Backend setup

Clone the repo

```bash
git clone https://github.com/SanjayM-2002/askgpt-backend.git
```

```bash
cd askgpt-backend
```

Set up .env in root:

```bash
OPEN_AI_SECRET =
OPEN_AI_ORG_ID =
GROQ_API_KEY =
MONGO_URL =
JWT_SECRET =
PORT = 5000
NODE_ENV = development

```

```bash
npm i
```

```bash
npm run dev
```

## Frontend Repo

[Github repo] (https://github.com/SanjayM-2002/askgpt-frontend)

## License

[MIT](https://choosealicense.com/licenses/mit/)
