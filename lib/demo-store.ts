// Demo mode store - simulates backend with localStorage
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  organization: string
  role: string
  avatar?: string
  experience: "beginner" | "intermediate" | "expert"
  createdAt: string
  badges: string[] // added badges to user
}

export interface Project {
  id: string
  name: string
  description: string
  organization: string // added organization field
  templateId?: string
  status: "draft" | "in-progress" | "review" | "completed"
  currentStep: number
  completedSteps: number[] // added completedSteps array
  progress: number
  createdAt: string
  updatedAt: string
  data: ProjectData
  badges: string[]
}

export interface ProjectData {
  problemDefinition?: {
    centralProblem: string
    context: string
    targetBeneficiaries: string
    geographicScope: string
    urgency: string
  }
  stakeholders?: Array<{
    id: string
    name: string
    type: "primary" | "secondary" | "key"
    interest: string
    influence: "high" | "medium" | "low"
    expectations: string
  }>
  problemTree?: {
    centralProblem: string
    causes: Array<{ id: string; text: string; parentId?: string }>
    effects: Array<{ id: string; text: string; parentId?: string }>
  }
  objectiveTree?: {
    centralObjective: string
    means: Array<{ id: string; text: string; parentId?: string }>
    ends: Array<{ id: string; text: string; parentId?: string }>
  }
  resultsChain?: {
    inputs: string[]
    activities: string[]
    outputs: string[]
    outcomes: string[]
    impact: string
  }
  logframe?: {
    goal: { narrative: string; indicators: string[]; mov: string[]; assumptions: string[] }
    purpose: { narrative: string; indicators: string[]; mov: string[]; assumptions: string[] }
    outputs: Array<{ narrative: string; indicators: string[]; mov: string[]; assumptions: string[] }>
    activities: Array<{ narrative: string; inputs: string[]; timeline: string; responsible: string }>
  }
  monitoring?: {
    indicators: Array<{
      id: string
      name: string
      type: "output" | "outcome" | "impact"
      baseline: string
      target: string
      frequency: string
      source: string
      responsible: string
    }>
    dataCollection: string
    reportingSchedule: string
  }
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  sectors: string[]
  preview: string
  popularity: number
  defaultData: Partial<ProjectData>
}

interface DemoStore {
  user: User | null
  projects: Project[]
  currentProject: Project | null
  isOnboarded: boolean
  badges: string[]

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>
  register: (data: Omit<User, "id" | "createdAt" | "badges">) => Promise<boolean>
  logout: () => void

  // Onboarding
  completeOnboarding: () => void

  // Project actions
  createProject: (name: string, description: string, templateId?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  updateProjectData: (id: string, step: keyof ProjectData, data: unknown) => void

  // Progress & Gamification
  updateProgress: (projectId: string, step: number) => void
  earnBadge: (badgeId: string) => void
}

export const TEMPLATES: Template[] = [
  {
    id: "education-access",
    name: "Education Access Program",
    description: "Template for programs focused on increasing school enrollment and attendance",
    category: "Education",
    sectors: ["Primary Education", "Rural Development"],
    preview: "/education-classroom-children-learning.jpg",
    popularity: 95,
    defaultData: {
      problemDefinition: {
        centralProblem: "Low school enrollment and attendance rates among marginalized children",
        context: "",
        targetBeneficiaries: "Children aged 6-14 from marginalized communities",
        geographicScope: "",
        urgency: "high",
      },
    },
  },
  {
    id: "learning-outcomes",
    name: "Learning Outcomes Improvement",
    description: "Template for programs targeting foundational literacy and numeracy",
    category: "Education",
    sectors: ["Primary Education", "Quality Education"],
    preview: "/students-studying-books-classroom.jpg",
    popularity: 88,
    defaultData: {
      problemDefinition: {
        centralProblem: "Poor foundational literacy and numeracy skills among primary school students",
        context: "",
        targetBeneficiaries: "Students in grades 1-5",
        geographicScope: "",
        urgency: "high",
      },
    },
  },
  {
    id: "teacher-training",
    name: "Teacher Capacity Building",
    description: "Template for teacher professional development programs",
    category: "Education",
    sectors: ["Teacher Education", "Professional Development"],
    preview: "/teacher-training-workshop-educators.jpg",
    popularity: 82,
    defaultData: {
      problemDefinition: {
        centralProblem: "Inadequate teaching capacity and pedagogical skills among teachers",
        context: "",
        targetBeneficiaries: "Primary and secondary school teachers",
        geographicScope: "",
        urgency: "medium",
      },
    },
  },
  {
    id: "digital-education",
    name: "Digital Learning Initiative",
    description: "Template for technology-enabled learning programs",
    category: "EdTech",
    sectors: ["Digital Education", "Technology"],
    preview: "/students-tablets-digital-learning-technology.jpg",
    popularity: 76,
    defaultData: {
      problemDefinition: {
        centralProblem: "Limited access to quality digital learning resources",
        context: "",
        targetBeneficiaries: "Students and teachers in underserved schools",
        geographicScope: "",
        urgency: "medium",
      },
    },
  },
  {
    id: "community-engagement",
    name: "Community-School Partnership",
    description: "Template for community involvement in education programs",
    category: "Community",
    sectors: ["Community Development", "Parent Engagement"],
    preview: "/community-meeting-parents-school.jpg",
    popularity: 71,
    defaultData: {
      problemDefinition: {
        centralProblem: "Low community and parental involvement in children education",
        context: "",
        targetBeneficiaries: "Parents and community members",
        geographicScope: "",
        urgency: "medium",
      },
    },
  },
  {
    id: "blank",
    name: "Start from Scratch",
    description: "Begin with a blank canvas and full flexibility",
    category: "Custom",
    sectors: [],
    preview: "/blank-canvas-creative-start-fresh.jpg",
    popularity: 60,
    defaultData: {},
  },
]

export const BADGES = [
  { id: "first-project", name: "First Steps", description: "Created your first project", icon: "🎯" },
  { id: "problem-analyst", name: "Problem Analyst", description: "Completed problem definition", icon: "🔍" },
  { id: "stakeholder-mapper", name: "Stakeholder Mapper", description: "Mapped all stakeholders", icon: "👥" },
  {
    id: "root-cause-detective",
    name: "Root Cause Detective",
    description: "Built a complete problem tree",
    icon: "🌳",
  },
  { id: "solution-architect", name: "Solution Architect", description: "Designed the objective tree", icon: "🏗️" },
  { id: "theory-builder", name: "Theory Builder", description: "Created a Theory of Change", icon: "💡" },
  { id: "logframe-master", name: "Logframe Master", description: "Completed the Logical Framework Matrix", icon: "📊" },
  { id: "impact-measurer", name: "Impact Measurer", description: "Set up the monitoring framework", icon: "📈" },
  {
    id: "program-designer",
    name: "Program Designer",
    description: "Completed your first full program design",
    icon: "🏆",
  },
  {
    id: "collaboration-champion",
    name: "Collaboration Champion",
    description: "Invited team members to collaborate",
    icon: "🤝",
  },
]

export const LFA_STEPS = [
  { id: 1, name: "Problem Definition", description: "Define the central problem and context", icon: "target" },
  { id: 2, name: "Stakeholder Analysis", description: "Identify and analyze key stakeholders", icon: "users" },
  { id: 3, name: "Problem Tree", description: "Map causes and effects of the problem", icon: "git-branch" },
  { id: 4, name: "Objective Tree", description: "Transform problems into objectives", icon: "git-merge" },
  { id: 5, name: "Results Chain", description: "Build your Theory of Change", icon: "workflow" },
  { id: 6, name: "Logical Framework", description: "Create the Logframe Matrix", icon: "table" },
  { id: 7, name: "Monitoring Framework", description: "Design indicators and M&E plan", icon: "bar-chart" },
]

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      user: null,
      projects: [],
      currentProject: null,
      isOnboarded: false,
      badges: [],

