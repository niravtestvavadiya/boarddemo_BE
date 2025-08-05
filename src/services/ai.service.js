
import openai from '../config/openai.js';


function jsonSchemaPrompt(schema) {
    return `
You are an assistant that MUST output _only_ valid JSON matching this exact schema:
${JSON.stringify(schema, null, 2)}

Strict rules:
1. Output only the JSON object or array, nothing else.
2. Do NOT wrap in markdown or code fences.
3. If a field cannot be determined, set it to an empty array / empty string / 0 as appropriate.
4. Do NOT output any explanatory text or whitespace beyond JSON.
`;
}

function extractJSON(raw) {
    try {
        const trimmed = raw
            .trim()
            .replace(/^```(?:json)?/, '')
            .replace(/```$/, '')
            .trim();
        return JSON.parse(trimmed);
    } catch (err) {
        console.error('Failed to parse JSON:', err);
        throw new Error('Failed to parse AI response');
    }
}

export async function generateProjectDescription(req, res) {
    const { title, industry } = req.body;
    if (!title || !industry) {
        return res.status(400).json({ error: 'Title and industry are required.' });
    }
    const schema = { description: 'string' };
    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: jsonSchemaPrompt(schema) },
            { role: 'user', content: `Project name: "${title}", industry/use-case: "${industry}". Generate a brief description.` }
        ]
    });

    const raw = resp.choices[0].message.content
    const answer = extractJSON(raw);

    return res.status(200).json({
        description: answer.description
    });
}

export async function predictTechStack(req, res) {
    const { description } = req.body;

    const schema = { techStack: ['string'] };
    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: jsonSchemaPrompt(schema) },
            { role: 'user', content: `Description: "${description}". List the optimal tech stack as a JSON array of strings.` }
        ]
    });

    const raw = resp.choices[0].message.content
    const answer = extractJSON(raw);
    return res.status(200).json({
        techStack: answer.techStack
    });
}

export async function estimateTimeline(req, res) {
    const { techStack, developers, hoursPerDev } = req.body;

    const schema = {
        timeline: [
            {
                milestone: "string",
                durationDays: "number"
            }
        ]
    };


    const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: jsonSchemaPrompt(schema) },
            { role: 'user', content: `Given tech stack ${JSON.stringify(techStack)}, ${developers} developers @ ${hoursPerDev}h/day, provide a rough project timeline as an array of { milestone, durationDays }.` }
        ]
    });

    const raw = resp.choices[0].message.content
    const answer = extractJSON(raw);

    return res.status(200).json({
        timelineDays: answer.timeline
    });
}
