/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RegistryTypeDetailType } from '@Common/Types'
import { RegistryType } from '@Shared/types'

import { RegistryIcon } from './RegistryIcon'

export const REGISTRY_TYPE_MAP: Record<string, RegistryTypeDetailType> = {
    ecr: {
        value: 'ecr',
        label: 'ECR',
        desiredFormat: '(desired format: repo-name)',
        placeholderText: 'Eg. repo_name',
        gettingStartedLink: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/get-set-up-for-amazon-ecr.html',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: 'Eg. xxxxxxxxxxxx.dkr.ecr.region.amazonaws.com',
        },
        id: {
            label: 'Access key ID',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Secret access key',
            defaultValue: '',
            placeholder: '',
        },
        startIcon: <RegistryIcon registryType={RegistryType.ECR} />,
    },
    'docker-hub': {
        value: 'docker-hub',
        label: 'Docker',
        desiredFormat: '(desired format: username/repo-name)',
        placeholderText: 'Eg. username/repo_name',
        gettingStartedLink: 'https://docs.docker.com/docker-hub/',
        defaultRegistryURL: 'docker.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password/Token (Recommended: Token)',
            defaultValue: '',
            placeholder: '',
        },
        startIcon: <RegistryIcon registryType={RegistryType.DOCKER_HUB} />,
    },
    acr: {
        value: 'acr',
        label: 'Azure',
        desiredFormat: '(desired format: repo-name)',
        placeholderText: 'Eg. repo_name',
        gettingStartedLink:
            'https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL/Login Server',
            defaultValue: '',
            placeholder: 'Eg. xxx.azurecr.io',
        },
        id: {
            label: 'Username/Registry Name',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password',
            defaultValue: '',
            placeholder: '',
        },
        startIcon: <RegistryIcon registryType={RegistryType.ACR} />,
    },
    'artifact-registry': {
        value: 'artifact-registry',
        label: 'Artifact Registry (GCP)',
        desiredFormat: '(desired format: project-id/artifacts-repo/repo-name)',
        placeholderText: 'Eg. project-id/artifacts-repo/repo-name',
        gettingStartedLink: 'https://cloud.google.com/artifact-registry/docs/manage-repos?hl=en_US',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: 'Eg. region-docker.pkg.dev',
        },
        id: {
            label: 'Username',
            defaultValue: '_json_key',
            placeholder: '',
        },
        password: {
            label: 'Service Account JSON File',
            defaultValue: '',
            placeholder: 'Paste json file content here',
        },
        startIcon: <RegistryIcon registryType={RegistryType.ARTIFACT_REGISTRY} />,
    },
    gcr: {
        value: 'gcr',
        label: 'GCR',
        desiredFormat: '(desired format: project-id/repo-name)',
        placeholderText: 'Eg. project-id/repo_name',
        gettingStartedLink: 'https://cloud.google.com/container-registry/docs/quickstart',
        defaultRegistryURL: 'gcr.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: 'gcr.io',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '_json_key',
            placeholder: '',
        },
        password: {
            label: 'Service Account JSON File',
            defaultValue: '',
            placeholder: 'Paste json file content here',
        },
        startIcon: <RegistryIcon registryType={RegistryType.GCR} />,
    },
    quay: {
        value: 'quay',
        label: 'Quay',
        desiredFormat: '(desired format: username/repo-name)',
        placeholderText: 'Eg. username/repo_name',
        gettingStartedLink: '',
        defaultRegistryURL: 'quay.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Token',
            defaultValue: '',
            placeholder: '',
        },
        startIcon: <RegistryIcon registryType={RegistryType.QUAY} />,
    },
    other: {
        value: 'other',
        label: 'Other',
        desiredFormat: '',
        placeholderText: '',
        gettingStartedLink: '',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password/Token',
            defaultValue: '',
            placeholder: '',
        },
        startIcon: <RegistryIcon registryType={RegistryType.OTHER} />,
    },
}
