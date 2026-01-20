const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle } = require('docx');
const ExcelJS = require('exceljs');

/**
 * Generate PDF export of LFA project
 */
async function generatePDF(project, stream) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(stream);

    // Helper function to add section header
    const addSectionHeader = (text) => {
        doc.fontSize(16)
            .fillColor('#2563eb')
            .text(text, { underline: true })
            .moveDown(0.5);
        doc.fillColor('#000000');
    };

    // Helper function to add subsection
    const addSubsection = (title, content) => {
        doc.fontSize(12).font('Helvetica-Bold').text(title, { continued: false });
        doc.fontSize(10).font('Helvetica').text(content || 'Not defined', { align: 'left' });
        doc.moveDown(0.5);
    };

    // Title Page
    doc.fontSize(24)
        .fillColor('#1e40af')
        .text('LOGICAL FRAMEWORK APPROACH', { align: 'center' })
        .moveDown(0.5);

    doc.fontSize(20)
        .fillColor('#000000')
        .text(project.name.toUpperCase(), { align: 'center' })
        .moveDown(2);

    // Project Information
    doc.fontSize(12)
        .text(`Organization: ${project.organization}`)
        .text(`Created: ${new Date(project.createdAt).toLocaleDateString()}`)
        .text(`Last Updated: ${new Date(project.updatedAt).toLocaleDateString()}`)
        .text(`Status: ${project.status}`)
        .moveDown(2);

    doc.addPage();

    // STEP 1: Problem Definition
    addSectionHeader('STEP 1: PROBLEM DEFINITION');
    addSubsection('Central Problem:', project.data.problemDefinition?.centralProblem);
    addSubsection('Context:', project.data.problemDefinition?.context);
    addSubsection('Target Beneficiaries:', project.data.problemDefinition?.targetBeneficiaries);
    addSubsection('Geographic Scope:', project.data.problemDefinition?.geographicScope);
    addSubsection('Urgency Level:', project.data.problemDefinition?.urgency);
    doc.moveDown(1);

    // STEP 2: Stakeholder Analysis
    addSectionHeader('STEP 2: STAKEHOLDER ANALYSIS');
    if (project.data.stakeholders?.length) {
        project.data.stakeholders.forEach((s, i) => {
            doc.fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${s.name} (${s.type})`);
            doc.fontSize(10).font('Helvetica')
                .text(`   Interest: ${s.interest} | Influence: ${s.influence}`)
                .text(`   Expectations: ${s.expectations || 'N/A'}`)
                .moveDown(0.3);
        });
    } else {
        doc.fontSize(10).text('No stakeholders defined');
    }
    doc.moveDown(1);

    doc.addPage();

    // STEP 3: Problem Tree
    addSectionHeader('STEP 3: PROBLEM TREE');
    addSubsection('Central Problem:', project.data.problemTree?.centralProblem);

    if (project.data.problemTree?.causes?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Causes:');
        doc.fontSize(10).font('Helvetica');
        project.data.problemTree.causes.forEach((c, i) => {
            doc.text(`  ${i + 1}. ${c.text}`);
        });
        doc.moveDown(0.5);
    }

    if (project.data.problemTree?.effects?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Effects:');
        doc.fontSize(10).font('Helvetica');
        project.data.problemTree.effects.forEach((e, i) => {
            doc.text(`  ${i + 1}. ${e.text}`);
        });
        doc.moveDown(0.5);
    }
    doc.moveDown(1);

    // STEP 4: Objective Tree
    addSectionHeader('STEP 4: OBJECTIVE TREE');
    addSubsection('Main Objective:', project.data.objectiveTree?.centralObjective);

    if (project.data.objectiveTree?.means?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Means:');
        doc.fontSize(10).font('Helvetica');
        project.data.objectiveTree.means.forEach((m, i) => {
            doc.text(`  ${i + 1}. ${m.text}`);
        });
        doc.moveDown(0.5);
    }

    if (project.data.objectiveTree?.ends?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Ends:');
        doc.fontSize(10).font('Helvetica');
        project.data.objectiveTree.ends.forEach((e, i) => {
            doc.text(`  ${i + 1}. ${e.text}`);
        });
        doc.moveDown(0.5);
    }

    doc.addPage();

    // STEP 5: Results Chain
    addSectionHeader('STEP 5: RESULTS CHAIN (THEORY OF CHANGE)');
    const chainElements = ['inputs', 'activities', 'outputs', 'outcomes'];
    chainElements.forEach((element) => {
        const items = project.data.resultsChain?.[element] || [];
        doc.fontSize(12).font('Helvetica-Bold').text(`${element.charAt(0).toUpperCase() + element.slice(1)}:`);
        doc.fontSize(10).font('Helvetica');
        if (items.length) {
            items.forEach((item, i) => {
                doc.text(`  ${i + 1}. ${item}`);
            });
        } else {
            doc.text('  Not defined');
        }
        doc.moveDown(0.5);
    });
    addSubsection('Impact:', project.data.resultsChain?.impact);

    doc.addPage();

    // STEP 6: Logical Framework Matrix
    addSectionHeader('STEP 6: LOGICAL FRAMEWORK MATRIX');
    const logframe = project.data.logframe;
    if (logframe) {
        addSubsection('Goal - Narrative:', logframe.goal?.narrative);
        addSubsection('Goal - Indicators:', logframe.goal?.indicators?.join(', '));
        doc.moveDown(0.5);

        addSubsection('Purpose - Narrative:', logframe.purpose?.narrative);
        addSubsection('Purpose - Indicators:', logframe.purpose?.indicators?.join(', '));
        doc.moveDown(0.5);

        if (logframe.outputs?.length) {
            doc.fontSize(12).font('Helvetica-Bold').text('Outputs:');
            doc.fontSize(10).font('Helvetica');
            logframe.outputs.forEach((output, i) => {
                doc.text(`  ${i + 1}. ${output.narrative}`);
            });
            doc.moveDown(0.5);
        }

        if (logframe.activities?.length) {
            doc.fontSize(12).font('Helvetica-Bold').text('Activities:');
            doc.fontSize(10).font('Helvetica');
            logframe.activities.forEach((activity, i) => {
                doc.text(`  ${i + 1}. ${activity.narrative}`);
            });
        }
    }

    doc.addPage();

    // STEP 7: Monitoring Framework
    addSectionHeader('STEP 7: MONITORING FRAMEWORK');
    if (project.data.monitoring?.indicators?.length) {
        project.data.monitoring.indicators.forEach((ind, i) => {
            doc.fontSize(11).font('Helvetica-Bold').text(`Indicator ${i + 1}: ${ind.name}`);
            doc.fontSize(10).font('Helvetica')
                .text(`  Baseline: ${ind.baseline || 'N/A'}`)
                .text(`  Target: ${ind.target || 'N/A'}`)
                .text(`  Frequency: ${ind.frequency || 'N/A'}`)
                .text(`  Data Source: ${ind.source || 'N/A'}`)
                .text(`  Responsible: ${ind.responsible || 'N/A'}`)
                .moveDown(0.5);
        });
    } else {
        doc.fontSize(10).text('No indicators defined');
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10)
        .fillColor('#666666')
        .text(`Generated by Shiksha Raha Common LFA Platform - ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();
}

/**
 * Generate DOCX export of LFA project
 */
async function generateDOCX(project) {
    const sections = [];

    // Title
    sections.push(
        new Paragraph({
            text: 'LOGICAL FRAMEWORK APPROACH',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }),
        new Paragraph({
            text: project.name.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );

    // Project Information
    sections.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Organization: ', bold: true }),
                new TextRun(project.organization)
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Created: ', bold: true }),
                new TextRun(new Date(project.createdAt).toLocaleDateString())
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Last Updated: ', bold: true }),
                new TextRun(new Date(project.updatedAt).toLocaleDateString())
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Status: ', bold: true }),
                new TextRun(project.status)
            ],
            spacing: { after: 400 }
        })
    );

    // STEP 1: Problem Definition
    sections.push(
        new Paragraph({
            text: 'STEP 1: PROBLEM DEFINITION',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Central Problem: ', bold: true }),
                new TextRun(project.data.problemDefinition?.centralProblem || 'Not defined')
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Context: ', bold: true }),
                new TextRun(project.data.problemDefinition?.context || 'Not defined')
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Target Beneficiaries: ', bold: true }),
                new TextRun(project.data.problemDefinition?.targetBeneficiaries || 'Not defined')
            ],
            spacing: { after: 100 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Geographic Scope: ', bold: true }),
                new TextRun(project.data.problemDefinition?.geographicScope || 'Not defined')
            ],
            spacing: { after: 100 }
        })
    );

    // STEP 2: Stakeholder Analysis
    sections.push(
        new Paragraph({
            text: 'STEP 2: STAKEHOLDER ANALYSIS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        })
    );

    if (project.data.stakeholders?.length) {
        project.data.stakeholders.forEach((s, i) => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${i + 1}. ${s.name} (${s.type})`, bold: true })
                    ],
                    spacing: { after: 50 }
                }),
                new Paragraph({
                    text: `   Interest: ${s.interest} | Influence: ${s.influence}`,
                    spacing: { after: 50 }
                }),
                new Paragraph({
                    text: `   Expectations: ${s.expectations || 'N/A'}`,
                    spacing: { after: 100 }
                })
            );
        });
    } else {
        sections.push(new Paragraph({ text: 'No stakeholders defined', spacing: { after: 200 } }));
    }

    // STEP 3: Problem Tree
    sections.push(
        new Paragraph({
            text: 'STEP 3: PROBLEM TREE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Central Problem: ', bold: true }),
                new TextRun(project.data.problemTree?.centralProblem || 'Not defined')
            ],
            spacing: { after: 200 }
        })
    );

    if (project.data.problemTree?.causes?.length) {
        sections.push(new Paragraph({ text: 'Causes:', bold: true, spacing: { after: 100 } }));
        project.data.problemTree.causes.forEach((c, i) => {
            sections.push(new Paragraph({ text: `  ${i + 1}. ${c.text}`, spacing: { after: 50 } }));
        });
    }

    if (project.data.problemTree?.effects?.length) {
        sections.push(new Paragraph({ text: 'Effects:', bold: true, spacing: { before: 200, after: 100 } }));
        project.data.problemTree.effects.forEach((e, i) => {
            sections.push(new Paragraph({ text: `  ${i + 1}. ${e.text}`, spacing: { after: 50 } }));
        });
    }

    // STEP 4: Objective Tree
    sections.push(
        new Paragraph({
            text: 'STEP 4: OBJECTIVE TREE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Main Objective: ', bold: true }),
                new TextRun(project.data.objectiveTree?.centralObjective || 'Not defined')
            ],
            spacing: { after: 200 }
        })
    );

    if (project.data.objectiveTree?.means?.length) {
        sections.push(new Paragraph({ text: 'Means:', bold: true, spacing: { after: 100 } }));
        project.data.objectiveTree.means.forEach((m, i) => {
            sections.push(new Paragraph({ text: `  ${i + 1}. ${m.text}`, spacing: { after: 50 } }));
        });
    }

    if (project.data.objectiveTree?.ends?.length) {
        sections.push(new Paragraph({ text: 'Ends:', bold: true, spacing: { before: 200, after: 100 } }));
        project.data.objectiveTree.ends.forEach((e, i) => {
            sections.push(new Paragraph({ text: `  ${i + 1}. ${e.text}`, spacing: { after: 50 } }));
        });
    }

    // STEP 5: Results Chain
    sections.push(
        new Paragraph({
            text: 'STEP 5: RESULTS CHAIN (THEORY OF CHANGE)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        })
    );

    const chainElements = ['inputs', 'activities', 'outputs', 'outcomes'];
    chainElements.forEach((element) => {
        const items = project.data.resultsChain?.[element] || [];
        sections.push(new Paragraph({ text: `${element.charAt(0).toUpperCase() + element.slice(1)}:`, bold: true, spacing: { after: 100 } }));
        if (items.length) {
            items.forEach((item, i) => {
                sections.push(new Paragraph({ text: `  ${i + 1}. ${item}`, spacing: { after: 50 } }));
            });
        } else {
            sections.push(new Paragraph({ text: '  Not defined', spacing: { after: 100 } }));
        }
    });

    sections.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Impact: ', bold: true }),
                new TextRun(project.data.resultsChain?.impact || 'Not defined')
            ],
            spacing: { before: 200, after: 200 }
        })
    );

    // STEP 6: Logical Framework Matrix
    sections.push(
        new Paragraph({
            text: 'STEP 6: LOGICAL FRAMEWORK MATRIX',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        })
    );

    const logframe = project.data.logframe;
    if (logframe) {
        // Create logframe table
        const logframeRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: 'Level', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Narrative Summary', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Indicators', bold: true })] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Goal')] }),
                    new TableCell({ children: [new Paragraph(logframe.goal?.narrative || '-')] }),
                    new TableCell({ children: [new Paragraph(logframe.goal?.indicators?.join(', ') || '-')] })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Purpose')] }),
                    new TableCell({ children: [new Paragraph(logframe.purpose?.narrative || '-')] }),
                    new TableCell({ children: [new Paragraph(logframe.purpose?.indicators?.join(', ') || '-')] })
                ]
            })
        ];

        if (logframe.outputs?.length) {
            logframe.outputs.forEach((output, i) => {
                logframeRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(`Output ${i + 1}`)] }),
                            new TableCell({ children: [new Paragraph(output.narrative || '-')] }),
                            new TableCell({ children: [new Paragraph(output.indicators?.join(', ') || '-')] })
                        ]
                    })
                );
            });
        }

        sections.push(
            new Table({
                rows: logframeRows,
                width: { size: 100, type: WidthType.PERCENTAGE }
            })
        );
    }

    // STEP 7: Monitoring Framework
    sections.push(
        new Paragraph({
            text: 'STEP 7: MONITORING FRAMEWORK',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
        })
    );

    if (project.data.monitoring?.indicators?.length) {
        project.data.monitoring.indicators.forEach((ind, i) => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `Indicator ${i + 1}: `, bold: true }),
                        new TextRun(ind.name)
                    ],
                    spacing: { after: 50 }
                }),
                new Paragraph({ text: `  Baseline: ${ind.baseline || 'N/A'}`, spacing: { after: 50 } }),
                new Paragraph({ text: `  Target: ${ind.target || 'N/A'}`, spacing: { after: 50 } }),
                new Paragraph({ text: `  Frequency: ${ind.frequency || 'N/A'}`, spacing: { after: 50 } }),
                new Paragraph({ text: `  Data Source: ${ind.source || 'N/A'}`, spacing: { after: 50 } }),
                new Paragraph({ text: `  Responsible: ${ind.responsible || 'N/A'}`, spacing: { after: 200 } })
            );
        });
    } else {
        sections.push(new Paragraph({ text: 'No indicators defined', spacing: { after: 200 } }));
    }

    // Footer
    sections.push(
        new Paragraph({
            text: `Generated by Shiksha Raha Common LFA Platform - ${new Date().toLocaleString()}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 }
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: sections
        }]
    });

    return await Packer.toBuffer(doc);
}

