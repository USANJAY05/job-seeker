import type { TemplateListItem } from '../screens';

const publicActions = [ { id: 'preview', label: 'Preview PDF', icon: 'eye-outline' }, { id: 'source', label: '.tex', icon: 'code-braces' }, { id: 'fork', label: 'Fork & Use', icon: 'plus-box-outline', variant: 'lightPrimary' as const } ];
const deedySource = String.raw`\documentclass[letterpaper,11pt]{article}
\usepackage[margin=0.65in]{geometry}
\usepackage{enumitem}
\begin{document}
\begin{center}
  {\LARGE Your Name}\\
  email@example.com $\vert$ City, Country $\vert$ linkedin.com/in/yourname
\end{center}
\section*{Education}
\textbf{University Name} \hfill 2020 -- 2024\\
B.S. Computer Science
\section*{Experience}
\textbf{Role, Company} \hfill 2024 -- Present
\begin{itemize}[leftmargin=*]
  \item Describe an achievement with measurable impact.
\end{itemize}
\section*{Projects}
\textbf{Project Name} \hfill \textit{Technology}
\begin{itemize}[leftmargin=*]
  \item Explain the problem solved and the result.
\end{itemize}
\section*{Skills}
Languages: Python, TypeScript $\vert$ Tools: Git, Docker
\end{document}`;
const atsSource = String.raw`\documentclass[10pt]{article}
\usepackage[margin=0.7in]{geometry}
\usepackage{enumitem}
\setlength{\parindent}{0pt}
\begin{document}
{\LARGE\textbf{Your Name}}\\
email@example.com $\vert$ (555) 555-0100 $\vert$ City, Country
\section*{Summary}
Write a concise role-focused summary with relevant experience.
\section*{Experience}
\textbf{Job Title} — Company \hfill 2022 -- Present
\begin{itemize}[leftmargin=*]
  \item Start with an action verb and quantify the outcome.
  \item Describe a second responsibility or measurable result.
\end{itemize}
\section*{Education}
\textbf{Degree}, University \hfill 2018 -- 2022
\section*{Skills}
Python, SQL, Cloud Infrastructure, Communication
\end{document}`;
export const demoTemplates: TemplateListItem[] = [
  { id: 't1', title: 'Modern Deedy Cornell', description: 'XeLaTeX • OpenSans + Merriweather', icon: 'view-column-outline', categoryIds: ['academic'], actions: publicActions, canBookmark: true, verified: true, source: deedySource },
  { id: 't2', title: 'SB2Nov Tech Minimalist', description: 'pdfLaTeX • Computer Modern • Ultra Fast', icon: 'console', categoryIds: ['ats'], actions: publicActions, canBookmark: true, verified: true, source: atsSource },
  { id: 't3', title: 'Infra_Core_Staff_Standard.cls', description: 'XeLaTeX • Fira Code + Geist Mono • SRE Spec', icon: 'key-outline', badge: { label: 'INTERNAL', tone: 'success' }, categoryIds: ['executive'], actions: [{ id: 'decrypt', label: 'Decrypt', icon: 'key' }, { id: 'logs', label: 'Logs', icon: 'history' }, { id: 'load', label: 'Load to Pipeline', icon: 'download', variant: 'lightPrimary' }] },
  { id: 't4', title: 'Quant_Systems_LaTeX_v2', description: 'LuaLaTeX • Palatino + AMSMath • High-Density', icon: 'function-variant', badge: { label: 'PRIVATE', tone: 'secondary' }, categoryIds: ['two-column'], actions: [{ id: 'preview', label: 'Preview', icon: 'eye-outline' }, { id: 'source', label: 'Class File', icon: 'code-braces' }, { id: 'fork', label: 'Fork / Use', icon: 'content-copy', variant: 'lightPrimary' }] },
];
