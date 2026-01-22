const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    templateId: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'in-progress', 'review', 'completed'],
        default: 'draft'
    },
    currentStep: {
        type: Number,
        default: 1
    },
    completedSteps: [{
        type: Number
    }],
    progress: {
        type: Number,
        default: 0
    },
    badges: [{
        type: String
    }],
    data: {
        problemDefinition: {
            centralProblem: String,
            context: String,
            targetBeneficiaries: String,
            geographicScope: {
                state: String,
                district: String,
                block: String,
                cluster: String
            },
            urgency: String
        },
        stakeholders: [{
            id: String,
            name: String,
            type: { type: String, enum: ['primary', 'secondary', 'key'] },
            interest: String,
            influence: { type: String, enum: ['high', 'medium', 'low'] },
            expectations: String
        }],
        problemTree: {
            centralProblem: String,
            causes: [{ id: String, text: String, parentId: String }],
            effects: [{ id: String, text: String, parentId: String }]
        },
        objectiveTree: {
            centralObjective: String,
            means: [{ id: String, text: String, parentId: String }],
            ends: [{ id: String, text: String, parentId: String }]
        },
        resultsChain: {
            inputs: [String],
            activities: [String],
            outputs: [String],
            outcomes: [String],
            impact: String
        },
        logframe: {
            goal: { narrative: String, indicators: [String], mov: [String], assumptions: [String] },
            purpose: { narrative: String, indicators: [String], mov: [String], assumptions: [String] },
            outputs: [{ narrative: String, indicators: [String], mov: [String], assumptions: [String] }],
            activities: [{ narrative: String, inputs: [String], timeline: String, responsible: String }]
        },
        monitoring: {
            indicators: [{
                id: String,
                name: String,
                type: { type: String, enum: ['output', 'outcome', 'impact'] },
                baseline: String,
                target: String,
                frequency: String,
                source: String,
                responsible: String
            }],
            dataCollection: String,
            reportingSchedule: String
        }
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