      login: async (email: string, password: string) => {
        // Demo mode - accept any credentials
        await new Promise((resolve) => setTimeout(resolve, 800))
        const existingUser = get().user
        if (existingUser && existingUser.email === email) {
          return true
        }
        // Create demo user if not exists
        set({
          user: {
            id: crypto.randomUUID(),
            name: email.split("@")[0],
            email,
            organization: "Demo Organization",
            role: "Program Manager",
            experience: "beginner",
            createdAt: new Date().toISOString(),
            badges: [], // initialize user badges
          },
        })
        return true
      },

      register: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        set({
          user: {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            badges: [], // initialize user badges
          },
        })
        return true
      },

      logout: () => {
        set({ user: null, currentProject: null })
      },

      completeOnboarding: () => {
        set({ isOnboarded: true })
      },

      createProject: (name, description, templateId) => {
        const template = TEMPLATES.find((t) => t.id === templateId)
        const user = get().user
        const project: Project = {
          id: crypto.randomUUID(),
          name,
          description,
          organization: user?.organization || "My Organization", // set organization from user
          templateId,
          status: "draft",
          currentStep: 1,
          completedSteps: [], // initialize completedSteps
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          data: template?.defaultData || {},
          badges: [],
        }

        set((state) => ({
          projects: [...state.projects, project],
          currentProject: project,
        }))

        // Earn first project badge
        if (get().projects.length === 1) {
          get().earnBadge("first-project")
        }

        return project
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
              : state.currentProject,
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }))
      },

      setCurrentProject: (project) => {
        set({ currentProject: project })
      },

      updateProjectData: (id, step, data) => {
        set((state) => {
          const project = state.projects.find((p) => p.id === id)
          if (!project) return state

          const updatedData = { ...project.data, [step]: data }
          const updatedProject = {
            ...project,
            data: updatedData,
            updatedAt: new Date().toISOString(),
          }

          return {
            projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
            currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
          }
        })
      },

      updateProgress: (projectId, step) => {
        const project = get().projects.find((p) => p.id === projectId)
        if (!project) return

        const completedSteps = project.completedSteps.includes(step)
          ? project.completedSteps
          : [...project.completedSteps, step].sort((a, b) => a - b)

        const progress = Math.round((completedSteps.length / 7) * 100)

        get().updateProject(projectId, {
          currentStep: Math.max(project.currentStep, step + 1),
          completedSteps,
          progress,
          status: progress === 100 ? "completed" : "in-progress",
        })

        // Check for step-specific badges
        const badgeMap: Record<number, string> = {
          1: "problem-analyst",
          2: "stakeholder-mapper",
          3: "root-cause-detective",
          4: "solution-architect",
          5: "theory-builder",
          6: "logframe-master",
          7: "impact-measurer",
        }

        if (badgeMap[step]) {
          get().earnBadge(badgeMap[step])
        }

        if (completedSteps.length === 7) {
          get().earnBadge("program-designer")
        }
      },

      earnBadge: (badgeId) => {
        set((state) => {
          if (state.badges.includes(badgeId)) return state
          const newBadges = [...state.badges, badgeId]
          return {
            badges: newBadges,
            user: state.user ? { ...state.user, badges: newBadges } : state.user,
          }
        })
      },
    }),
    {
      name: "shiksha-raha-demo",
    },
  ),
)
