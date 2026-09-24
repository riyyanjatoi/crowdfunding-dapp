# Web3 Crowdfunding DApp

A decentralized crowdfunding platform built with **Next.js, TypeScript, thirdweb, and Ethereum smart contracts**.

The project was later extended into a **DevOps deployment project** using Docker, GitHub Actions, Amazon ECR, IAM, and EC2.

## 🚀 Features

* Create crowdfunding campaigns
* Set campaign goals and deadlines
* Connect crypto wallets
* Contribute ETH
* Track campaign progress and backers
* Interact directly with Ethereum smart contracts
* Live ETH/USD conversion
* Dockerized production application
* CI/CD-based deployment

## 🛠️ Tech Stack

**Frontend**

* Next.js
* React
* TypeScript
* Tailwind CSS

**Web3**

* Solidity
* Ethereum Sepolia
* thirdweb
* ethers.js

**DevOps / AWS**

* Git & GitHub
* Docker
* GitHub Actions
* Amazon ECR
* Amazon EC2
* AWS IAM

## 🏗️ Architecture

```text
Developer
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Docker Build
   ↓
Amazon ECR
   ↓
AWS EC2
   ↓
Docker Container
   ↓
Next.js Application
```

## 🔄 CI/CD Pipeline

```text
git push
   ↓
Checkout Code
   ↓
Build Docker Image
   ↓
Tag Image
   ↓
Push to ECR
   ↓
EC2 Pulls Image
   ↓
Run New Container
```

GitHub Actions automates the build and image publishing process.

## 🐳 Docker

Build:

```bash
docker build -t crowdfunding-dapp .
```

Run:

```bash
docker run -d \
  --name crowdfunding-dapp \
  -p 3000:3000 \
  crowdfunding-dapp
```

## ☁️ AWS Deployment

The Docker image is stored in **Amazon ECR** and deployed on **EC2**.

```bash
docker pull <ECR_URI>/crowdfunding-dapp:latest

docker stop crowdfunding-dapp
docker rm crowdfunding-dapp

docker run -d \
  --name crowdfunding-dapp \
  -p 3000:3000 \
  <ECR_URI>/crowdfunding-dapp:latest
```

EC2 uses an IAM role with ECR permissions to pull the image without storing AWS credentials on the server.

## 💻 Local Setup

```bash
git clone <repo-url>
cd crowdfunding-dapp

npm ci
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

Application:

```text
http://localhost:3000
```

## 📚 What This Project Demonstrates

* Web3 application development
* Smart-contract integration
* Docker containerization
* Multi-stage Docker builds
* GitHub Actions CI/CD
* Amazon ECR
* AWS EC2 deployment
* IAM-based AWS access
* Cloud deployment troubleshooting

## 🔗 Deployment

**Live Application:**
https://crowdfunding-dapp-two.vercel.app/
