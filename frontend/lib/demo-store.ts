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

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  stepId: number
  createdAt: string
}

export interface TeamMember {
  id: string // userId
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  avatar?: string
  status: "active" | "pending"
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
  // Collaboration & Insights
  comments: Comment[]
  team: TeamMember[]
  timeSpent: number // in minutes
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
    systemLevel?: string
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

// Organization Level Members
export interface OrganizationMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer"
  status: "active" | "invited"
  joinedAt: string
}


// Community Forum
export interface DiscussionReply {
  id: string
  discussionId: string
  author: string
  avatar: string
  content: string
  timestamp: string
}

export interface Discussion {
  id: string
  title: string
  content: string
  author: string
  avatar: string
  category: "General" | "Best Practices" | "Support" | "Resource Sharing"
  replies: number
  likes: number
  timestamp: string
  tags: string[]
  repliesList?: DiscussionReply[]
}

interface DemoStore {
  user: User | null
  projects: Project[]
  currentProject: Project | null
  isOnboarded: boolean
  badges: string[]

  // Organization Team
  organizationMembers: OrganizationMember[]
  inviteOrganizationMember: (email: string, role: OrganizationMember["role"]) => void

  // Community
  discussions: Discussion[]
  addDiscussion: (discussion: Omit<Discussion, "id" | "author" | "avatar" | "replies" | "likes" | "timestamp">) => void
  addDiscussionReply: (discussionId: string, content: string) => void

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

  // Collaboration Actions
  addComment: (projectId: string, comment: Omit<Comment, "id" | "createdAt" | "userId" | "userName">) => void
  inviteTeamMember: (projectId: string, email: string, role: TeamMember["role"]) => void
  trackTime: (projectId: string, minutes: number) => void
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
      organizationMembers: [],

      // Initial Seed Data for Community
      discussions: [
        {
          id: "1",
          title: "Best indicators for Girls' Education programs?",
          content: "I'm looking for standard indicators...",
          author: "Elena R.",
          avatar: "ER",
          category: "Best Practices",
          replies: 12,
          likes: 45,
          timestamp: "2 hours ago",
          tags: ["Indicators", "Gender", "Education"]
        },
        {
          id: "2",
          title: "How to handle 'Assumptions' that turn out to be false mid-project?",
          content: "We assumed political stability...",
          author: "David K.",
          avatar: "DK",
          category: "Support",
          replies: 8,
          likes: 32,
          timestamp: "5 hours ago",
          tags: ["Risk Management", "LFA"]
        },
        {
          id: "3",
          title: "Sharing my template for Teacher Training workshops",
          content: "Here is a PDF link...",
          author: "Sarah J.",
          avatar: "SJ",
          category: "Resource Sharing",
          replies: 24,
          likes: 89,
          timestamp: "1 day ago",
          tags: ["Template", "Teachers"]
        },
      ],

      addDiscussion: (data) => {
        const { user } = get()
        const newDiscussion: Discussion = {
          id: crypto.randomUUID(),
          ...data,
          author: user?.name || "Guest User",
          avatar: user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "GU",
          replies: 0,
          likes: 0,
          timestamp: "Just now"
        }

        set((state) => ({
          discussions: [newDiscussion, ...state.discussions]
        }))
      },

      addDiscussionReply: (discussionId, content) => {
        const { user, discussions } = get()
        const discussion = discussions.find((d) => d.id === discussionId)
        if (!discussion) return

        const newReply: DiscussionReply = {
          id: crypto.randomUUID(),
          discussionId,
          author: user?.name || "Guest User",
          avatar: user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "GU",
          content,
          timestamp: "Just now"
        }

        const updatedDiscussion = {
          ...discussion,
          replies: discussion.replies + 1,
          repliesList: [...(discussion.repliesList || []), newReply]
        }

        set((state) => ({
          discussions: state.discussions.map((d) => d.id === discussionId ? updatedDiscussion : d)
        }))
      },

      inviteOrganizationMember: (email, role) => {
        const newMember: OrganizationMember = {
          id: crypto.randomUUID(),
          name: email.split('@')[0], // Placeholder name
          email,
          role,
          status: "invited",
          joinedAt: new Date().toISOString()
        }

        set((state) => ({
          organizationMembers: [...state.organizationMembers, newMember]
        }))
      },

      login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        const currentUser = { ...data, id: data._id }

        // Initialize organization members with just the current user if empty
        // In a real app, this would come from the backend organization data
        const initialMembers: OrganizationMember[] = [{
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: "Admin",
          status: "active",
          joinedAt: currentUser.createdAt || new Date().toISOString()
        }]

        set({
          user: currentUser,
          badges: data.badges || [],
          organizationMembers: initialMembers
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
              data: template?.defaultData || {},
              comments: [], // Initialize empty
              team: [{ // Add creator as owner
                id: user.id,
                name: user.name,
                email: user.email,
                role: "owner",
                status: "active",
                avatar: user.avatar
              }],
              timeSpent: 0
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

      addComment: (projectId, commentData) => {
        const { user, projects } = get()
        if (!user) return

        const newComment: Comment = {
          id: crypto.randomUUID(),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          createdAt: new Date().toISOString(),
          ...commentData
        }

        const project = projects.find(p => p.id === projectId)
        if (!project) return

        const updatedProject = {
          ...project,
          comments: [...(project.comments || []), newComment]
        }

        // Optimistic update
        set((state) => ({
          projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
          currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject
        }))

        // Sync with backend (mocked for now as we don't have this endpoint yet)
        // In real app: api.post(`/projects/${projectId}/comments`, newComment)
      },

      inviteTeamMember: (projectId, email, role) => {
        const { projects } = get()
        const project = projects.find(p => p.id === projectId)
        if (!project) return

        const newMember: TeamMember = {
          id: crypto.randomUUID(), // Mock ID until they register
          name: email.split('@')[0], // Mock name
          email,
          role,
          status: 'pending'
        }

        const updatedProject = {
          ...project,
          team: [...(project.team || []), newMember]
        }

        set((state) => ({
          projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
          currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject
        }))
      },

      trackTime: (projectId, minutes) => {
        const { projects } = get()
        const project = projects.find(p => p.id === projectId)
        if (!project) return

        const updatedProject = {
          ...project,
          timeSpent: (project.timeSpent || 0) + minutes
        }

        set((state) => ({
          projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
          currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject
        }))
      }
    }),
    {
      name: "shiksha-raha-demo",
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
        organizationMembers: state.organizationMembers,
        discussions: state.discussions,
        badges: state.badges,
        // We can persist projects too, but fetching on load is safer for sync
      }),
    },
  ),
)