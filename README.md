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

# Web3 Crowdfunding DApp

A decentralized crowdfunding platform built with **Next.js, React, TypeScript, thirdweb, and Ethereum smart contracts**. Users can connect their wallets, create crowdfunding campaigns, contribute ETH, and interact directly with deployed smart contracts.

The project originally started as a **Web3 development project** and was later extended into a practical **DevOps and cloud deployment project**, using Docker, GitHub Actions, Amazon ECR, IAM, and EC2 to build and deploy the application through a CI/CD workflow.

---

## Project Evolution

This project evolved through two major stages.

### Stage 1 — Web3 Development

The original goal was to build a functional decentralized crowdfunding application.

```text
Next.js
   +
TypeScript
   +
thirdweb
   +
Ethereum Smart Contracts
        ↓
Web3 Crowdfunding DApp
```

The application handles crowdfunding logic through smart contracts rather than a traditional centralized backend.

### Stage 2 — DevOps

Once the application was functional, it became the application used to learn and practice DevOps.

```text
Web3 Application
       ↓
Docker
       ↓
AWS EC2
       ↓
Amazon ECR
       ↓
GitHub Actions
       ↓
CI/CD
       ↓
Automated Deployment
```

The same project therefore demonstrates both **application development** and the processes required to **package, build, publish, and deploy an application in the cloud**.

---

# Features

* Create crowdfunding campaigns.
* Set campaign goals and deadlines.
* Connect cryptocurrency wallets.
* Contribute ETH to active campaigns.
* Display campaign statistics.
* Track amount raised and number of backers.
* Display remaining campaign time.
* Allow campaign owners to withdraw funds when contract conditions are satisfied.
* Interact directly with Ethereum smart contracts.
* Live ETH/USD conversion using the CoinGecko API.
* Responsive interface using Tailwind CSS.
* Dockerized production application.
* Automated Docker image build and deployment through CI/CD.

---

# How the Web3 Application Works

The crowdfunding logic is handled by Ethereum smart contracts.

```text
                    CampaignFactory
                          │
              creates individual
                          ▼
                     Campaign
                    /         \
                   /           \
             Creator         Contributors
                │                 │
                │                 │ ETH
                ▼                 ▼
             Campaign ←──────── Contributions
                │
                ▼
             Withdrawal
```

### Contract Flow

1. A `CampaignFactory` contract is deployed.
2. The application interacts with the factory to create campaigns.
3. Each campaign is represented by a `Campaign` contract.
4. Users contribute ETH through the campaign contract.
5. The contract tracks contributions and campaign conditions.
6. Once the required conditions are satisfied, the campaign owner can withdraw the funds.
7. Refund functionality is planned for a future update.

---

# Tech Stack

## Application

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| Next.js 15      | Application framework                 |
| React 19        | UI                                    |
| TypeScript      | Static typing                         |
| Tailwind CSS    | Styling                               |
| thirdweb SDK v5 | Wallet and smart-contract interaction |
| ethers v6       | Ethereum utilities                    |
| CoinGecko API   | ETH/USD conversion                    |

## Blockchain

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| Solidity         | Smart-contract development    |
| Ethereum Sepolia | Test network                  |
| CampaignFactory  | Campaign creation             |
| Campaign         | Individual crowdfunding logic |

## DevOps & AWS

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| Git            | Version control                 |
| GitHub         | Source-code repository          |
| Docker         | Containerization                |
| Docker Compose | Local containerized testing     |
| GitHub Actions | CI/CD automation                |
| Amazon ECR     | Docker image registry           |
| Amazon EC2     | Application deployment server   |
| AWS IAM        | AWS access control              |
| AWS networking | Cloud connectivity and security |

---

# Docker

The application is containerized using a **multi-stage Dockerfile**.

```text
Dependencies
      ↓
   Builder
      ↓
 Production Runner
```

### Dependencies Stage

Installs the project dependencies:

```bash
npm ci
```

### Builder Stage

Creates the production Next.js build:

```bash
npm run build
```

### Runner Stage

Runs the production application:

```bash
npm start
```

The application runs on:

```text
Port 3000
```

This multi-stage approach keeps the production image focused on what is required to run the application rather than the complete development environment.

---

# Running Locally

## Clone the Repository

```bash
git clone <repo-url>
cd crowdfunding-dapp
```

## Install Dependencies

```bash
npm ci
```

## Configure Environment Variables

Create:

```text
.env.local
```

Add the required thirdweb client ID:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

Environment files should **never be committed to GitHub**.

## Run Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# Running with Docker

Build the image:

```bash
docker build -t crowdfunding-dapp .
```

Run the container:

```bash
docker run -d \
  --name crowdfunding-dapp \
  -p 3000:3000 \
  crowdfunding-dapp
```

Or use Docker Compose:

```bash
docker compose up --build
```

