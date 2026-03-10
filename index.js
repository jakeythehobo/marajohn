document.addEventListener('DOMContentLoaded', () => {
    const output = document.querySelector('.terminal-output');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalInput = document.getElementById('terminal-input');
    const inputWrapper = document.querySelector('.input-wrapper');
    const navLinks = document.querySelectorAll('.terminal-nav a');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingOutput = document.getElementById('loading-output');
    const mainHeader = document.querySelector('.terminal-header');
    const mainContent = document.querySelector('main.terminal-container');
    const mainFooter = document.querySelector('.terminal-footer');
    const dateLine = document.getElementById('date-line');
    const timeLine = document.getElementById('time-line');
    const footerText = document.getElementById('footer-text');

    const updateDateTime = () => {
        const now = new Date();
        const year = now.getUTCFullYear() + 768;
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');

        if (dateLine) {
            dateLine.textContent = `DATE: ${year}.${month}.${day}`;
        }
        if (timeLine) {
            timeLine.textContent = `TIME: ${hours}:${minutes} ErseTC`;
        }
        if (footerText) {
            footerText.textContent = `© ${year} UNITED ERSE SPACE COUNCIL - MARAJOHN AEROSPACE`;
        }
    };

    let isAutoScrolling = true;

    const addLine = (container, text, type = 'normal') => {
        const line = document.createElement('div');
        line.className = 'line';
        if (type === 'highlight') line.classList.add('highlight');
        if (type === 'critical') line.classList.add('critical');
        if (type === 'user-cmd') line.classList.add('user-cmd');
        line.textContent = text;
        container.appendChild(line);

        // Scroll to the bottom of the output
        if (isAutoScrolling) {
            const terminalOutput = container.closest('.terminal-output');
            if (terminalOutput) {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }

        return line;
    };

    const clearTerminal = () => {
        if (terminalHistory) {
            terminalHistory.innerHTML = '';
            isAutoScrolling = true;
        }
    };

    const logout = async () => {
        // Clear history immediately
        clearTerminal();

        // Hide terminal and show login sequence again
        mainHeader.style.display = 'none';
        mainContent.style.display = 'none';
        mainFooter.style.display = 'none';

        loadingScreen.style.display = 'flex';
        loadingOutput.innerHTML = '';

        await runLoading(true); // pass true to indicate a re-login
    };

    const processCommand = (cmd) => {
        const action = cmd.toUpperCase().trim();
        if (!action) return;

        if (action === 'HELP') {
            displayHelp();
            return;
        }

        if (action === 'CLEAR') {
            clearTerminal();
            return;
        }

        if (action === 'LOGOUT') {
            logout().catch(err => {
                console.error("Logout failed:", err);
            });
            return;
        }

        addLine(terminalHistory, `> ${action}`, 'user-cmd');

        setTimeout(() => {
            if (action.includes('MISSION') || action.includes('LOGS')) {
                displayMissionLogs();
            } else if (action.includes('PERSONNEL')) {
                addLine(terminalHistory, `[ERROR] ACCESS DENIED.`, 'critical');
            } else if (action.includes('SYSTEMS')) {
                displaySystems();
            } else {
                addLine(terminalHistory, `[UNKNOWN COMMAND]: ${action}`, 'normal');
            }
        }, 300);
    };

    const displayHelp = () => {
        addLine(terminalHistory, '--- AVAILABLE COMMANDS ---', 'user-cmd');
        addLine(terminalHistory, 'MISSION LOGS : DISPLAY MISSION RECORD HISTORY', 'user-cmd');
        addLine(terminalHistory, 'PERSONNEL    : ACCESS PERSONNEL DATA (RESTRICTED)', 'user-cmd');
        addLine(terminalHistory, 'SYSTEMS      : SHIP DIAGNOSTICS AND STATUS', 'user-cmd');
        addLine(terminalHistory, 'CLEAR        : WIPE TERMINAL HISTORY', 'user-cmd');
        addLine(terminalHistory, 'LOGOUT       : TERMINATE SESSION', 'user-cmd');
        addLine(terminalHistory, 'HELP         : DISPLAY THIS MENU', 'user-cmd');
        addLine(terminalHistory, '--------------------------', 'user-cmd');
        addLine(terminalHistory, 'SHORTCUT: CTRL + L TO CLEAR TERMINAL', 'user-cmd');

        // Auto-scroll logic
        if (isAutoScrolling) {
            const terminalOutput = terminalHistory.closest('.terminal-output');
            if (terminalOutput) {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }
    };

    const displaySystems = () => {
        addLine(terminalHistory, '--- INITIALIZING SYSTEM DIAGNOSTICS ---', 'highlight');
        addLine(terminalHistory, 'LOCATION: OOP NORF SYSTEM // SECTOR 04', 'normal');

        const systemsData = [
            {
                name: 'LIFE SUPPORT',
                status: 'DEGRADED',
                capacity: 87,
                diag: 'O2 SCRUBBERS AT 42% EFFICIENCY. CO2 LEVELS RISING.',
                state: 'degraded'
            },
            {
                name: 'POWER GRID',
                status: 'CRITICAL',
                capacity: 31,
                diag: 'REACTOR CORE INSTABILITY DETECTED. COOLANT LEAK IN SECTOR 7.',
                state: 'critical'
            },
            {
                name: 'SECURITY',
                status: 'OFFLINE',
                capacity: 0,
                diag: 'GRID BREACH IN PROGRESS. EXTERNAL ACCESS DETECTED.',
                state: 'critical'
            },
            {
                name: 'NAVIGATION',
                status: 'DEGRADED',
                capacity: 64,
                diag: 'OFF-AXIS DRIFT DETECTED. ASTROMETRICS SYNC LOST.',
                state: 'degraded'
            },
            {
                name: 'COMMS',
                status: 'OFFLINE',
                capacity: 12,
                diag: 'SIGNAL CORRUPTION DETECTED. SUBSPACE ARRAY UNRESPONSIVE.',
                state: 'offline'
            },
            {
                name: 'DEFENSE',
                status: 'CRITICAL',
                capacity: 0,
                diag: 'SENTRY TURRETS NO RESPONSE. ARMORY ACCESS REVOKED.',
                state: 'critical'
            }
        ];

        const grid = document.createElement('div');
        grid.className = 'systems-grid';

        systemsData.forEach(sys => {
            const panel = document.createElement('div');
            panel.className = 'system-panel';

            const header = document.createElement('div');
            header.className = 'system-header';
            header.innerHTML = `<span>${sys.name}</span><span class="status ${sys.state}">${sys.status}</span>`;

            const data = document.createElement('div');
            data.className = 'system-data';
            data.textContent = `CAPACITY: ${sys.capacity}%`;

            const barContainer = document.createElement('div');
            barContainer.className = 'system-bar-container';
            const bar = document.createElement('div');
            bar.className = 'system-bar';
            if (sys.capacity < 25) bar.classList.add('danger');
            else if (sys.capacity < 75) bar.classList.add('warning');
            bar.style.width = `${sys.capacity}%`;
            barContainer.appendChild(bar);

            const diag = document.createElement('div');
            diag.className = 'system-diagnostic';
            diag.textContent = sys.diag;

            panel.appendChild(header);
            panel.appendChild(data);
            panel.appendChild(barContainer);
            panel.appendChild(diag);
            grid.appendChild(panel);
        });

        terminalHistory.appendChild(grid);

        // Add some technical log lines after the grid
        const logs = [
            "ALRT: HULL INTEGRITY AT 68%",
            "INFO: UNIDENTIFIED CRAFT DETECTED ON LONG-RANGE SCAN",
            "WARN: ATMOSPHERIC PRESSURE DROPPING IN DECK 4",
            "CRIT: UNKNOWN BIOLOGICAL SIGNATURE DETECTED IN ERSE"
        ];

        const footer = document.createElement('div');
        footer.className = 'systems-footer';

        logs.forEach(msg => {
            const line = document.createElement('div');
            line.className = 'line alert-line';
            if (msg.startsWith('INFO')) line.style.color = 'var(--primary-blue)';
            if (msg.startsWith('WARN')) line.style.color = 'var(--degraded-color)';
            line.textContent = `> ${msg}`;
            footer.appendChild(line);
        });

        terminalHistory.appendChild(footer);

        // Auto-scroll logic
        if (isAutoScrolling) {
            const terminalOutput = terminalHistory.closest('.terminal-output');
            if (terminalOutput) {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }
    };

    const displayMissionLogs = () => {
        addLine(terminalHistory, '--- ACCESSING MISSION LOGS ---', 'highlight');

        const numLogs = Math.floor(Math.random() * 97) + 4; // 4 to 100
        const now = new Date();
        const futureYear = now.getUTCFullYear() + 768;

        let exfiltratedCount = 0;
        let eliminatedCount = 0;

        const logs = [];
        for (let i = 1; i <= numLogs; i++) {
            // More likely to be eliminated (0.6 probability) than exfiltrated (0.4)
            const isExfiltrated = Math.random() < 0.4;
            const status = isExfiltrated ? 'EXFILTRATED' : 'ELIMINATED';

            if (isExfiltrated) {
                exfiltratedCount++;
            } else {
                eliminatedCount++;
            }

            const logId = String(i).padStart(3, '0');

            // Generate a random date within the last 30 days
            const randomOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
            const logTimestamp = new Date(now.getTime() - randomOffset);

            // Generate a random duration between 5 seconds and 64 minutes (3840 seconds)
            const durationTotalSec = Math.floor(Math.random() * 3836) + 5; // 5 to 3840
            const durationMin = Math.floor(durationTotalSec / 60);
            const durationSec = durationTotalSec % 60;
            const durationStr = `${durationMin}m ${String(durationSec).padStart(2, '0')}s`;

            logs.push({
                timestamp: logTimestamp,
                id: logId,
                status: status,
                duration: durationStr
            });
        }

        // Sort logs chronologically (earliest to latest)
        logs.sort((a, b) => a.timestamp - b.timestamp);

        logs.forEach(log => {
            const date = log.timestamp;
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const hour = String(date.getUTCHours()).padStart(2, '0');
            const min = String(date.getUTCMinutes()).padStart(2, '0');

            const logLine = document.createElement('div');
            logLine.className = 'line log-entry';

            const datePart = document.createElement('span');
            datePart.textContent = `[${futureYear}.${month}.${day} ${hour}:${min}]`;

            const idPart = document.createElement('span');
            idPart.textContent = `LOG_${log.id}`;

            const durationPart = document.createElement('span');
            durationPart.textContent = log.duration;

            const statusPart = document.createElement('span');
            statusPart.className = `status ${log.status.toLowerCase()}`;
            statusPart.textContent = log.status;

            logLine.appendChild(datePart);
            logLine.appendChild(idPart);
            logLine.appendChild(durationPart);
            logLine.appendChild(statusPart);
            terminalHistory.appendChild(logLine);
        });

        // Add summary line
        const summaryText = eliminatedCount >= exfiltratedCount ? 'SCREB' : 'KLESS';
        const summaryClass = summaryText.toLowerCase();

        const summaryLine = document.createElement('div');
        summaryLine.className = `line status-summary ${summaryClass}`;
        summaryLine.textContent = `SUMMARY: ${summaryText}`;
        terminalHistory.appendChild(summaryLine);

        // Scroll to the bottom
        if (isAutoScrolling) {
            const terminalOutput = terminalHistory.closest('.terminal-output');
            if (terminalOutput) {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }
    };

    // Input handling
    if (terminalInput) {
        const terminalOutput = output || document.querySelector('.terminal-output');

        if (terminalOutput) {
            terminalOutput.addEventListener('scroll', () => {
                isAutoScrolling = terminalOutput.scrollHeight - terminalOutput.scrollTop <= terminalOutput.clientHeight + 50;
            });
        }

        terminalInput.addEventListener('keydown', (e) => {
            // Handle Ctrl + L to clear history
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                clearTerminal();
                return;
            }

            // Re-enable auto-scroll on command entry
            if (e.key === 'Enter') {
                isAutoScrolling = true;
                const command = terminalInput.value;
                processCommand(command);
                terminalInput.value = '';
                inputWrapper.style.setProperty('--cursor-pos', 0);
            }
        });

        terminalInput.addEventListener('input', () => {
            // Use getSelection().anchorOffset or similar for accurate character counting if needed,
            // but for monospace fonts, value.length is generally fine.
            // Some browsers might need a small delay or requestAnimationFrame for cursor updates.
            inputWrapper.style.setProperty('--cursor-pos', terminalInput.value.length);
        });

        // Refocus input if clicking anywhere in terminal
        // Use touchstart for better responsiveness on Safari/iOS
        const focusInput = () => {
            terminalInput.focus();
        };
        document.body.addEventListener('click', focusInput);
        document.body.addEventListener('touchstart', focusInput);
    }

    // Loading sequence
    const loadingSteps = [
        {text: "BOOTING ERSE TERMINAL OS...", delay: 500},
        {text: "INITIALIZING HARDWARE INTERFACE...", delay: 800},
        {text: "CONNECTING TO MARAJOHN AI NETWORK...", delay: 1200},
        {text: "BYPASSING ENCRYPTION [LEVEL 7]...", delay: 1500, highlight: true},
        {text: "ESTABLISHING SECURE LINK...", delay: 600},
        {text: "ACCESSING AI CORE [PORTER]...", delay: 1000},
        {text: "SYNCHRONIZING SYSTEM CLOCK...", delay: 400},
        {text: "UPDATING HUD INTERFACE...", delay: 300},
        {text: "READY.", delay: 500, highlight: true}
    ];

    async function runLoading(isReLogin = false) {
        // Check for debug mode to skip loading, unless we're explicitly logging out
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug') && !isReLogin) {
            loadingScreen.style.display = 'none';
            mainHeader.style.display = 'flex';
            mainContent.style.display = 'flex';
            mainFooter.style.display = 'flex';
            updateDateTime();
            return;
        }

        // Show login button first
        loadingOutput.style.justifyContent = 'center';
        loadingOutput.style.alignItems = 'center';
        loadingOutput.innerHTML = '';

        const loginBtn = document.createElement('div');
        loginBtn.className = 'login-btn';
        loginBtn.textContent = '[ LOGIN ]';
        loginBtn.tabIndex = 0; // Make it focusable
        loadingOutput.appendChild(loginBtn);

        // Wait for user interaction
        await new Promise(resolve => {
            const handleLogin = () => {
                loginBtn.removeEventListener('click', handleLogin);
                window.removeEventListener('keydown', handleKeyDown);
                loginBtn.remove();
                resolve();
            };

            const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            };

            loginBtn.addEventListener('click', handleLogin);
            window.addEventListener('keydown', handleKeyDown);

            // Auto-focus the login button
            setTimeout(() => loginBtn.focus(), 100);
        });

        // Apply loading screen centering only if we're not starting the actual boot sequence messages
        loadingOutput.style.justifyContent = 'flex-start';
        loadingOutput.style.alignItems = 'flex-start';

        updateDateTime();
        for (const step of loadingSteps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            addLine(loadingOutput, step.text, step.highlight ? 'highlight' : 'normal');
        }

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainHeader.style.display = 'flex';
            mainContent.style.display = 'flex';
            mainFooter.style.display = 'flex';
        }, 800);
    }

    runLoading().catch(err => {
        console.error("Loading sequence failed:", err);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.textContent.replace(/[\[\]\s]/g, '');
            isAutoScrolling = true;
            processCommand(action);
        });
    });
});
