// 1. Capture the DOM Elements
const senderNameInput = document.getElementById('senderName');
const recruiterNameInput = document.getElementById('recruiterName');
const targetCompanyInput = document.getElementById('targetCompany');
const targetRoleInput = document.getElementById('targetRole');
const keySkillsInput = document.getElementById('keySkills');
const messageToneSelect = document.getElementById('messageTone');
const bulletFormatCheck = document.getElementById('bulletFormat'); // Feature 5 Element

const generateBtn = document.getElementById('generateBtn');
const outputMessage = document.getElementById('outputMessage');
const textMetrics = document.getElementById('textMetrics'); // Feature 2 Element
const historyList = document.getElementById('historyList'); // Feature 1 Element

// Action Buttons
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn'); // Feature 4 Element
const searchBtn = document.getElementById('searchBtn'); // Feature 3 Element

// Feature 1: Initialize History Vault on Load
let vault = JSON.parse(localStorage.getItem('outreachVault')) || [];
renderHistory();

// 2. The Core Logic: Generating the Template
generateBtn.addEventListener('click', () => {
    const sender = senderNameInput.value.trim() || '[Your Name]';
    const name = recruiterNameInput.value.trim() || '[Recruiter Name]';
    const company = targetCompanyInput.value.trim() || '[Company]';
    const role = targetRoleInput.value.trim() || '[Role]';
    const tone = messageToneSelect.value;
    
    // Feature 5: Smart Format Toggle Logic
    let rawSkills = keySkillsInput.value.trim() || '[Your Skills]';
    let formattedSkills = rawSkills;
    
    if (bulletFormatCheck.checked && rawSkills !== '[Your Skills]') {
        // Split by commas and create clean bullet points
        const skillsArray = rawSkills.split(',').map(skill => skill.trim());
        formattedSkills = "\n" + skillsArray.map(skill => `• ${skill}`).join("\n") + "\n";
    }

    let generatedText = '';

    // Dynamically construct the expanded template
    switch (tone) {
        case 'student':
            generatedText = `Hi ${name},\n\nI hope you are having a productive week.\n\nI am currently establishing my footprint in the tech industry, focusing heavily on:${formattedSkills}\nI have been closely following ${company}'s recent product innovations and am incredibly impressed by the high engineering standards your team maintains.\n\nAs I look to take the next step in my career, I am very interested in the ${role} position. I would deeply appreciate a brief 10-minute connection to learn more about your engineering culture and how my emerging skill set might add long-term value to ${company}.\n\nRespectfully,\n${sender}`;
            break;
        case 'direct':
            generatedText = `Hi ${name},\n\nI hope this message finds you well.\n\nI noticed that ${company} is currently seeking an exceptionally skilled individual for the ${role} position. Throughout my recent projects, I have specialized heavily in:${formattedSkills}\nI am confident I can step into this role and immediately contribute to bridging the gap between your current bottlenecks and your upcoming objectives.\n\nAre you open to a brief conversation later this week to discuss how my technical expertise fits into ${company}'s broader vision?\n\nBest regards,\n${sender}`;
            break;
        case 'value':
            generatedText = `Hi ${name},\n\nI see ${company} is currently scaling its engineering efforts and actively recruiting for the ${role} position.\n\nIn my experience, scaling teams often face complex challenges regarding performance optimization. I have strategically utilized:${formattedSkills}\n...to architect robust solutions and drive measurable performance improvements. I am eager to apply this same level of engineering rigor to help ${company} achieve its aggressive growth metrics.\n\nI would welcome the opportunity for a brief dialogue regarding the specific technical hurdles the ${role} will tackle.\n\nThank you for your time,\n${sender}`;
            break;
    }

    // Push the constructed text to the UI
    outputMessage.value = generatedText;
    
    // Unlock all action buttons
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    searchBtn.disabled = false;

    // Trigger Smart Metrics & History Save
    updateMetrics(generatedText);
    saveToHistory(role, company, generatedText);
});

// Feature 2: Smart Metrics Engine
function updateMetrics(text) {
    const wordCount = text.trim().split(/\s+/).length;
    // Assuming 200 words per minute average reading speed
    const readingTime = Math.ceil((wordCount / 200) * 60); 
    textMetrics.innerText = `Word Count: ${wordCount} | Est. Reading Time: ${readingTime}s`;
}

// Feature 1: The History Vault Engine
function saveToHistory(role, company, text) {
    const title = `${role} @ ${company}`;
    const newItem = { title, text, date: new Date().toLocaleDateString() };
    
    vault.unshift(newItem); // Add to the beginning of the array
    if (vault.length > 5) vault.pop(); // Keep only the last 5 generations
    
    localStorage.setItem('outreachVault', JSON.stringify(vault));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    if (vault.length === 0) {
        historyList.innerHTML = '<p style="color: var(--text-muted)">No history yet. Generate a message to save it!</p>';
        return;
    }
    
    vault.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-title">${item.title} <span style="font-size:0.8rem; color:var(--text-muted); float:right;">${item.date}</span></div>
            <div class="history-snippet">${item.text.substring(0, 60)}...</div>
        `;
        
        // Reload history item into the editor on click
        div.addEventListener('click', () => {
            outputMessage.value = item.text;
            updateMetrics(item.text);
            copyBtn.disabled = false; 
            downloadBtn.disabled = false; 
            searchBtn.disabled = false;
        });
        historyList.appendChild(div);
    });
}

// Action: Copy to Clipboard
copyBtn.addEventListener('click', async () => {
    if (!outputMessage.value) return;
    try {
        await navigator.clipboard.writeText(outputMessage.value);
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!'; 
        copyBtn.classList.add('success');
        setTimeout(() => { 
            copyBtn.innerText = originalText; 
            copyBtn.classList.remove('success'); 
        }, 2000);
    } catch (err) { 
        alert('Failed to copy to clipboard. Please check permissions.'); 
    }
});

// Feature 4: Export to .TXT
downloadBtn.addEventListener('click', () => {
    const text = outputMessage.value;
    if (!text) return;
    
    // Create a Blob containing the text data
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Outreach_Template_${new Date().getTime()}.txt`;
    a.click();
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
});

// Feature 3: Dynamic LinkedIn Prospecting
searchBtn.addEventListener('click', () => {
    const company = targetCompanyInput.value.trim();
    const role = targetRoleInput.value.trim();
    
    if (!company && !role) {
        alert("Please enter a Target Company and Role to search LinkedIn.");
        return;
    }
    
    // Dynamically encode the search string for LinkedIn's URL structure
    const searchQuery = encodeURIComponent(`${company} ${role} recruiter hiring`);
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${searchQuery}`, '_blank');
});