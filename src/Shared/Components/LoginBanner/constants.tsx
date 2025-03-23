import { TestimonialCardConfig } from './types'

// TODO: add more testimonials (pending on product team)
export const TESTIMONIAL_CARD_DATA: TestimonialCardConfig[] = [
    {
        quote: "Devtron has been instrumental in our transition to Kubernetes. Its platform helped us streamline our CI/CD processes, ensuring consistent and secure deployments. We've seen significantly improved our deployment speed and security posture thanks to Devtron's built-in DevSecOps features.",
        name: 'Sathish Kumar',
        designation: 'CloudOps/DevOps Lead at Ather Energy Pvt. Ltd.',
        iconName: 'ic-devtron',
    },
    {
        quote: 'One of the best tools in the market. A production-ready platform that helps in automating all the requirements on Kubernetes. The platform is easy to get started with. Well done product! We run a lot of migrations and backup jobs daily, and Devtron makes it super easy and auditable for us.',
        name: 'Arun Jain',
        designation: 'Froent developer',
        iconName: 'ic-devtron',
    },
    {
        quote: "Devtron has been instrumental in our transition to Kubernetes. Its platform helped us streamline our CI/CD processes, ensuring consistent and secure deployments. We've seen significantly improved our deployment speed and security posture thanks to Devtron's built-in DevSecOps features.",
        name: 'Abhishek',
        designation: 'CloudOps Lead at Ather Energy Pvt. Ltd.',
        iconName: 'ic-devtron',
    },
    {
        quote: 'Devtron has changed the way we used to operate, from bunch of scripts to now just a dashboard. The UI is pretty good and fast. Devtron has truly removed the dependencies of our developers from DevOps peeps. The UI is user-friendly and simple for new users to get acquainted with the tool.',
        name: 'Utkarsh Arya',
        designation: 'Product Manager',
        iconName: 'ic-devtron',
    },
]

export const TESTIMONIAL_CARD_INTERVAL = 5000 // duration (in ms) for each testimonial card slide animation
export const TRANSITION_EASE_CURVE = [0.25, 0.8, 0.25, 1]
