<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Cloud

**Cloud computing** is the delivery of computing services — including servers, storage, databases, networking, software, and more — over the internet ("the cloud"). Instead of owning and maintaining physical hardware, you rent access to computing resources from a cloud provider and pay only for what you use.

In the context of this NestJS project, "cloud" refers to hosting and running your application on remote infrastructure provided by services such as AWS, Google Cloud, or Azure, rather than on a local machine.

### Why use the cloud for this application?

- **Scalability**: Scale your API, database, and job processors independently based on demand.
- **Reliability**: Cloud providers offer high-availability zones and managed services (databases, queues, caches) with built-in redundancy.
- **Managed services**: Offload operational concerns (backups, patching, monitoring) to the provider so you can focus on business logic.
- **Docker-ready**: This project ships with a `Dockerfile` and `docker-compose.yml`, making it straightforward to run the same container image locally and in any cloud environment.

### Key cloud concepts used in this project

| Concept | What it means here |
|---|---|
| **Container** | The app is packaged as a Docker image and runs identically everywhere. |
| **Orchestration** | Use Docker Compose locally; use Kubernetes, ECS/Fargate, or another container platform in production (configuration will vary by provider). |
| **Managed database** | Replace the local Postgres container with RDS (AWS), Cloud SQL (GCP), or Azure Database. |
| **Managed cache** | Replace the local Redis container with ElastiCache (AWS) or Memorystore (GCP). |
| **Environment variables** | Secrets and config are injected at runtime; never baked into the image. |
| **Health checks** | The compose file already defines health checks that cloud load balancers can use. |

### Deployment options

**Option 1 – NestJS Mau (AWS, quickest start)**

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

**Option 2 – Any container platform**

Build the image and push it to a registry, then deploy to the platform of your choice:

```bash
# Build
$ docker build -t your-org/your-app:latest .

# Push to a registry (example: Docker Hub)
$ docker push your-org/your-app:latest

# Deploy on your platform (ECS, Cloud Run, Fly.io, Railway, Render, etc.)
```

**Option 3 – Docker Compose on a cloud VM**

Copy the repository to any Linux VM (EC2, Compute Engine, Droplet, etc.) and run:

```bash
$ docker compose up -d
```

For more information on production deployment, see the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
