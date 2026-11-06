import type { ResumeEditorFormData } from '../screens/ResumeEditorForm';
export const demoSource = String.raw`\documentclass[10pt,letterpaper]{article}
\usepackage[margin=0.5in]{geometry}
\usepackage{hyperref,enumitem}
\begin{document}
\centerline{\textbf{\Huge Alex Vance}}
\centerline{alex@example.com $\vert$ San Francisco, CA}
\section*{Technical Competencies}
\textbf{Languages}: Go, TypeScript, Python, SQL, Rust
\section*{Experience}
\textbf{Nexus Scale Labs} \hfill Founding Engineer
\begin{itemize}
\item Built reliable, high-throughput services.
\item Led infrastructure and product delivery.
\end{itemize}
\section*{Education}
\textbf{B.S. in Computer Science} $\vert$ UC Berkeley
\end{document}`;
export const demoForm: ResumeEditorFormData = {
  fullName: 'Alex Vance', headline: 'Founding Full Stack Architect & Distributed Systems Engineer', email: 'alex@example.com', phone: '+1 (415) 555-0142', location: 'San Francisco, CA', profiles: 'github.com/avance • linkedin.com/in/alex-vance',
  projects: [{ id: 'project-1', title: 'Distributed Raft Consensus Engine', subtitle: 'Creator & Maintainer • Go, gRPC, etcd', details: ['Implemented leader election and log replication across multiple nodes.', 'Benchmarked write throughput under simulated network partitions.'] }],
  skillGroups: [{ id: 'languages', title: 'Languages', skills: ['Go', 'TypeScript', 'Python', 'SQL', 'Rust'] }, { id: 'cloud', title: 'Frameworks & Cloud', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'] }, { id: 'architecture', title: 'Core Architectures', skills: ['Distributed Consensus', 'High-Concurrency Queues'] }],
  experience: [{ id: 'experience-1', title: 'Nexus Scale Labs', subtitle: 'Founding Full Stack Architect • 2022 — Present', details: ['Built a reliable transactional pipeline across services.', 'Led infrastructure delivery and operational improvements.'] }, { id: 'experience-2', title: 'Prior Early-Stage Startup', subtitle: 'IC Lead • 2020 — 2022', details: [] }],
  education: [{ id: 'education-1', title: 'B.S. Computer Science', subtitle: 'UC Berkeley • 2016 — 2020', details: ['Open-source contributor to distributed systems projects.'] }],
};
