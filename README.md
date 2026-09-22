# Web3 Crowdfunding App

A decentralized crowdfunding platform built with **Next.js 15, React 19, TypeScript, and thirdweb**, powered by smart contracts deployed on the Ethereum Sepolia testnet.

This project was originally developed as a **Web3 development project** to explore decentralized applications, smart-contract interaction, wallet connectivity, and blockchain-based crowdfunding.

The project is now also being used as a **DevOps learning and portfolio project**. Instead of treating the application as only a Web3 frontend, the existing application is being progressively optimized and deployed using modern DevOps practices such as **Docker, CI/CD, Amazon ECR, Amazon ECS/Fargate, AWS networking, load balancing, and monitoring**.

---

## Project Background

The original purpose of this project was to build a decentralized crowdfunding platform where campaign creation, contributions, and fund management are handled through Ethereum smart contracts rather than a traditional centralized backend.

The application allows users to connect their wallets, create crowdfunding campaigns, contribute ETH, and interact directly with the deployed smart contracts.

As the project evolved, it became a useful application for learning how a real software project moves from **development to containerization, continuous integration, and cloud deployment**.

The current goal is therefore twofold:

* Demonstrate practical **Web3 development** skills.
* Use the application as a realistic **DevOps deployment project** to demonstrate containerization, CI/CD, AWS infrastructure, and automated deployments.

---

# Current DevOps Direction

The application is being transitioned from a traditional development-focused repository into a **containerized, cloud-deployed application with an automated CI/CD pipeline**.

The target workflow is:

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Install dependencies
    ├── Run checks
    ├── Build Next.js application
    └── Build Docker image
            │
            ▼
        Amazon ECR
            │
            ▼
       Amazon ECS/Fargate
            │
            ▼
   Application Load Balancer
            │
            ▼
          Users
```

The project is being developed incrementally, so some components of this architecture are still being implemented.

---

# Web3 Application

The application is a decentralized crowdfunding platform.

As a decentralized application (**dApp**), the core crowdfunding logic is handled by Ethereum smart contracts, providing transparent and verifiable campaign activity without requiring a centralized crowdfunding backend.

## Features

* Create crowdfunding campaigns with a goal amount, deadline, and description.
* Contribute ETH to active campaigns from connected wallets.
* Display real-time campaign statistics such as:

  * Amount raised
  * Number of backers
  * Time remaining
* Smart contracts enforce campaign goals and deadlines.
* Campaign owners can withdraw funds when the required conditions are met.
* Responsive interface built with Tailwind CSS.
* Wallet connection and transaction handling through thirdweb.
* Live USD conversion for raised ETH using the CoinGecko API.

## How It Works

1. A `CampaignFactory` contract is deployed.
2. The web application interacts with the factory to create individual `Campaign` contracts.
3. Contributors call the `fund` function on a campaign contract.
4. The campaign contract tracks contributions and enforces its rules.
5. When the required conditions are satisfied, the campaign owner can call `withdraw`.
6. Refund functionality is planned for a future update.

---

# DevOps Implementation

The application is being progressively containerized and prepared for automated AWS deployment.

## Docker

The application has been containerized using Docker.

A **multi-stage Dockerfile** is used to separate dependency installation, application building, and the production runtime.

```text
Dependencies
      │
      ▼
   Build Stage
      │
      ▼
 Production Image
```

### Dockerfile stages

**1. Dependencies**

Installs the Node.js dependencies using:

```bash
npm ci
```

**2. Builder**

Copies the application source code and creates the production Next.js build:

```bash
npm run build
```

**3. Runner**

Creates the production runtime container and starts the application using:

```bash
npm start
```

The application runs on:

```text
Port 3000
```

### Docker Compose

A Docker Compose configuration is also included for running the application as a containerized service during development and testing.

```bash
docker compose up --build
```

---

# Containerization Lessons

During the Dockerization process, the application was tested on an AWS EC2 instance.

The process involved diagnosing several real-world infrastructure issues, including:

* Docker image vs. container concepts.
* Docker build failures.
* Memory exhaustion during `npm ci`.
* Exit code `137` caused by memory pressure.
* Adding Linux swap space.
* Docker disk usage and cleanup.
* `ENOSPC` / insufficient disk space.
* Expanding an AWS EBS volume.
* Expanding the Linux partition using `growpart`.
* Expanding the filesystem using `resize2fs`.
* Node.js heap exhaustion during the Next.js production build.

The EC2 instance was intentionally kept as a learning environment rather than being used as the final CI/CD build server.

Because the application build is relatively resource-intensive compared with the small EC2 instance, the heavy build process is being moved to **GitHub Actions**.

---

# CI/CD

The next stage of the project is implementing a GitHub Actions CI/CD pipeline.

The intended pipeline is:

```text
git push
   │
   ▼
GitHub Actions
   │
   ├── Checkout repository
   ├── Install Node.js
   ├── Install dependencies
   ├── Run application checks
   ├── Build Next.js application
   └── Build Docker image
```

The pipeline will eventually continue with:

```text
Docker Image
     │
     ▼
Amazon ECR
     │
     ▼
Amazon ECS/Fargate
```

This will allow application changes pushed to GitHub to automatically progress through the deployment pipeline.

---

# AWS Deployment Architecture

The planned production architecture uses AWS managed services.

```text
                 Internet
                    │
                    ▼
          Application Load Balancer
                    │
                    ▼
              ECS / Fargate
                    │
                    ▼
             Docker Container
                    │
                    ▼
              Next.js App