The application is then available on port `3000`.

---

# Docker & EC2 Troubleshooting

Dockerizing the application on a small EC2 instance provided practical experience with real infrastructure limitations.

During the process, several issues were encountered.

### Memory Exhaustion

Running:

```bash
npm ci
```

and building the Next.js application placed significant memory pressure on the small EC2 instance.

The container/build process could terminate with:

```text
exit code 137
```

This occurs when a process is killed because of memory pressure.

### Swap

Linux swap space was added to provide additional virtual memory and make resource-heavy operations more reliable.

### Disk Exhaustion

Docker images, containers, build layers, and other files consumed the EC2 root filesystem.

This eventually resulted in:

```text
ENOSPC
```

meaning there was insufficient disk space.

Docker storage was inspected and unnecessary resources were cleaned up.

### EBS Expansion

The EC2 EBS volume was expanded when the original disk capacity became insufficient.

Increasing the EBS volume alone does not automatically increase the filesystem available to Linux, so the partition and filesystem also had to be expanded.

The partition was expanded using:

```bash
sudo growpart /dev/nvme0n1 1
```

The filesystem was then expanded using:

```bash
sudo resize2fs /dev/nvme0n1p1
```

### Build Resource Limitations

Although these problems were useful for learning infrastructure troubleshooting, repeatedly performing heavy Next.js builds on a small EC2 instance was not an efficient deployment model.

This led to the next stage of the project:

**move the build process into CI/CD and use EC2 primarily as the deployment environment.**

---

# CI/CD

The project now uses GitHub Actions to automate the application build and Docker image publishing process.

The overall workflow is:

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
    ├── Checkout code
    ├── Configure AWS credentials
    ├── Login to ECR
    ├── Build Docker image
    ├── Tag Docker image
    └── Push image to ECR
             │
             ▼
        Amazon ECR
             │
             ▼
            EC2
             │
             ├── Pull image
             ├── Stop old container
             ├── Remove old container
             └── Run new container
```

The result is an automated path from **source-code change to a new Docker image ready for deployment**.

---

# GitHub Actions

The CI/CD workflow is triggered by changes pushed to the repository.

The pipeline performs the following major operations:

1. Checks out the latest source code.
2. Configures AWS authentication.
3. Authenticates Docker with Amazon ECR.
4. Builds the Docker image.
5. Passes the required application configuration during the build.
6. Tags the image using the ECR repository URI.
7. Pushes the image to Amazon ECR.

The heavy application build is therefore performed by the CI environment instead of relying on the small EC2 instance.

---

# Amazon ECR

**Amazon Elastic Container Registry (ECR)** is used as the private Docker image registry.

The workflow is:

```text
GitHub Actions
      │
      │ docker build
      ▼
 Docker Image
      │
      │ docker tag
      ▼
 ECR Repository
      │
      │ docker push
      ▼
 Amazon ECR
```

The image is tagged using the ECR repository URI:

```bash
docker tag crowdfunding-dapp:latest \
  <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/crowdfunding-dapp:latest
```

The image is then pushed:

```bash
docker push \
  <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/crowdfunding-dapp:latest
```

ECR provides the image registry between the CI environment and the EC2 deployment server.

---

# AWS IAM

IAM is used to control which AWS resources can be accessed by the deployment environment.

The EC2 instance was given an IAM role with permission to access ECR, using:

```text
AmazonEC2ContainerRegistryPowerUser
```

This allows the EC2 instance to authenticate with ECR and pull the application image without storing AWS access keys directly on the server.

The EC2 instance can authenticate with ECR using:

```bash
aws ecr get-login-password --region <REGION> | \
docker login \
  --username AWS \
  --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

---

# EC2 Deployment

EC2 acts as the application deployment server.

After the Docker image is available in ECR, the image can be pulled onto the instance:

```bash
docker pull \
  <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/crowdfunding-dapp:latest
```

The previous container is stopped and removed:

```bash
docker stop crowdfunding-dapp
docker rm crowdfunding-dapp
```

The new image is then started:

```bash
docker run -d \
  --name crowdfunding-dapp \
  -p 3000:3000 \
  <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/crowdfunding-dapp:latest
```

The application is exposed through port `3000`.

---

# Deployment Verification

After starting the container, the EC2 public IP can be retrieved from the instance:

```bash
curl http://checkip.amazonaws.com
```

The returned public IP can then be used to access:

```text
http://PUBLIC_IP:3000
```

This verifies that:

1. The EC2 instance is reachable.
2. The Docker container is running.
3. Port `3000` is mapped correctly.
4. The Next.js application is serving traffic.

---

# Final Deployment Architecture

