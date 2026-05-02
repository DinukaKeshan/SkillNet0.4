DevOps combines development and operations to shorten the development lifecycle and deliver software continuously.

CI (Continuous Integration) automatically builds and tests code on every commit.

CD (Continuous Delivery) ensures code is always in a deployable state; Continuous Deployment automatically deploys.

CI/CD pipelines automate: build → test → lint → security scan → deploy stages.

Popular CI/CD tools: Jenkins, GitHub Actions, GitLab CI, CircleCI, Travis CI, Azure DevOps.

Pipeline configuration is typically defined as code: YAML files (.github/workflows/, .gitlab-ci.yml, Jenkinsfile).

Build automation compiles code, bundles assets, and creates artifacts (Docker images, binaries, packages).

Testing stages: unit tests → integration tests → end-to-end tests → performance tests.

Test coverage measures what percentage of code is exercised by tests.

Deployment strategies: rolling update, blue-green deployment, canary deployment, A/B testing.

Blue-green deployment: two identical environments; switch traffic from blue (old) to green (new).

Canary deployment: gradually roll out changes to a small subset of users before full deployment.

Rolling updates replace instances one at a time, ensuring zero downtime.

Infrastructure as Code (IaC) manages infrastructure through code: Terraform, CloudFormation, Pulumi, Ansible.

Configuration management: Ansible, Chef, Puppet automate server configuration.

Containerization (Docker) and orchestration (Kubernetes) are core DevOps practices.

Kubernetes (K8s) manages containerized workloads: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets.

Monitoring: collect metrics (CPU, memory, latency), set alerts, visualize dashboards. Tools: Prometheus, Grafana, Datadog.

Logging: centralized log aggregation. ELK Stack (Elasticsearch, Logstash, Kibana) or cloud solutions.

Distributed tracing tracks requests across microservices: Jaeger, Zipkin, OpenTelemetry.

GitOps: infrastructure and deployment managed via Git repositories as the source of truth. Tools: ArgoCD, Flux.

Environment management: development, staging, production. Environment variables and secrets management.

Feature flags enable/disable features without deployment: LaunchDarkly, Unleash.

Security in DevOps (DevSecOps): SAST, DAST, dependency scanning, secrets detection in CI pipelines.
