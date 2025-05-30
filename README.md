# Loyelto

**Loyelto** is a blockchain-based loyalty platform on Solana designed for small and medium-sized businesses. Each business can issue its own loyalty tokens (SPL-2022), which are exchangeable through the settlement token LOYL (≈1 USDC). Users authenticate via Privy (email/phone/OAuth) without direct wallet interactions. The platform supports the issuance of NFT vouchers (compressed NFTs) and provides tools for analytics and loyalty program management.

## 🚀 Features

- Issue loyalty (branded) tokens for businesses (SPL-2022)
- Settlement via internal token LOYL
- User authentication through Privy
- Support for NFT vouchers
- REST API built with FastAPI
- Task queues using Celery and Redis
- CI/CD with GitHub Actions and Docker
- Mobile app for business users and for consumers

## 🧱 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Redis, Celery
- **Blockchain**: Solana, Anchor, SPL-2022; in future - Bubblegum for NFTs
- **Frontend**: React (Web), React Native (Mobile)
- **DevOps**: Docker, GitHub Actions

## 🧬 Programms on TESTNET
- **loyl_settlement**: 47RVB2NnGEYXdSvxxN7DfLFk69FvpJemvhH4rxLnjE4s
- **loyl_token**: 3kzE3Xvgzi9PurL9cjRU7t9twHLYZUhaVv2AVmLXqbxm
- **exchange**: uMhywp8T3MGLrXPgaTnX7HQjNCT6Cv9tp9pfZ2S7WBp

## 📦 Installation (not for personal use)

```bash
git clone https://github.com/edvin3i/loyelto.git
cd loyelto
mv infra/env/stage.env.example infra/env/stage.env
# set the real values in env variables
make up-stage
```
## 📱 Our social media:
- [📜 Website](https:loyel.to)
- [🏢 Linkedin](https://www.linkedin.com/company/loyelto)
- [📠 Telegram](https://t.me/loyelto)
- [📸 Instagram](https://www.instagram.com/loyelto)
- [📟 X](https://x.com/loyelto75)
