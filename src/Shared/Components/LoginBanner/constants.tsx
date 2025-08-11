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

import { TestimonialCardConfig } from './types'

export const TESTIMONIAL_CARD_DATA: TestimonialCardConfig[] = [
    {
        quote: 'Devtron offers a unified platform for managing and deploying applications on Kubernetes, simplifying the complexities of Kubernetes with an intuitive dashboard. It empowered us to automate workflows and optimize our CI/CD pipelines effortlessly, enabling faster deployments and improved operational efficiency.',
        designation: 'VP at TravClan',
        name: 'Shrawan Kumar',
        iconName: 'ic-travclan',
    },
    {
        quote: 'Migrating to Devtron revolutionized our tech ecosystem. We onboarded 150+ microservices and multiple staging environments in just weeks. Software releases used to be a month long process and now take a week or even a day for some services. Devtron’s efficiency has transformed how we deliver value, setting a new benchmark for agility and speed.',
        designation: 'Principal Engineer at Livspace',
        name: 'Ankit Agarwal',
        iconName: 'ic-livspace',
    },
    {
        quote: 'Before Devtron, managing environments consistently was a challenge. Its built-in features ensure identical deployments, reducing discrepancies and boosting resiliency. The one-click rollback saved hours of downtime, quickly getting us back on track. Devtron has streamlined our CI/CD pipeline, enabling faster, reliable deployments and cutting operational overhead.',
        designation: 'Engineering Manager at Delhivery',
        name: 'Vinay Mishra',
        iconName: 'ic-delhivery',
    },
    {
        quote: "Devtron was key to our Kubernetes transition, streamlining CI/CD for consistent, secure deployments. Its built-in DevSecOps features improved deployment speed and security. The user-friendly platform simplifies Kubernetes management. Devtron's focus on security and automation aligns with our goals, and we’re excited to keep leveraging it as we shape electric mobility's future.",
        name: 'Sathish Kumar',
        designation: 'CloudOps/DevOps Lead at Ather Energy Pvt. Ltd.',
        iconName: 'ic-ather',
    },
    {
        quote: 'Devtron streamlines the deployment and management of Kubernetes, providing a user-friendly interface specifically designed for distributing software into customer environments. For us Devtron has also significantly reduced manpower requirements and automated various processes, enhancing efficiency and productivity.',
        designation: 'Co-founder and CTO at 73-strings',
        name: 'Vinod Vijapur',
        iconName: 'ic-73strings',
    },
    {
        quote: 'Partnering with Devtron has revolutionized the way we deliver solutions to our customers. Their Kubernetes-native platform has empowered us to automate and scale our deployments, reducing time-to-market and significantly boosting DevOps efficiency. The collaboration has not only streamlined our processes but also enhanced our ability to serve customers with agility and precision.',
        designation: 'CPTO at Apica',
        name: 'Ranjan Parthasarathy',
        iconName: 'ic-apica',
    },
    {
        quote: "Devtron CI has been instrumental in our migration to ARM architecture. The automation and efficiency it provides have not only cut costs but also significantly improved our system performance. Devtron's support made the transition smooth and effective, setting a new standard for our infrastructure operations.",
        designation: 'Principal Engineer at Spinny',
        name: 'Spinny',
        iconName: 'ic-spinny',
    },
    {
        quote: 'Managing our complex Kubernetes environment was a bottleneck, with 15+ pre-prod environments demanding more resources. Devtron streamlined our SDLC, enabling efficient management without extra DevOps hires. Lead times dropped, developers gained self-service access, and onboarding became easy. Devtron has made us more agile and efficient, letting us focus on delivering value.',
        designation: 'Director Architect at Tata1MG',
        name: 'Pankaj Pandey',
        iconName: 'ic-tata1mg',
    },
    {
        quote: 'Devtron has been a game-changer for us. With a small team and limited resources, it has enabled us to effortlessly scale our Kubernetes operations. The simplicity, automation, and centralized management have allowed us to focus on innovation instead of infrastructure, something that’s crucial for startups like ours.',
        designation: 'DevOps Engineer at Cookr',
        name: 'Santosh Sivan',
        iconName: 'ic-cookr',
    },
]

export const TESTIMONIAL_CARD_INTERVAL = 5000 // duration (in ms) for each testimonial card slide animation
export const TRANSITION_EASE_CURVE = [0.25, 0.8, 0.25, 1]
