import { create } from "zustand"
import { persist } from "zustand/middleware"

export const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : "http://127.0.0.1:5000/api"

export interface User {
  id: string
  name: string
  email: string
  organization: string
  role: string
  avatar?: string
  experience: "beginner" | "intermediate" | "expert"
  createdAt: string
  badges: string[]
  token?: string
}

export interface Project {
  id: string // This will map to _id from MongoDB
  name: string
  description: string
  organization: string
  templateId?: string
  status: "draft" | "in-progress" | "review" | "completed"
  currentStep: number
  completedSteps: number[]
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
    geographicScope: {
      state: string
      district: string
      block: string
      cluster: string
    }
    urgency: string
  }
  stakeholders?: Array<{
    id: string
    name: string
    type: "primary" | "secondary" | "key"
    interest: string
    influence: "high" | "medium" | "low"
    expectations: string
    // Practice Mapping fields
    currentPractice?: string
    expectedPractice?: string
    linkedOutcome?: string
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
      alignment?: string
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
  register: (data: Omit<User, "id" | "createdAt" | "badges" | "token">) => Promise<boolean>
  logout: () => void

  // Onboarding
  completeOnboarding: () => void

  // Project actions
  fetchProjects: () => Promise<void>
  createProject: (name: string, description: string, templateId?: string) => Promise<Project | null>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void
  updateProjectData: (id: string, step: keyof ProjectData, data: unknown) => Promise<void>

  // Progress & Gamification
  updateProgress: (projectId: string, step: number) => Promise<void>
  earnBadge: (badgeId: string) => Promise<void>
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
        geographicScope: { state: "", district: "", block: "", cluster: "" },
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
        geographicScope: { state: "", district: "", block: "", cluster: "" },
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
        geographicScope: { state: "", district: "", block: "", cluster: "" },
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
        geographicScope: { state: "", district: "", block: "", cluster: "" },
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
        geographicScope: { state: "", district: "", block: "", cluster: "" },
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

      login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        set({
          user: { ...data, id: data._id },
          badges: data.badges || [],
        })
        get().fetchProjects()
        return true
      },

      register: async (registerData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        set({
          user: { ...data, id: data._id },
          badges: data.badges || [],
        })
        return true
      },

      logout: () => {
        set({ user: null, currentProject: null, projects: [], isOnboarded: false, badges: [] })
      },

      completeOnboarding: () => {
        set({ isOnboarded: true })
      },

      fetchProjects: async () => {
        const { user } = get()
        if (!user?.token) return

        try {
          const res = await fetch(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          if (res.ok) {
            const projects = await res.json()
            const mappedProjects = projects.map((p: any) => ({ ...p, id: p._id }))
            set({ projects: mappedProjects })

            // Retroactive Badge Sync
            // Automatically award badges for steps completed in loaded projects
            // This fixes issues where badges weren't saved in previous sessions
            const { earnBadge } = get()
            const badgeMap: Record<number, string> = {
              1: "problem-analyst",
              2: "stakeholder-mapper",
              3: "root-cause-detective",
              4: "solution-architect",
              5: "theory-builder",
              6: "logframe-master",
              7: "impact-measurer",
            }

            mappedProjects.forEach((p: Project) => {
              // Sync step badges
              p.completedSteps.forEach((step) => {
                const badgeId = badgeMap[step]
                if (badgeId) earnBadge(badgeId)
              })

              // Sync project completion badge
              if (p.completedSteps.length === 7) {
                earnBadge("program-designer")
              }

              // Sync first project badge
              earnBadge("first-project")
            })
          }
        } catch (error) {
          console.error(error)
        }
      },

      createProject: async (name, description, templateId) => {
        const { user } = get()
        if (!user?.token) return null

        const template = TEMPLATES.find((t) => t.id === templateId)

        try {
          const res = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
              name,
              description,
              templateId,
              organization: user.organization || "My Organization",
              data: template?.defaultData || {}
            }),
          })

          if (res.ok) {
            const newProject = await res.json()
            const project = { ...newProject, id: newProject._id }
            set((state) => ({
              projects: [...state.projects, project],
              currentProject: project,
            }))

            // Earn first project badge logic could be moved to backend, but simplified here
            if (get().projects.length === 1) {
              get().earnBadge("first-project")
            }

            return project
          }
        } catch (error) {
          console.error(error)
        }
        return null
      },

      updateProject: async (id, updates) => {
        const { user } = get()
        if (!user?.token) return

        try {
          const res = await fetch(`${API_URL}/projects/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(updates),
          })

          if (res.ok) {
            const updated = await res.json()
            const updatedProject = { ...updated, id: updated._id }

            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === id ? updatedProject : p
              ),
              currentProject:
                state.currentProject?.id === id
                  ? updatedProject
                  : state.currentProject,
            }))
          }
        } catch (error) {
          console.error(error)
        }
      },

      deleteProject: async (id) => {
        const { user } = get()
        if (!user?.token) return

        try {
          await fetch(`${API_URL}/projects/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`
            },
          })

          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
          }))
        } catch (error) {
          console.error(error)
        }
      },

      setCurrentProject: (project) => {
        set({ currentProject: project })
      },

      updateProjectData: async (id, step, data) => {
        // Optimistic update logic + API call
        const { user, projects } = get()
        const project = projects.find(p => p.id === id)
        if (!project) return

        const updatedData = { ...project.data, [step]: data }

        // Optimistically update
        set((state) => {
          const updatedProject = { ...project, data: updatedData, updatedAt: new Date().toISOString() }
          return {
            projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
            currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
          }
        })

        // Sync with backend
        get().updateProject(id, { data: updatedData })
      },

      updateProgress: async (projectId, step) => {
        const project = get().projects.find((p) => p.id === projectId)
        if (!project) return

        const completedSteps = project.completedSteps.includes(step)
          ? project.completedSteps
          : [...project.completedSteps, step].sort((a, b) => a - b)

        const progress = Math.round((completedSteps.length / 7) * 100)

        await get().updateProject(projectId, {
          currentStep: Math.min(Math.max(project.currentStep, step + 1), 7),
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

      earnBadge: async (badgeId) => {
        const { user, badges } = get()
        if (!user?.token) return

        // Check if already earned to avoid duplicate calls
        if (badges.includes(badgeId)) return

        // Optimistic update
        const newBadges = [...badges, badgeId]
        set((state) => ({
          badges: newBadges,
          user: state.user ? { ...state.user, badges: newBadges } : state.user,
        }))

        try {
          await fetch(`${API_URL}/auth/badges`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ badgeId }),
          })
        } catch (error) {
          console.error("Failed to persist badge:", error)
          // Optionally revert state here if strict consistency is needed
        }
      },
    }),
    {
      name: "shiksha-raha-demo",
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
        // We can persist projects too, but fetching on load is safer for sync
      }),
    },
  ),
)
