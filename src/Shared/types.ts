export enum RegistryType {
    GIT = 'git',
    GITHUB = 'github',
    GITLAB = 'gitlab',
    BITBUCKET = 'bitbucket',
    DOCKER = 'docker',
    DOCKER_HUB = 'docker-hub',
    ACR = 'acr',
    QUAY = 'quay',
    ECR = 'ecr',
    ARTIFACT_REGISTRY = 'artifact-registry',
    GCR = 'gcr',
    OTHER = 'other',
}

export enum DefaultUserKey {
    system = 'system',
    admin = 'admin',
}

export enum Severity {
    CRITICAL = 'critical',
    MODERATE = 'moderate',
    LOW = 'low',
}