/**
 * Generate Excel export of LFA project
 */
async function generateExcel(project) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Shiksha Raha Common LFA Platform';
    workbook.created = new Date();

    // Overview Sheet
    const overviewSheet = workbook.addWorksheet('Overview');
    overviewSheet.columns = [
        { header: 'Field', key: 'field', width: 30 },
        { header: 'Value', key: 'value', width: 60 }
    ];

    overviewSheet.addRows([
        { field: 'Project Name', value: project.name },
        { field: 'Organization', value: project.organization },
        { field: 'Status', value: project.status },
        { field: 'Created', value: new Date(project.createdAt).toLocaleDateString() },
        { field: 'Last Updated', value: new Date(project.updatedAt).toLocaleDateString() },
        { field: '', value: '' },
        { field: 'Central Problem', value: project.data.problemDefinition?.centralProblem || 'Not defined' },
        { field: 'Context', value: project.data.problemDefinition?.context || 'Not defined' },
        { field: 'Target Beneficiaries', value: project.data.problemDefinition?.targetBeneficiaries || 'Not defined' },
        { field: 'Geographic Scope', value: project.data.problemDefinition?.geographicScope || 'Not defined' }
    ]);

    // Style header row
    overviewSheet.getRow(1).font = { bold: true, size: 12 };
    overviewSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    overviewSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Stakeholders Sheet
    const stakeholdersSheet = workbook.addWorksheet('Stakeholders');
    stakeholdersSheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Type', key: 'type', width: 20 },
        { header: 'Interest', key: 'interest', width: 15 },
        { header: 'Influence', key: 'influence', width: 15 },
        { header: 'Expectations', key: 'expectations', width: 40 }
    ];

    if (project.data.stakeholders?.length) {
        stakeholdersSheet.addRows(project.data.stakeholders);
    }

    stakeholdersSheet.getRow(1).font = { bold: true, size: 12 };
    stakeholdersSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    stakeholdersSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Problem Tree Sheet
    const problemTreeSheet = workbook.addWorksheet('Problem Tree');
    problemTreeSheet.columns = [
        { header: 'Type', key: 'type', width: 20 },
        { header: 'Description', key: 'description', width: 60 }
    ];

    problemTreeSheet.addRow({ type: 'Central Problem', description: project.data.problemTree?.centralProblem || 'Not defined' });
    problemTreeSheet.addRow({ type: '', description: '' });

    if (project.data.problemTree?.causes?.length) {
        problemTreeSheet.addRow({ type: 'CAUSES', description: '' });
        project.data.problemTree.causes.forEach((c) => {
            problemTreeSheet.addRow({ type: 'Cause', description: c.text });
        });
        problemTreeSheet.addRow({ type: '', description: '' });
    }

    if (project.data.problemTree?.effects?.length) {
        problemTreeSheet.addRow({ type: 'EFFECTS', description: '' });
        project.data.problemTree.effects.forEach((e) => {
            problemTreeSheet.addRow({ type: 'Effect', description: e.text });
        });
    }

    problemTreeSheet.getRow(1).font = { bold: true, size: 12 };
    problemTreeSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    problemTreeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Objective Tree Sheet
    const objectiveTreeSheet = workbook.addWorksheet('Objective Tree');
    objectiveTreeSheet.columns = [
        { header: 'Type', key: 'type', width: 20 },
        { header: 'Description', key: 'description', width: 60 }
    ];

    objectiveTreeSheet.addRow({ type: 'Main Objective', description: project.data.objectiveTree?.centralObjective || 'Not defined' });
    objectiveTreeSheet.addRow({ type: '', description: '' });

    if (project.data.objectiveTree?.means?.length) {
        objectiveTreeSheet.addRow({ type: 'MEANS', description: '' });
        project.data.objectiveTree.means.forEach((m) => {
            objectiveTreeSheet.addRow({ type: 'Mean', description: m.text });
        });
        objectiveTreeSheet.addRow({ type: '', description: '' });
    }

    if (project.data.objectiveTree?.ends?.length) {
        objectiveTreeSheet.addRow({ type: 'ENDS', description: '' });
        project.data.objectiveTree.ends.forEach((e) => {
            objectiveTreeSheet.addRow({ type: 'End', description: e.text });
        });
    }

    objectiveTreeSheet.getRow(1).font = { bold: true, size: 12 };
    objectiveTreeSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    objectiveTreeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Results Chain Sheet
    const resultsChainSheet = workbook.addWorksheet('Results Chain');
    resultsChainSheet.columns = [
        { header: 'Stage', key: 'stage', width: 20 },
        { header: 'Item', key: 'item', width: 60 }
    ];

    const chainElements = ['inputs', 'activities', 'outputs', 'outcomes'];
    chainElements.forEach((element) => {
        const items = project.data.resultsChain?.[element] || [];
        resultsChainSheet.addRow({ stage: element.toUpperCase(), item: '' });
        if (items.length) {
            items.forEach((item) => {
                resultsChainSheet.addRow({ stage: '', item });
            });
        } else {
            resultsChainSheet.addRow({ stage: '', item: 'Not defined' });
        }
        resultsChainSheet.addRow({ stage: '', item: '' });
    });

    resultsChainSheet.addRow({ stage: 'IMPACT', item: project.data.resultsChain?.impact || 'Not defined' });

    resultsChainSheet.getRow(1).font = { bold: true, size: 12 };
    resultsChainSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    resultsChainSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Logical Framework Sheet
    const logframeSheet = workbook.addWorksheet('Logical Framework');
    logframeSheet.columns = [
        { header: 'Level', key: 'level', width: 15 },
        { header: 'Narrative Summary', key: 'narrative', width: 40 },
        { header: 'Indicators', key: 'indicators', width: 40 },
        { header: 'Means of Verification', key: 'mov', width: 30 },
        { header: 'Assumptions', key: 'assumptions', width: 30 }
    ];

    const logframe = project.data.logframe;
    if (logframe) {
        logframeSheet.addRow({
            level: 'Goal',
            narrative: logframe.goal?.narrative || '-',
            indicators: logframe.goal?.indicators?.join(', ') || '-',
            mov: logframe.goal?.mov?.join(', ') || '-',
            assumptions: logframe.goal?.assumptions?.join(', ') || '-'
        });

        logframeSheet.addRow({
            level: 'Purpose',
            narrative: logframe.purpose?.narrative || '-',
            indicators: logframe.purpose?.indicators?.join(', ') || '-',
            mov: logframe.purpose?.mov?.join(', ') || '-',
            assumptions: logframe.purpose?.assumptions?.join(', ') || '-'
        });

        if (logframe.outputs?.length) {
            logframe.outputs.forEach((output, i) => {
                logframeSheet.addRow({
                    level: `Output ${i + 1}`,
                    narrative: output.narrative || '-',
                    indicators: output.indicators?.join(', ') || '-',
                    mov: output.mov?.join(', ') || '-',
                    assumptions: output.assumptions?.join(', ') || '-'
                });
            });
        }
    }

    logframeSheet.getRow(1).font = { bold: true, size: 12 };
    logframeSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    logframeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Monitoring Framework Sheet
    const monitoringSheet = workbook.addWorksheet('Monitoring Framework');
    monitoringSheet.columns = [
        { header: 'Indicator', key: 'name', width: 30 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Baseline', key: 'baseline', width: 20 },
        { header: 'Target', key: 'target', width: 20 },
        { header: 'Frequency', key: 'frequency', width: 15 },
        { header: 'Data Source', key: 'source', width: 25 },
        { header: 'Responsible', key: 'responsible', width: 25 }
    ];

    if (project.data.monitoring?.indicators?.length) {
        monitoringSheet.addRows(project.data.monitoring.indicators);
    }

    monitoringSheet.getRow(1).font = { bold: true, size: 12 };
    monitoringSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
    };
    monitoringSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    return await workbook.xlsx.writeBuffer();
}

module.exports = {
    generatePDF,
    generateDOCX,
    generateExcel
};
