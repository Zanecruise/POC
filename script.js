document.addEventListener('DOMContentLoaded', () => {
        const startAnalysisButton = document.getElementById('startAnalysisButton');
        const userInputSection = document.getElementById('userInputSection');
        const simulationContainer = document.getElementById('simulationContainer');
        const simulationTemplate = document.getElementById('simulation-template');
        const statusBar = document.getElementById('status-bar');
        const statusText = document.getElementById('status-text');

        // Define os cenários da simulação
        const SCENARIOS = [
            { 
                score: 62.1, 
                verdict: 'review', 
                baseScores: { confianca: 80, conformidade: 75, comportamento: 60 },
                weights: { confianca: 0.4, conformidade: 0.3, comportamento: 0.3 },
                decisionRule: "REVISÃO MANUAL EXIGIDA",
                decisionRationale: "Conflito entre alto KYC e baixa confiabilidade comportamental",
                badgeText: "Evita falso positivo com defesa técnica estruturada",
                alerts: [
                    { title: 'Risco na Origem', description: 'Fundos provenientes de exchange com políticas de KYC flexíveis.', type: 'danger'}, 
                    { title: 'Volume Atípico', description: 'Transação 3.5x superior à média histórica do utilizador.', type: 'warning'}, 
                    { title: 'Contrato Não Verificado', description: 'Interação com smart contract recém-criado e sem auditoria pública.', type: 'warning'}
                ], 
                moduleDetails: [
                    { name: 'Sherlock', finding: '1 interação com contrato não auditado.', flag: 'UNVERIFIED_CONTRACT', impact: -8, evidence: 'Tx ID 0x94... operando com contrato recém-criado sem auditoria.', status: 'warning', remark: 'Risco Encontrado'},
                    { name: 'Sentinela', finding: 'Pico de volume acima da média histórica.', flag: 'UNUSUAL_VOLUME', impact: -15, evidence: 'Volume 3.5x superior à média dos últimos 90 dias.', status: 'warning', remark: 'Alerta Ativado'},
                    { name: 'Sherlock', finding: 'Interação com CEX de tier médio.', flag: 'RISKY_SOURCE', impact: -6, evidence: 'Fundos provenientes de exchange com políticas de KYC flexíveis.', status: 'warning', remark: 'Risco Encontrado'},
                    { name: 'DFC', finding: 'Verificação KYC bem-sucedida.', flag: 'KYC_VERIFIED', impact: 12, evidence: 'Documento ID 34823 validado com sucesso.', status: 'success', remark: 'Verificado'}
                ],
                // Ajuste das posições e tamanhos para um layout mais organizado e proporcional
                // Coordenadas são relativas ao viewBox (0-500 x 0-300)
                networkGraph: {
                    nodes: [
                        { id: 'wallet_user', label: 'SUA WALLET', type: 'wallet', cx: 250, cy: 150, r: 40 }, 
                        { id: 'mixer_tornadocash', label: 'TORNADOCASH', type: 'risk', cx: 100, cy: 80, r: 30 },
                        { id: 'suspicious_exchange', label: 'EXCHANGE SUSP.', type: 'risk', cx: 400, cy: 80, r: 30 },
                        { id: 'new_contract', label: 'CONTRATO NAO AUD.', type: 'risk', cx: 250, cy: 240, r: 30 }
                    ],
                    edges: [
                        { from: 'wallet_user', to: 'mixer_tornadocash', type: 'risk' },
                        { from: 'wallet_user', to: 'suspicious_exchange', type: 'risk' },
                        { from: 'wallet_user', to: 'new_contract', type: 'risk' }
                    ]
                },
                scoreTrend: [
                    { score: 85, anomaly: false }, { score: 80, anomaly: false }, { score: 78, anomaly: false }, { score: 75, anomaly: false },
                    { score: 68, anomaly: true, anomalyType: 'queda abrupta' }, { score: 65, anomaly: false }, { score: 62.1, anomaly: false } 
                ],
                impact: { before: "Essa transação teria sido aprovada. O sistema antifraude tradicional não detecta contratos não verificados nem picos de volume contextuais.", with: "A IA detectou inconsistência e acionou revisão antes do processamento. O prejuízo potencial de US$ 15.000,00 foi evitado." },
                decisionLog: [
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:32:11Z", "message": "Iniciando análise..."},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:32:12Z", "message": "Flags detectadas: 3"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:32:12Z", "message": "Ajustes totais: -17"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:32:13Z", "message": "Veredito preliminar: BLOCK", "highlight": "text-red-400"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:32:14Z", "message": "Correção por confiança (DFC): +12", "highlight": "text-emerald-400"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:32:15Z", "message": "Veredito final: REVIEW", "highlight": "text-amber-400"}
                ]
            },
            // Adicione mais cenários aqui se desejar variar a demo
            { 
                score: 95.0, 
                verdict: 'approve', 
                baseScores: { confianca: 90, conformidade: 95, comportamento: 98 },
                weights: { confianca: 0.4, conformidade: 0.3, comportamento: 0.3 },
                decisionRule: "APROVAÇÃO AUTOMÁTICA",
                decisionRationale: "Alta confiança e conformidade, sem sinais de risco",
                badgeText: "Transação aprovada com segurança",
                alerts: [
                    { title: 'KYC Completo', description: 'Identidade verificada e confirmada.', type: 'success'}, 
                    { title: 'Histórico Estável', description: 'Comportamento transacional consistente.', type: 'success'}
                ], 
                moduleDetails: [
                    { name: 'DFC', finding: 'Verificação KYC bem-sucedida.', flag: 'KYC_VERIFIED', impact: 10, evidence: 'Documento ID 34823 validado com sucesso.', status: 'success', remark: 'Verificado'},
                    { name: 'Sentinela', finding: 'Padrão de volume normal.', flag: 'NORMAL_VOLUME', impact: 5, evidence: 'Volume dentro da média histórica dos últimos 90 dias.', status: 'success', remark: 'Comportamento Preditivo'},
                    { name: 'Sherlock', finding: 'Endereço sem exposição a ilícitos.', flag: 'CLEAN_ADDRESS', impact: 5, evidence: 'Nenhuma ligação com entidades sancionadas ou ilícitas.', status: 'success', remark: 'Limpo'}
                ],
                networkGraph: {
                    nodes: [
                        { id: 'wallet_user', label: 'SUA WALLET', type: 'wallet', cx: 250, cy: 150, r: 40 },
                        { id: 'trusted_exchange', label: 'EXCHANGE CONFIÁVEL', type: 'safe', cx: 100, cy: 80, r: 30 },
                        { id: 'known_merchant', label: 'COMERCIANTE CONHECIDO', type: 'safe', cx: 400, cy: 80, r: 30 }
                    ],
                    edges: [
                        { from: 'wallet_user', to: 'trusted_exchange', type: 'safe' },
                        { from: 'wallet_user', to: 'known_merchant', type: 'safe' }
                    ]
                },
                scoreTrend: [
                    { score: 90, anomaly: false }, { score: 92, anomaly: false }, { score: 93, anomaly: false }, { score: 95, anomaly: false },
                    { score: 94, anomaly: false }, { score: 96, anomaly: false }, { score: 95.0, anomaly: false }
                ],
                impact: { before: "Essa transação seria aprovada de qualquer forma, mas sem a devida documentação e justificativa automatizada para auditoria.", with: "A FoundLab fornece a decisão instantânea e a documentação completa, auditável para conformidade regulatória, otimizando o fluxo operacional." },
                decisionLog: [
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:35:01Z", "message": "Iniciando análise..."},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:35:02Z", "message": "Flags detectadas: 0"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:35:02Z", "message": "Ajustes totais: +20"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:35:03Z", "message": "Veredito preliminar: APPROVE", "highlight": "text-emerald-400"},
                    { "modelo": "v2.3–FoundScoreEngine", "timestamp": "14:35:04Z", "message": "Veredito final: APPROVE", "highlight": "text-emerald-400"}
                ]
            }
        ];

        const VERDICTS = {
            approve: { color: 'var(--success-color)', textColor: 'text-emerald-400', badgeBg: 'bg-[var(--success-bg)]', badgeText: 'text-emerald-300', icon: '✅' },
            review: { color: 'var(--warning-color)', textColor: 'text-amber-400', badgeBg: 'bg-[var(--warning-bg)]', badgeText: 'text-amber-300', icon: '⚠️' },
            deny: { color: 'var(--danger-color)', textColor: 'text-red-400', badgeBg: 'bg-[var(--danger-bg)]', badgeText: 'text-red-300', icon: '🚫' }
        };

        let currentScenarioIndex = 0;
        let alpineScoreRef = null; 

        const runSimulation = async () => {
            startAnalysisButton.disabled = true;
            userInputSection.classList.add('opacity-50', 'pointer-events-none');
            simulationContainer.innerHTML = ''; 
            statusBar.classList.remove('opacity-0');

            const simulationContent = simulationTemplate.content.cloneNode(true);
            simulationContainer.appendChild(simulationContent);
            
            // Set initial input values to display
            document.getElementById('displayWallet').textContent = document.getElementById('walletInput').value;
            document.getElementById('displayPix').textContent = document.getElementById('pixInput').value;
            document.getElementById('displayValue').textContent = `USDC: $${parseFloat(document.getElementById('valueInput').value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

            // Map sections for easier access
            const sections = {
                inputData: document.getElementById('inputData'),
                networkViz: document.getElementById('networkViz'), 
                alertSignals: document.getElementById('alertSignals'),
                analysisModules: document.getElementById('analysisModules'),
                moduleProcessing: document.getElementById('moduleProcessing'),
                scoreDecision: document.getElementById('scoreDecision'),
                impactSection: document.getElementById('impactSection'),
                logSection: document.getElementById('logSection'),
                finalSummary: document.getElementById('finalSummary')
            };

            const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const show = async (el, delay = 100) => { 
                if(el) { 
                    await wait(delay); 
                    el.classList.add('is-visible'); 
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
                } 
            };
            const updateStatus = async (text, delay = 1000) => { statusText.textContent = text; await wait(delay); };
            
            const currentScenario = SCENARIOS[currentScenarioIndex];

            // Sequence of simulation steps
            await updateStatus("CONFIRMANDO DADOS DE ENTRADA...", 600);
            await show(sections.inputData);
            await wait(800);
            
            await updateStatus("MAPEANDO REDE DE RELAÇÕES (SHERLOCK)...", 800);
            await show(sections.networkViz);
            await createNetworkGraph(currentScenario.networkGraph);
            await wait(2000); // Give time for graph animation

            await updateStatus("COLETANDO SINAIS AVANÇADOS (DFC)...", 800);
            updateAlertsUI(currentScenario.alerts);
            await show(sections.alertSignals);
            await wait(1000);

            await updateStatus("INICIANDO AGENTES DE IA FOUNDLAB...", 800);
            updateModuleCards();
            await show(sections.analysisModules);
            await wait(1000);

            await updateStatus("PROCESSANDO EM TEMPO REAL...", 1000);
            await show(sections.moduleProcessing);
            await animateModuleProcessing(currentScenario.moduleDetails);
            await wait(1000);

            await updateStatus("CALCULANDO SCORE E VEREDITO (SCORE ENGINE)...", 1000);
            await show(sections.scoreDecision);
            alpineScoreRef = Alpine.$data(sections.scoreDecision); 

            animateScore(currentScenario.score); 
            animateScoreTrend(currentScenario.scoreTrend); 
            updateDecisionUI(currentScenario); 
            await wait(2500); // Give time for score and chart animation

            await updateStatus("GERANDO RELATÓRIO DE PREVENÇÃO DE PERDAS...", 800);
            updateImpactUI(currentScenario.impact)
            await show(sections.impactSection);
            await wait(1000);
            
            await updateStatus("FINALIZANDO LOG DO MOTOR DE DECISÃO...", 800);
            await show(sections.logSection);
            await updateLogUI(currentScenario.decisionLog);
            await wait(1000);

            await updateStatus(`SIMULAÇÃO COMPLETA | VEREDITO: ${currentScenario.verdict.toUpperCase()} | SCORE: ${currentScenario.score.toFixed(1)}`, 500);
            updateFinalSummary(currentScenario);
            await show(sections.finalSummary);
            
            // Re-enable input and button
            startAnalysisButton.disabled = false;
            userInputSection.classList.remove('opacity-50', 'pointer-events-none');

            // Set up restart button
            document.getElementById('restartSimulationButton').addEventListener('click', () => {
                simulationContainer.innerHTML = '';
                statusBar.classList.add('opacity-0');
                statusText.textContent = 'Ocioso';
                userInputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                currentScenarioIndex = (currentScenarioIndex + 1) % SCENARIOS.length; // Cycle scenario
            });
        };
        
        function updateAlertsUI(alerts){
            const container = document.getElementById("alert-tags");
            if (!container) return;
            container.innerHTML = "";
            const typeConfig = {
                danger: { icon: '✖', color: 'red-400', border: 'var(--danger-bg)' },
                warning: { icon: '!', color: 'amber-400', border: 'var(--warning-bg)' },
                success: { icon: '✓', color: 'emerald-400', border: 'var(--success-bg)' }
            };
            alerts.forEach(alert => {
                const config = typeConfig[alert.type];
                const el = document.createElement("div");
                el.className = `bg-[var(--surface-color)] p-4 rounded-lg border border-[${config.border}] fade-in-section is-visible`; 
                el.innerHTML = `
                    <div class="flex items-center">
                        <span class="text-xl font-bold text-${config.color} mr-3">${config.icon}</span>
                        <h4 class="font-semibold text-[var(--text-color)]">${alert.title}</h4>
                    </div>
                    <p class="text-sm text-[var(--muted-text-color)] mt-1 pl-8">${alert.description}</p>
                `;
                container.appendChild(el);
            });
        }
        
        function updateModuleCards(){
            const container = document.getElementById("module-cards");
            if (!container) return;
            container.innerHTML = `
                <div class="bg-[var(--surface-color)] p-6 rounded-lg border border-[var(--module-border-color)] h-full transition duration-300 hover:border-[var(--primary-color-light)] hover:shadow-lg">
                    <h4 class="font-bold text-lg text-amber-400">Sherlock <span class="text-xs text-[var(--muted-text-color)] font-normal">v2.1</span></h4>
                    <p class="text-sm mt-1 text-[var(--muted-text-color)]">Analisa o histórico e o comportamento on-chain da entidade para detetar padrões suspeitos, como o uso de mixers ou interações com contratos de risco.</p>
                    <p class="text-xs mt-3 font-mono text-[var(--muted-text-color)]">Fontes: Etherscan, Polygonscan, Fontes On-chain</p>
                </div>
                <div class="bg-[var(--surface-color)] p-6 rounded-lg border border-[var(--module-border-color)] h-full transition duration-300 hover:border-[var(--primary-color-light)] hover:shadow-lg">
                    <h4 class="font-bold text-lg text-amber-400">DFC (Dynamic Flag Council) <span class="text-xs text-[var(--muted-text-color)] font-normal">v1.8</span></h4>
                    <p class="text-sm mt-1 text-[var(--muted-text-color)]">Realiza o cruzamento de dados com listas de sanções globais (OFAC, Interpol) e verifica a identidade (KYC) para garantir conformidade regulatória.</p>
                    <p class="text-xs mt-3 font-mono text-[var(--muted-text-color)]">Fontes: OFAC, Listas de Sanções, Fontes Internas</p>
                </div>
                <div class="bg-[var(--surface-color)] p-6 rounded-lg border border-[var(--module-border-color)] h-full transition duration-300 hover:border-[var(--primary-color-light)] hover:shadow-lg">
                    <h4 class="font-bold text-lg text-amber-400">Sentinela <span class="text-xs text-[var(--muted-text-color)] font-normal">v3.0</span></h4>
                    <p class="text-sm mt-1 text-[var(--muted-text-color)]">Monitora o comportamento transacional em tempo real, detetando anomalias como picos de volume ou frequência que destoam do perfil histórico.</p>
                    <p class="text-xs mt-3 font-mono text-[var(--muted-text-color)]">Fontes: Histórico Transacional, Análise Preditiva</p>
                </div>
            `;
        }

        async function animateModuleProcessing(moduleDetails){
            const container = document.getElementById("processing-grid");
            if (!container) return;
            container.innerHTML = "";
            const wait = ms => new Promise(res => setTimeout(res, ms));
            const statusClasses = {
                success: { text: "text-emerald-400", icon: "✓" },
                warning: { text: "text-amber-400", icon: "!" },
                danger: { text: "text-red-400", icon: "X" }
            };
            
            for(const mod of moduleDetails) {
                const el = document.createElement("div");
                el.className = "opacity-0"; // Start invisible

                // Initial loading state
                el.innerHTML = `<div class="flex items-center gap-5 p-4 bg-[var(--surface-color)] rounded-lg shadow-md border border-[var(--module-border-color)]"><div class="flex-grow"><div class="flex justify-between items-center mb-2"><h4 class="font-bold text-lg text-[var(--text-color)]">${mod.name}</h4><span class="font-mono text-xs px-2 py-1 rounded bg-[var(--background-color)] text-[var(--muted-text-color)]">PROCESSANDO...</span></div><div class="flex justify-between items-end"><p class="text-sm text-[var(--muted-text-color)]">Aguardando resultados...</p><div class="w-5 h-5 border-2 border-[var(--muted-text-color)] border-t-transparent rounded-full spinner"></div></div></div></div>`;
                container.appendChild(el);
                
                await wait(200); 
                el.style.transition = "opacity 0.3s ease-in-out";
                el.style.opacity = "1";
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                await wait(1000); 

                // Final state
                const pointsClass = mod.impact >= 0 ? "text-emerald-400" : "text-red-400";
                const pointsSign = mod.impact > 0 ? "+" : "";
                
                el.innerHTML = `<div class="flex items-center gap-5 p-4 bg-[var(--background-color)] rounded-lg shadow-md border border-[var(--module-border-color)]"><div class="flex-grow"><div class="flex justify-between items-center mb-2"><h4 class="font-bold text-lg text-[var(--text-color)]">${mod.name}</h4><span class="font-mono text-xs px-2 py-1 rounded bg-[var(--surface-color)] text-[var(--muted-text-color)]">${mod.flag}</span></div><div class="flex justify-between items-end"><p class="text-sm text-[var(--muted-text-color)]">${mod.finding}</p><p class="font-semibold text-lg ${pointsClass}">${pointsSign}${mod.impact} pts</p></div></div><div class="text-center w-24 flex-shrink-0"><div class="w-10 h-10 mx-auto flex items-center justify-center rounded-full text-2xl font-bold ${statusClasses[mod.status].text}">${statusClasses[mod.status].icon}</div><p class="text-xs mt-2 font-semibold ${statusClasses[mod.status].text}">${mod.remark}</p></div></div>`;
            }
        }
        
        function animateScore(finalScore) {
            let start = 0;
            const end = finalScore;
            const duration = 1000; 
            let startTime = null;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                
                if (alpineScoreRef) {
                    alpineScoreRef.scoreValue = start + progress * (end - start);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (alpineScoreRef) {
                        alpineScoreRef.scoreValue = end; 
                    }
                }
            };
            requestAnimationFrame(animate);
        }

        function animateScoreTrend(data) {
            if (!alpineScoreRef) return;
            
            alpineScoreRef.scoreTrendData = JSON.parse(JSON.stringify(data)); 
            
            Alpine.nextTick(() => {
                if (alpineScoreRef.$refs.scorePath) { 
                    const pathElement = alpineScoreRef.$refs.scorePath;
                    const length = pathElement.getTotalLength();
                    pathElement.style.strokeDasharray = length;
                    pathElement.style.strokeDashoffset = length;
                    
                    setTimeout(() => {
                        alpineScoreRef.animateLine = true;
                    }, 100);
                }
            });
        }


        function updateDecisionUI(result) {
            const matrixBody = document.getElementById('decisionMatrix');
            const formulaEl = document.getElementById('calculationFormula');
            const timelineBody = document.getElementById('eventsTimeline');
            const verdictSummaryContainer = document.getElementById('verdict-summary');
            
            if(!matrixBody || !formulaEl || !timelineBody || !verdictSummaryContainer) return;

            matrixBody.innerHTML = '';
            let formula = '(';
            const vectors = {confianca: 'Confiança', conformidade: 'Conformidade', comportamento: 'Comportamento'};
            
            Object.keys(vectors).forEach((key, index) => {
                const base = result.baseScores[key];
                const adjustments = result.moduleDetails.filter(m => {
                    const flag = m.flag.toLowerCase();
                    if (key === 'confianca') return m.name === 'DFC'; 
                    if (key === 'conformidade') return false; 
                    if (key === 'comportamento') return m.name === 'Sherlock' || m.name === 'Sentinela'; 
                    return false;
                }).reduce((acc, curr) => acc + curr.impact, 0);

                const final = base + adjustments;
                const weight = result.weights[key];

                const sources = [...new Set(result.moduleDetails.filter(m => {
                    const flag = m.flag.toLowerCase();
                    if (key === 'confianca') return m.name === 'DFC';
                    if (key === 'conformidade') return false; 
                    if (key === 'comportamento') return m.name === 'Sherlock' || m.name === 'Sentinela';
                    return false;
                }).map(m => m.name))].join(', ');
                
                let dynamicImpactText = adjustments !== 0 ? `${adjustments > 0 ? '+' : ''}${adjustments}` : '-';
                let dynamicImpactColor = adjustments >= 0 ? 'text-emerald-400' : 'text-red-400';
                if (adjustments === 0) dynamicImpactColor = 'text-gray-400';


                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700/50 h-14';
                row.innerHTML = `
                    <td class="py-2 px-2 font-semibold text-left text-white">${vectors[key]}</td>
                    <td class="py-2 px-2 text-gray-400 text-xs text-center">${sources || 'N/A'}</td>
                    <td class="py-2 px-2 font-mono text-center">${base}</td>
                    <td class="py-2 px-2 font-mono text-center ${dynamicImpactColor}">${dynamicImpactText}</td>
                    <td class="py-2 px-2 font-bold text-xl text-white text-center">${final}</td>
                    <td class="py-2 px-2 text-gray-400 font-mono text-center">${weight}</td>
                `;
                matrixBody.appendChild(row);
                
                formula += `(${final} × ${weight})${index < Object.keys(vectors).length - 1 ? ' + ' : ''}`;
            });

            formula += `) = ${result.score.toFixed(1)}`;
            formulaEl.textContent = `Fórmula: ${formula}`;

            timelineBody.innerHTML = '';
            result.moduleDetails.forEach(mod => {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-700/50 h-14';
                    row.innerHTML = `<td class="py-2 px-2 font-semibold">${mod.name}</td><td class="py-2 px-2 text-gray-400 evidence-tooltip">${mod.flag}<span class="tooltip-text">${mod.evidence}</span></td><td class="py-2 px-2 font-bold text-right ${mod.impact >= 0 ? 'text-emerald-400' : 'text-red-400'}">${mod.impact > 0 ? '+' : ''}${mod.impact} pts</td>`;
                    timelineBody.appendChild(row);
            });

            const verdictConfig = VERDICTS[result.verdict];
            verdictSummaryContainer.innerHTML = `
                <div class="text-6xl mb-4">${verdictConfig.icon}</div>
                <p class="text-2xl font-bold ${verdictConfig.textColor}">${result.decisionRule}</p>
                <p class="text-md text-gray-400 mt-2">${result.decisionRationale}</p>
                <div class="inline-block mt-4 font-bold py-2 px-5 rounded-full text-sm uppercase tracking-wider ${verdictConfig.badgeBg} ${verdictConfig.badgeText} animate-pulse-light">
                    ${result.badgeText}
                </div>
            `;

            // Update JSON content for justified tab
            const justifiedJsonEl = verdictSummaryContainer.closest('section').querySelector('#justificativa pre code');
            if (justifiedJsonEl) {
                const justifiedData = {
                    verdict: result.verdict.toUpperCase(),
                    score: result.score,
                    reasons: result.moduleDetails.map(m => ({
                        code: m.flag,
                        description: m.finding + '.',
                        severity: m.status.toUpperCase(),
                        source: m.name
                    })),
                    engine_version: "Score Engine v3.1",
                    timestamp: new Date().toISOString().slice(0, 19) + 'Z' 
                };
                justifiedJsonEl.textContent = JSON.stringify(justifiedData, null, 2);
            }

            // Update JSON content for payload tab
            const payloadJsonEl = verdictSummaryContainer.closest('section').querySelector('#payload pre code');
            if (payloadJsonEl) {
                const payloadData = {
                    transaction_id: document.getElementById('pixInput').value,
                    wallet_address: document.getElementById('walletInput').value,
                    amount_usdc: parseFloat(document.getElementById('valueInput').value),
                    score: result.score,
                    verdict: result.verdict.toUpperCase(),
                    foundlab_flags: result.moduleDetails.filter(m => m.status !== 'success').map(m => m.flag),
                    decision_timestamp: new Date().toISOString().slice(0, 19) + 'Z', 
                    recommendation: result.verdict === 'review' ? "Aguardar revisão manual ou solicitar informações adicionais." : (result.verdict === 'approve' ? "Transação aprovada. Prossiga." : "Transação bloqueada. Alerta crítico."),
                    justification_link: `https://dashboard.foundlab.com/decision/${document.getElementById('pixInput').value}`
                };
                payloadJsonEl.textContent = JSON.stringify(payloadData, null, 2);
            }
        }

        function updateImpactUI(impact){
            const container = document.getElementById('impact-container');
            if(!container) return;
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-[var(--warning-bg)] p-6 rounded-lg border border-[var(--warning-color)]">
                        <h4 class="font-semibold text-[var(--warning-color)] mb-2">Antes da FoundLab</h4>
                        <p class="text-[var(--muted-text-color)]">${impact.before}</p>
                    </div>
                    <div class="bg-[var(--success-bg)] p-6 rounded-lg border border-[var(--success-color)]">
                        <h4 class="font-semibold text-[var(--success-color)] mb-2">Com a FoundLab</h4>
                        <p class="text-[var(--muted-text-color)]">${impact.with}</p>
                    </div>
                </div>
            `;
        }
        
        async function updateLogUI(log) {
            const el = document.getElementById('decisionLog');
            if (!el) return;
            el.innerHTML = '';
            const wait = ms => new Promise(res => setTimeout(res, ms));
            for (const line of log) {
                const p = document.createElement('p');
                p.className = `transition-opacity duration-300 opacity-0`; 
                p.innerHTML = `<span class="text-[var(--muted-text-color)]">${line.timestamp}</span> [${line.modelo}]: <span class="${line.highlight || ''}">${line.message}</span>`;
                el.appendChild(p);
                el.scrollTop = el.scrollHeight; 
                await wait(70); 
                p.classList.remove('opacity-0');
            }
        }

        function updateFinalSummary(scenario) {
            document.getElementById('finalVerdictText').textContent = scenario.verdict.toUpperCase();
            document.getElementById('finalScoreText').textContent = scenario.score.toFixed(1);
            
            const finalVerdictElement = document.getElementById('finalVerdictText');
            if (scenario.verdict === 'review') {
                finalVerdictElement.className = 'text-amber-400 font-semibold';
            } else if (scenario.verdict === 'approve') {
                finalVerdictElement.className = 'text-emerald-400 font-semibold';
            } else if (scenario.verdict === 'deny') {
                finalVerdictElement.className = 'text-red-400 font-semibold';
            }
        }

        // --- Network Graph Visualization ---
        async function createNetworkGraph(graphData) {
            const svg = document.getElementById('graph-svg');
            if (!svg) return;

            svg.innerHTML = ''; // Clear previous graph content

            const nodesMap = new Map();

            // Create nodes (SVG circles and text)
            for (const nodeData of graphData.nodes) {
                // Node Circle
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute('id', `svg-node-${nodeData.id}`);
                circle.setAttribute('cx', nodeData.cx);
                circle.setAttribute('cy', nodeData.cy);
                circle.setAttribute('r', nodeData.r);
                circle.setAttribute('class', `svg-node-circle ${nodeData.type}`);
                // Garantir cor clara caso CSS não aplique
                if (nodeData.type === 'wallet') {
                    circle.setAttribute('fill', '#E7F3FF');
                    circle.setAttribute('stroke', '#1877F2');
                } else if (nodeData.type === 'risk') {
                    circle.setAttribute('fill', 'rgba(229,57,53,0.15)');
                    circle.setAttribute('stroke', '#E53935');
                } else if (nodeData.type === 'safe') {
                    circle.setAttribute('fill', 'rgba(49,162,76,0.1)');
                    circle.setAttribute('stroke', '#31A24C');
                } else {
                    circle.setAttribute('fill', '#FFFFFF');
                    circle.setAttribute('stroke', '#DADDE1');
                }
                svg.appendChild(circle);
                
                // Node Text
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute('x', nodeData.cx);
                text.setAttribute('y', nodeData.cy);
                text.setAttribute('class', `svg-node-text ${nodeData.type}`);
                text.setAttribute('fill', '#050505');
                text.setAttribute('font-size', '14');
                text.setAttribute('font-family', 'Inter, Arial, sans-serif');
                text.setAttribute('font-weight', '600');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.textContent = nodeData.label;
                svg.appendChild(text);

                nodesMap.set(nodeData.id, { circle: circle, text: text, x: nodeData.cx, y: nodeData.cy, r: nodeData.r });
                
                // Animate node appearance
                await new Promise(resolve => setTimeout(resolve, 150)); // Stagger
                circle.style.opacity = 1;
                text.style.opacity = 1;
            }

            // Create edges (SVG lines)
            for (const edgeData of graphData.edges) {
                const fromNode = nodesMap.get(edgeData.from);
                const toNode = nodesMap.get(edgeData.to);

                if (fromNode && toNode) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute('x1', fromNode.x);
                    line.setAttribute('y1', fromNode.y);
                    line.setAttribute('x2', toNode.x);
                    line.setAttribute('y2', toNode.y);
                    line.setAttribute('class', `svg-edge-line ${edgeData.type === 'risk' ? 'risk' : ''}`);
                    // Garantir cor clara caso CSS não aplique
                    if (edgeData.type === 'risk') {
                        line.setAttribute('stroke', '#E53935');
                    } else if (edgeData.type === 'safe') {
                        line.setAttribute('stroke', '#31A24C');
                    } else {
                        line.setAttribute('stroke', '#DADDE1');
                    }
                    line.setAttribute('stroke-width', edgeData.type === 'risk' ? '2.5' : '2');
                    svg.insertBefore(line, svg.firstChild); // Insert lines before circles so they don't cover text

                    // Animate line drawing
                    const length = Math.sqrt(Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2));
                    line.style.strokeDasharray = length;
                    line.style.strokeDashoffset = length;

                    await new Promise(resolve => setTimeout(resolve, 200)); // Stagger
                    line.style.opacity = 1; // Make line visible
                    line.style.strokeDashoffset = 0; // Animate drawing
                }
            }
        }

        startAnalysisButton.addEventListener('click', runSimulation);
    });