The completed deployment flow is:

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
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
           Docker Build             AWS Login
                 │
                 ▼
            Docker Image
                 │
                 │ docker push
                 ▼
          ┌───────────────┐
          │  Amazon ECR   │
          └───────┬───────┘
                  │
                  │ docker pull
                  ▼
          ┌───────────────┐
          │   AWS EC2     │
          │               │
          │ Docker        │
          │ Container     │
          └───────┬───────┘
                  │
                  ▼
          Next.js Application
                  │
                  ▼
              Port 3000
                  │
                  ▼
               Users
```

---

# Environment Variables & Secrets

The application requires a thirdweb client ID.

For local development:

```text
.env.local
```

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

Sensitive configuration should not be hardcoded into the source code or committed to GitHub.

For CI/CD, sensitive values are stored using the appropriate **GitHub Secrets / AWS configuration**.

The Docker build receives required application configuration through build arguments where necessary.

---

# What This Project Demonstrates

This project provides practical experience across both software development and DevOps.

### Web3

* Decentralized application development
* Solidity smart contracts
* Ethereum
* Sepolia testnet
* Wallet connectivity
* Smart-contract interaction
* thirdweb
* ETH transactions

### Development

* Next.js
* React
* TypeScript
* Tailwind CSS
* REST API integration
* Environment variables

### DevOps

* Linux
* Git
* GitHub
* Docker
* Dockerfiles
* Multi-stage builds
* Docker Compose
* Container management
* GitHub Actions
* CI/CD
* Amazon ECR
* Amazon EC2
* AWS IAM
* AWS networking
* SSH-based administration
* Cloud deployment
* Infrastructure troubleshooting

---

# Key DevOps Lessons

The project was not simply used to demonstrate a successful deployment. It was also used to understand the problems that occur during real deployment workflows.

The major lessons included:

* Why applications are containerized.
* The difference between a Docker image and a container.
* How multi-stage Docker builds work.
* Why resource-heavy builds can fail on small servers.
* How exit code `137` relates to memory pressure.
* How Docker can consume significant disk space.
* How `ENOSPC` errors occur.
* How EBS volume expansion differs from filesystem expansion.
* How `growpart` and `resize2fs` are used after expanding storage.
* Why builds can be moved from deployment servers to CI environments.
* How Docker images are tagged for ECR.
* How images are pushed to and pulled from ECR.
* How IAM roles allow EC2 to access AWS services without embedding credentials.
* How CI/CD connects source control, builds, registries, and deployment infrastructure.
* How a new Docker image replaces an older running container.

---

# Project Workflow

The complete development-to-deployment workflow can be summarized as:

```text
Write Code
    ↓
Test Application
    ↓
Git Commit
    ↓
git push
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Build Docker Image
    ↓
Tag Image
    ↓
Push to Amazon ECR
    ↓
EC2 Authenticates with ECR
    ↓
Pull Latest Image
    ↓
Replace Running Container
    ↓
Application Runs on EC2
```

This workflow turns a manual deployment process into a repeatable process that can be executed whenever the application changes.

---

# Project Structure

```text
crowdfunding-dapp/
│
├── src/
│   └── app/
│       ├── components/
│       ├── campaign/
│       │   └── [address]/
│       ├── constants/
│       │   └── contract ABIs & addresses
│       └── ...
│
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── package.json
├── package-lock.json
└── ...
```

---

# Production Commands

Build the production application:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

Build the Docker image:

```bash
docker build -t crowdfunding-dapp .
```

Run the container:

```bash
docker run -d \
  --name crowdfunding-dapp \
  -p 3000:3000 \
  crowdfunding-dapp
```

---

# Project Summary

What began as a **Web3 crowdfunding application** became a practical **DevOps deployment project**.

The Web3 layer demonstrates decentralized application development and smart-contract interaction, while the DevOps layer demonstrates how that application can be containerized, built through CI/CD, published to a container registry, and deployed to AWS EC2.

```text
                 WEB3
                  │
        ┌─────────┴─────────┐
        │                   │
     Next.js            Smart Contracts
        │                   │
        └─────────┬─────────┘
                  │
             Application
                  │
                  ▼
                Docker
                  │
                  ▼
            GitHub Actions
                  │
                  ▼
              Amazon ECR
                  │
                  ▼
              AWS EC2
                  │
                  ▼
         Running Container
```

The project therefore evolved from simply **building a decentralized application** into understanding the complete path from **application development to containerization, CI/CD, cloud infrastructure, and deployment**.

---

# Resources

* [Next.js Documentation](https://nextjs.org/docs)
* [thirdweb Documentation](https://portal.thirdweb.com/typescript/v5)
* [Docker Documentation](https://docs.docker.com/)
* [GitHub Actions Documentation](https://docs.github.com/en/actions)
* [Amazon ECR Documentation](https://docs.aws.amazon.com/ecr/)
* [Amazon EC2 Documentation](https://docs.aws.amazon.com/ec2/)
* [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)

---

# License

MIT


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