```

Supporting AWS services will include:

### Amazon ECR

Used as the private Docker image registry.

```text
GitHub Actions
      │
      │ docker push
      ▼
     ECR
```

### Amazon ECS / Fargate

Used to run the Docker container without managing the underlying servers directly.

### Application Load Balancer

Used to expose the application and distribute incoming traffic to running ECS tasks.

### Amazon VPC

Used to provide the networking environment for the cloud infrastructure, including subnets, routing, security groups, and other network components.

### CloudWatch

Planned for application/container monitoring and logging.

### IAM

Used to control access between GitHub Actions and AWS services and between AWS resources themselves.

---

# DevOps Goals

The project is being used to demonstrate practical understanding of:

* Linux
* Git and GitHub
* Docker
* Docker Compose
* Containerization
* GitHub Actions
* CI/CD
* AWS IAM
* Amazon ECR
* Amazon ECS
* AWS Fargate
* Application Load Balancer
* Amazon VPC
* Security Groups
* CloudWatch
* AWS networking
* Container deployment
* Infrastructure and deployment troubleshooting

The objective is not simply to deploy a static application, but to build a workflow that resembles how a modern application can be **built, packaged, tested, and deployed automatically**.

---

# Tech Stack

## Application

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| Next.js 15      | React application framework           |
| React 19        | UI rendering                          |
| TypeScript      | Static typing                         |
| thirdweb SDK v5 | Wallet and smart-contract interaction |
| ethers v6       | Ethereum utilities                    |
| Tailwind CSS    | Styling                               |
| CoinGecko API   | ETH/USD conversion                    |

## Blockchain

| Technology               | Purpose                           |
| ------------------------ | --------------------------------- |
| Solidity Smart Contracts | Crowdfunding logic                |
| Ethereum Sepolia         | Test network                      |
| CampaignFactory          | Campaign creation                 |
| Campaign                 | Individual crowdfunding campaigns |

## DevOps / Infrastructure

| Technology                | Purpose                                 |
| ------------------------- | --------------------------------------- |
| Git                       | Version control                         |
| GitHub                    | Source code and collaboration           |
| Docker                    | Application containerization            |
| Docker Compose            | Local/containerized application testing |
| GitHub Actions            | CI/CD automation                        |
| Amazon ECR                | Container image registry                |
| Amazon ECS                | Container orchestration                 |
| AWS Fargate               | Serverless container runtime            |
| Application Load Balancer | Application traffic routing             |
| Amazon VPC                | Cloud networking                        |
| IAM                       | Access control                          |
| CloudWatch                | Monitoring and logging                  |

---

# Environment Variables

The application requires the thirdweb client ID.

Create a `.env.local` file:

```bash
CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

Do **not** commit environment files or secrets to GitHub.

The repository's `.dockerignore` also excludes environment files from the Docker build context.

For the eventual CI/CD deployment, environment variables and secrets will be handled through appropriate GitHub/AWS configuration rather than hardcoding them into the Docker image.

---

# Getting Started

## Clone the repository

```bash
git clone <repo-url>
cd crowdfunding-dapp
```

## Install dependencies

```bash
npm ci
```

## Configure environment variables

Create:

```text
.env.local
```

and add:

```bash
CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

## Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# Running with Docker

Build the Docker image:

```bash
docker build -t crowdfunding-dapp .
```

Run the container:

```bash
docker run -d \
  -p 3000:3000 \
  --name crowdfunding-app \
  crowdfunding-dapp
```

Or use Docker Compose:

```bash
docker compose up --build
```

The application will then be exposed on port `3000`.

---

# Production Build

The Next.js production build can be created with:

```bash
npm run build
```

and started with:

```bash
npm start
```

For the DevOps deployment workflow, the production build will eventually be performed automatically by **GitHub Actions** rather than relying on the small EC2 development environment.

---

# Project Structure

```text
src/
└── app/
    ├── components/
    │   ├── CampaignCard
    │   ├── CampaignWithdraw
    │   └── ...
    │
    ├── campaign/
    │   └── [address]/
    │
    ├── constants/
    │   └── Contract ABIs & addresses
    │
    └── ...
    
Dockerfile
.dockerignore
docker-compose.yml
package.json
package-lock.json
```

---

# Project Evolution

This repository has evolved through two stages.

### Stage 1 — Web3 Development

The original focus was:

```text
Smart Contracts
      +
Next.js
      +
thirdweb
      +
Ethereum
```

The objective was to build and understand a functional decentralized crowdfunding application.

### Stage 2 — DevOps

The focus is now expanding to:

```text
Application
    ↓
Docker
    ↓
CI/CD
    ↓
ECR
    ↓
ECS/Fargate
    ↓
ALB
    ↓
AWS Infrastructure
    ↓
Monitoring
```

The existing Web3 application therefore serves as the **application layer**, while the DevOps work builds the infrastructure and automation layer around it.

This allows the same project to demonstrate both **application development** and the processes required to reliably package, deploy, and operate that application in the cloud.

---

# Resources

* [thirdweb Documentation](https://portal.thirdweb.com/typescript/v5)
* [Next.js Documentation](https://nextjs.org/docs)
* [Docker Documentation](https://docs.docker.com/)
* [GitHub Actions Documentation](https://docs.github.com/en/actions)
* [Amazon ECR Documentation](https://docs.aws.amazon.com/ecr/)
* [Amazon ECS Documentation](https://docs.aws.amazon.com/ecs/)
* [AWS Fargate Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)

---

# License

MIT
