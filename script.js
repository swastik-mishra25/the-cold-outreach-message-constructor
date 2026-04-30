// 1. Capture the DOM Elements
const senderNameInput = document.getElementById('senderName');
const recruiterNameInput = document.getElementById('recruiterName');
const targetCompanyInput = document.getElementById('targetCompany');
const targetRoleInput = document.getElementById('targetRole');
const keySkillsInput = document.getElementById('keySkills');
const messageToneSelect = document.getElementById('messageTone');

const generateBtn = document.getElementById('generateBtn');
const outputMessage = document.getElementById('outputMessage');
const copyBtn = document.getElementById('copyBtn');

// 2. The Core Logic: Generating the Template
generateBtn.addEventListener('click', () => {
    // Extract values, providing strict fallbacks to prevent 'undefined'
    const sender = senderNameInput.value.trim() || '[Your Name]';
    const name = recruiterNameInput.value.trim() || '[Recruiter Name]';
    const company = targetCompanyInput.value.trim() || '[Company]';
    const role = targetRoleInput.value.trim() || '[Role]';
    const skills = keySkillsInput.value.trim() || '[Your Skills]';
    const tone = messageToneSelect.value;

    let generatedText = '';

    // Dynamically construct the expanded template based on the selected strategy
    switch (tone) {
        case 'student': // Emerging Talent (Expanded)
            generatedText = `Hi ${name},\n\nI hope you are having a productive week.\n\nI am currently establishing my footprint in the tech industry and have been actively expanding my expertise, focusing heavily on ${skills}. I have been closely following ${company}'s recent product innovations and market growth, and I am incredibly impressed by the high engineering standards and culture your team maintains.\n\nAs I look to take the next step in my career, I am very interested in the ${role} position currently open at ${company}. I am eager to bring my foundational knowledge, strong work ethic, and adaptability to a forward-thinking environment.\n\nI would deeply appreciate a brief 10-minute connection to learn more about your engineering culture, the specific challenges your team is tackling, and how my emerging skill set might add long-term value to ${company}.\n\nRespectfully,\n${sender}`;
            break;

        case 'direct': // Opportunity Inquiry (Expanded)
            generatedText = `Hi ${name},\n\nI hope this message finds you well.\n\nI noticed that ${company} is currently seeking an exceptionally skilled individual for the ${role} position. After reviewing the core responsibilities, I am confident that my background aligns perfectly with the strategic direction of your engineering team.\n\nThroughout my recent projects, I have specialized heavily in ${skills}, focusing on delivering scalable, high-performance solutions. I believe I can step into this role and immediately contribute to bridging the gap between your current bottlenecks and your upcoming quarterly objectives.\n\nAre you open to a brief conversation later this week? I would love to discuss how my technical expertise fits into ${company}'s broader vision for this role and how we can drive results together.\n\nBest regards,\n${sender}`;
            break;

        case 'value': // Value Proposition (Expanded)
            generatedText = `Hi ${name},\n\nI see ${company} is currently scaling its engineering efforts and actively recruiting for the ${role} position.\n\nIn my experience, rapidly scaling teams often face complex challenges regarding performance optimization and seamless product delivery. In my previous work, I strategically utilized ${skills} to architect robust solutions, driving measurable performance improvements and significantly enhancing the overall user experience. I am eager to apply this same level of engineering rigor and architectural problem-solving to help ${company} achieve its aggressive growth metrics.\n\nI would welcome the opportunity for a brief dialogue regarding the specific technical hurdles the ${role} will be responsible for mitigating, and to outline exactly how my skill set can accelerate your team's roadmap.\n\nThank you for your time and consideration,\n${sender}`;
            break;

        default:
            generatedText = `Hi ${name},\n\nI am reaching out to formally express my interest regarding the ${role} role at ${company}.\n\nWith a strong background in ${skills}, I am eager to learn more about your team's objectives.\n\nBest regards,\n${sender}`;
    }

    // Push the constructed text to the UI and unlock the copy functionality
    outputMessage.value = generatedText;
    copyBtn.disabled = false;
});

// 3. The UX Enhancement: Async Clipboard API
copyBtn.addEventListener('click', async () => {
    const textToCopy = outputMessage.value;
    
    if (!textToCopy) return;

    try {
        await navigator.clipboard.writeText(textToCopy);
        
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        copyBtn.classList.add('success');

        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.classList.remove('success');
        }, 2000);

    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard. Please check your browser permissions.');
    }
});