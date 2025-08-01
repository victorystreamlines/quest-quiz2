// Sliding Periodic Table Quiz
class SlidingPeriodicQuiz {
    constructor() {
        this.currentElementIndex = 0;
        this.totalElements = 118;
        this.quizState = this.loadQuizState();
        this.elements = this.initializeElements();
        this.isTransitioning = false;
        this.answersShown = {}; // Track which elements have answers shown
        this.currentlyFocusedInput = null; // Track currently focused input
        this.hideTimeout = null; // Track hide timeout
        this.currentOrder = 'default'; // Current primary ordering method
        this.currentSubOrder = 'none'; // Current secondary ordering method
        this.orderedElements = [...this.elements]; // Currently ordered elements array
        this.orderMapping = {}; // Maps original index to ordered index
        
        this.init();
    }

    init() {
        this.createQuizInterface();
        this.restoreProgress();
        this.updateProgress();
        this.showCurrentElement();
        this.setupEventListeners();
    }

    // Initialize elements data (same as quiz.html)
    initializeElements() {
        const elements = [
            // Period 1
            { atomicNumber: 1, symbol: "H", name: "Hydrogen", atomicMass: "1.008", classification: "nonmetals", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 2, symbol: "He", name: "Helium", atomicMass: "4.003", classification: "noble-gases", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            
            // Period 2
            { atomicNumber: 3, symbol: "Li", name: "Lithium", atomicMass: "6.94", classification: "alkali-metals", state: "S", metalType: "M", conductivity: "C", magneticSusceptibility: "P", magneticPermeability: "L", jouleHeating: "M", chargeStorage: "L" },
            { atomicNumber: 4, symbol: "Be", name: "Beryllium", atomicMass: "9.012", classification: "alkaline-earth-metals", state: "S", metalType: "M", conductivity: "C", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "M", chargeStorage: "M" },
            { atomicNumber: 5, symbol: "B", name: "Boron", atomicMass: "10.81", classification: "metalloids", state: "S", metalType: "T", conductivity: "S", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "L", chargeStorage: "L" },
            { atomicNumber: 6, symbol: "C", name: "Carbon", atomicMass: "12.01", classification: "nonmetals", state: "S", metalType: "N", conductivity: "S", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "L", chargeStorage: "N" },
            { atomicNumber: 7, symbol: "N", name: "Nitrogen", atomicMass: "14.01", classification: "nonmetals", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 8, symbol: "O", name: "Oxygen", atomicMass: "16.00", classification: "nonmetals", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "P", magneticPermeability: "L", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 9, symbol: "F", name: "Fluorine", atomicMass: "19.00", classification: "halogens", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 10, symbol: "Ne", name: "Neon", atomicMass: "20.18", classification: "noble-gases", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            
            // Period 3
            { atomicNumber: 11, symbol: "Na", name: "Sodium", atomicMass: "22.99", classification: "alkali-metals", state: "S", metalType: "M", conductivity: "C", magneticSusceptibility: "P", magneticPermeability: "L", jouleHeating: "M", chargeStorage: "L" },
            { atomicNumber: 12, symbol: "Mg", name: "Magnesium", atomicMass: "24.31", classification: "alkaline-earth-metals", state: "S", metalType: "M", conductivity: "C", magneticSusceptibility: "P", magneticPermeability: "L", jouleHeating: "M", chargeStorage: "M" },
            { atomicNumber: 13, symbol: "Al", name: "Aluminum", atomicMass: "26.98", classification: "post-transition-metals", state: "S", metalType: "M", conductivity: "C", magneticSusceptibility: "P", magneticPermeability: "L", jouleHeating: "H", chargeStorage: "M" },
            { atomicNumber: 14, symbol: "Si", name: "Silicon", atomicMass: "28.09", classification: "metalloids", state: "S", metalType: "T", conductivity: "S", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "L", chargeStorage: "L" },
            { atomicNumber: 15, symbol: "P", name: "Phosphorus", atomicMass: "30.97", classification: "nonmetals", state: "S", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 16, symbol: "S", name: "Sulfur", atomicMass: "32.07", classification: "nonmetals", state: "S", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 17, symbol: "Cl", name: "Chlorine", atomicMass: "35.45", classification: "halogens", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
            { atomicNumber: 18, symbol: "Ar", name: "Argon", atomicMass: "39.95", classification: "noble-gases", state: "G", metalType: "N", conductivity: "I", magneticSusceptibility: "D", magneticPermeability: "N", jouleHeating: "N", chargeStorage: "N" },
        ];

        // Auto-generate remaining elements 19-118 with basic properties
        for (let i = 19; i <= 118; i++) {
            const elementData = this.generateElementData(i);
            elements.push(elementData);
        }

        return elements;
    }

    generateElementData(atomicNumber) {
        // Basic element names and symbols
        const elementInfo = {
            19: { symbol: "K", name: "Potassium", classification: "alkali-metals" },
            20: { symbol: "Ca", name: "Calcium", classification: "alkaline-earth-metals" },
            21: { symbol: "Sc", name: "Scandium", classification: "transition-metals" },
            22: { symbol: "Ti", name: "Titanium", classification: "transition-metals" },
            23: { symbol: "V", name: "Vanadium", classification: "transition-metals" },
            24: { symbol: "Cr", name: "Chromium", classification: "transition-metals" },
            25: { symbol: "Mn", name: "Manganese", classification: "transition-metals" },
            26: { symbol: "Fe", name: "Iron", classification: "transition-metals" },
            27: { symbol: "Co", name: "Cobalt", classification: "transition-metals" },
            28: { symbol: "Ni", name: "Nickel", classification: "transition-metals" },
            29: { symbol: "Cu", name: "Copper", classification: "transition-metals" },
            30: { symbol: "Zn", name: "Zinc", classification: "transition-metals" },
            31: { symbol: "Ga", name: "Gallium", classification: "post-transition-metals" },
            32: { symbol: "Ge", name: "Germanium", classification: "metalloids" },
            33: { symbol: "As", name: "Arsenic", classification: "metalloids" },
            34: { symbol: "Se", name: "Selenium", classification: "nonmetals" },
            35: { symbol: "Br", name: "Bromine", classification: "halogens" },
            36: { symbol: "Kr", name: "Krypton", classification: "noble-gases" },
            37: { symbol: "Rb", name: "Rubidium", classification: "alkali-metals" },
            38: { symbol: "Sr", name: "Strontium", classification: "alkaline-earth-metals" },
            39: { symbol: "Y", name: "Yttrium", classification: "transition-metals" },
            40: { symbol: "Zr", name: "Zirconium", classification: "transition-metals" },
            41: { symbol: "Nb", name: "Niobium", classification: "transition-metals" },
            42: { symbol: "Mo", name: "Molybdenum", classification: "transition-metals" },
            43: { symbol: "Tc", name: "Technetium", classification: "transition-metals" },
            44: { symbol: "Ru", name: "Ruthenium", classification: "transition-metals" },
            45: { symbol: "Rh", name: "Rhodium", classification: "transition-metals" },
            46: { symbol: "Pd", name: "Palladium", classification: "transition-metals" },
            47: { symbol: "Ag", name: "Silver", classification: "transition-metals" },
            48: { symbol: "Cd", name: "Cadmium", classification: "transition-metals" },
            49: { symbol: "In", name: "Indium", classification: "post-transition-metals" },
            50: { symbol: "Sn", name: "Tin", classification: "post-transition-metals" },
            51: { symbol: "Sb", name: "Antimony", classification: "metalloids" },
            52: { symbol: "Te", name: "Tellurium", classification: "metalloids" },
            53: { symbol: "I", name: "Iodine", classification: "halogens" },
            54: { symbol: "Xe", name: "Xenon", classification: "noble-gases" },
            55: { symbol: "Cs", name: "Cesium", classification: "alkali-metals" },
            56: { symbol: "Ba", name: "Barium", classification: "alkaline-earth-metals" },
            57: { symbol: "La", name: "Lanthanum", classification: "lanthanides" },
            58: { symbol: "Ce", name: "Cerium", classification: "lanthanides" },
            59: { symbol: "Pr", name: "Praseodymium", classification: "lanthanides" },
            60: { symbol: "Nd", name: "Neodymium", classification: "lanthanides" },
            61: { symbol: "Pm", name: "Promethium", classification: "lanthanides" },
            62: { symbol: "Sm", name: "Samarium", classification: "lanthanides" },
            63: { symbol: "Eu", name: "Europium", classification: "lanthanides" },
            64: { symbol: "Gd", name: "Gadolinium", classification: "lanthanides" },
            65: { symbol: "Tb", name: "Terbium", classification: "lanthanides" },
            66: { symbol: "Dy", name: "Dysprosium", classification: "lanthanides" },
            67: { symbol: "Ho", name: "Holmium", classification: "lanthanides" },
            68: { symbol: "Er", name: "Erbium", classification: "lanthanides" },
            69: { symbol: "Tm", name: "Thulium", classification: "lanthanides" },
            70: { symbol: "Yb", name: "Ytterbium", classification: "lanthanides" },
            71: { symbol: "Lu", name: "Lutetium", classification: "lanthanides" },
            72: { symbol: "Hf", name: "Hafnium", classification: "transition-metals" },
            73: { symbol: "Ta", name: "Tantalum", classification: "transition-metals" },
            74: { symbol: "W", name: "Tungsten", classification: "transition-metals" },
            75: { symbol: "Re", name: "Rhenium", classification: "transition-metals" },
            76: { symbol: "Os", name: "Osmium", classification: "transition-metals" },
            77: { symbol: "Ir", name: "Iridium", classification: "transition-metals" },
            78: { symbol: "Pt", name: "Platinum", classification: "transition-metals" },
            79: { symbol: "Au", name: "Gold", classification: "transition-metals" },
            80: { symbol: "Hg", name: "Mercury", classification: "transition-metals" },
            81: { symbol: "Tl", name: "Thallium", classification: "post-transition-metals" },
            82: { symbol: "Pb", name: "Lead", classification: "post-transition-metals" },
            83: { symbol: "Bi", name: "Bismuth", classification: "post-transition-metals" },
            84: { symbol: "Po", name: "Polonium", classification: "post-transition-metals" },
            85: { symbol: "At", name: "Astatine", classification: "halogens" },
            86: { symbol: "Rn", name: "Radon", classification: "noble-gases" },
            87: { symbol: "Fr", name: "Francium", classification: "alkali-metals" },
            88: { symbol: "Ra", name: "Radium", classification: "alkaline-earth-metals" },
            89: { symbol: "Ac", name: "Actinium", classification: "actinides" },
            90: { symbol: "Th", name: "Thorium", classification: "actinides" },
            91: { symbol: "Pa", name: "Protactinium", classification: "actinides" },
            92: { symbol: "U", name: "Uranium", classification: "actinides" },
            93: { symbol: "Np", name: "Neptunium", classification: "actinides" },
            94: { symbol: "Pu", name: "Plutonium", classification: "actinides" },
            95: { symbol: "Am", name: "Americium", classification: "actinides" },
            96: { symbol: "Cm", name: "Curium", classification: "actinides" },
            97: { symbol: "Bk", name: "Berkelium", classification: "actinides" },
            98: { symbol: "Cf", name: "Californium", classification: "actinides" },
            99: { symbol: "Es", name: "Einsteinium", classification: "actinides" },
            100: { symbol: "Fm", name: "Fermium", classification: "actinides" },
            101: { symbol: "Md", name: "Mendelevium", classification: "actinides" },
            102: { symbol: "No", name: "Nobelium", classification: "actinides" },
            103: { symbol: "Lr", name: "Lawrencium", classification: "actinides" },
            104: { symbol: "Rf", name: "Rutherfordium", classification: "transition-metals" },
            105: { symbol: "Db", name: "Dubnium", classification: "transition-metals" },
            106: { symbol: "Sg", name: "Seaborgium", classification: "transition-metals" },
            107: { symbol: "Bh", name: "Bohrium", classification: "transition-metals" },
            108: { symbol: "Hs", name: "Hassium", classification: "transition-metals" },
            109: { symbol: "Mt", name: "Meitnerium", classification: "transition-metals" },
            110: { symbol: "Ds", name: "Darmstadtium", classification: "transition-metals" },
            111: { symbol: "Rg", name: "Roentgenium", classification: "transition-metals" },
            112: { symbol: "Cn", name: "Copernicium", classification: "transition-metals" },
            113: { symbol: "Nh", name: "Nihonium", classification: "post-transition-metals" },
            114: { symbol: "Fl", name: "Flerovium", classification: "post-transition-metals" },
            115: { symbol: "Mc", name: "Moscovium", classification: "post-transition-metals" },
            116: { symbol: "Lv", name: "Livermorium", classification: "post-transition-metals" },
            117: { symbol: "Ts", name: "Tennessine", classification: "halogens" },
            118: { symbol: "Og", name: "Oganesson", classification: "noble-gases" }
        };

        const info = elementInfo[atomicNumber] || { 
            symbol: `E${atomicNumber}`, 
            name: `Element ${atomicNumber}`, 
            classification: "unknown" 
        };

        return {
            atomicNumber,
            symbol: info.symbol,
            name: info.name,
            atomicMass: (atomicNumber * 2).toFixed(3), // Rough approximation
            classification: info.classification,
            state: this.getElementState(atomicNumber),
            metalType: this.getMetalType(info.classification),
            conductivity: this.getConductivity(info.classification),
            magneticSusceptibility: this.getMagneticSusceptibility(atomicNumber),
            magneticPermeability: this.getMagneticPermeability(atomicNumber),
            jouleHeating: this.getJouleHeating(info.classification),
            chargeStorage: this.getChargeStorage(atomicNumber)
        };
    }

    getElementState(atomicNumber) {
        if (atomicNumber <= 2 || [7, 8, 9, 10, 17, 18, 36, 54, 86, 118].includes(atomicNumber)) return "G";
        if ([35, 80].includes(atomicNumber)) return "L";
        return "S";
    }

    getMetalType(classification) {
        if (['alkali-metals', 'alkaline-earth-metals', 'transition-metals', 'post-transition-metals', 'lanthanides', 'actinides'].includes(classification)) return "M";
        if (classification === 'metalloids') return "T";
        return "N";
    }

    getConductivity(classification) {
        if (['alkali-metals', 'alkaline-earth-metals', 'transition-metals', 'post-transition-metals', 'lanthanides', 'actinides'].includes(classification)) return "C";
        if (classification === 'metalloids') return "S";
        return "I";
    }

    getMagneticSusceptibility(atomicNumber) {
        if ([26, 27, 28].includes(atomicNumber)) return "F"; // Fe, Co, Ni
        if (atomicNumber >= 57 && atomicNumber <= 71) return "P"; // Lanthanides
        if (atomicNumber >= 89 && atomicNumber <= 103) return "P"; // Actinides
        return "D";
    }

    getMagneticPermeability(atomicNumber) {
        if ([26, 27, 28].includes(atomicNumber)) return "H"; // Fe, Co, Ni
        if (atomicNumber >= 21 && atomicNumber <= 30) return "L"; // First transition series
        return "N";
    }

    getJouleHeating(classification) {
        if (['alkali-metals', 'alkaline-earth-metals', 'transition-metals', 'post-transition-metals', 'lanthanides', 'actinides'].includes(classification)) return "M";
        if (classification === 'metalloids') return "L";
        return "N";
    }

    getChargeStorage(atomicNumber) {
        if ([22, 40, 56, 72, 73].includes(atomicNumber)) return "H"; // Ti, Zr, Ba, Hf, Ta
        if (atomicNumber >= 57 && atomicNumber <= 71) return "M"; // Lanthanides
        return "N";
    }

    createQuizInterface() {
        // Check if quiz container already exists (from static HTML)
        const existingContainer = document.querySelector('.quiz-container');
        if (existingContainer) {
            // Use existing structure, just generate slides and setup
            this.generateSlides();
            this.createHelpSystem();
            this.attachHelpEventListeners();
            this.setupControlSystems();
            this.initializeOrderMapping();
            return;
        }
        
        // Create new structure if not exists
        document.body.innerHTML = `
            <div class="quiz-container">
                <header class="quiz-header">
                    <!-- Row 1: Control Tools (Order + Search) -->
                    <div class="header-controls-row">
                        <div class="order-controls-compact">
                            <div class="order-group-compact">
                                <label class="order-label-compact" for="orderDropdown">📊 Primary</label>
                                <select id="orderDropdown" class="order-dropdown-compact">
                                    <option value="default" selected>🔢 Atomic Number</option>
                                    <optgroup label="Physical Properties">
                                        <option value="state">🌡️ Physical State</option>
                                        <option value="metalType">🔨 Metal Type</option>
                                        <option value="conductivity">⚡ Conductivity</option>
                                    </optgroup>
                                    <optgroup label="Magnetic Properties">
                                        <option value="magneticSusceptibility">🧲 Susceptibility</option>
                                        <option value="magneticPermeability">🔄 Permeability</option>
                                    </optgroup>
                                    <optgroup label="Electrical Properties">
                                        <option value="jouleHeating">🔥 Joule Heating</option>
                                        <option value="chargeStorage">🔋 Charge Storage</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div class="order-group-compact">
                                <label class="order-label-compact secondary" for="subOrderDropdown">📋 Then By</label>
                                <select id="subOrderDropdown" class="order-dropdown-compact secondary">
                                    <option value="none" selected>➖ None</option>
                                    <optgroup label="Physical Properties">
                                        <option value="state">🌡️ Physical State</option>
                                        <option value="metalType">🔨 Metal Type</option>
                                        <option value="conductivity">⚡ Conductivity</option>
                                    </optgroup>
                                    <optgroup label="Magnetic Properties">
                                        <option value="magneticSusceptibility">🧲 Susceptibility</option>
                                        <option value="magneticPermeability">🔄 Permeability</option>
                                    </optgroup>
                                    <optgroup label="Electrical Properties">
                                        <option value="jouleHeating">🔥 Joule Heating</option>
                                        <option value="chargeStorage">🔋 Charge Storage</option>
                                    </optgroup>
                                    <optgroup label="Sort by Atomic Number">
                                        <option value="atomicNumber">🔢 Atomic Number</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        <div class="search-controls-compact">
                            <label class="search-label-compact" for="elementNumberSearch">#️⃣</label>
                            <input 
                                type="number" 
                                id="elementNumberSearch" 
                                class="search-input-compact" 
                                placeholder="1-118" 
                                min="1" 
                                max="118"
                                title="Enter element number (1-118)"
                            >
                            <button class="search-go-btn-compact" id="searchGoBtn" onclick="quiz.performSearch()">
                                🚀
                            </button>
                        </div>
                    </div>
                    
                    <!-- Row 2: Title, Progress, Navigation -->
                    <div class="header-info-row">
                        <div class="title-section">
                            <h1 class="quiz-title-compact">GL Periodic Quiz</h1>
                            <div class="quiz-stats-compact">
                                <span class="current-element-compact" id="currentElement">Element 1</span>
                                <span class="quiz-score-compact" id="quizScore">0%</span>
                            </div>
                        </div>
                        <div class="progress-section-compact">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                            <span class="progress-text-compact" id="progressText">0/118</span>
                        </div>
                        <div class="navigation-section">
                            <button class="nav-btn-compact" id="prevBtn" onclick="quiz.previousElement()" title="Previous Element (Ctrl+←)">⬅️</button>
                            <button class="nav-btn-compact reset" id="resetBtn" onclick="quiz.resetToFirst()" title="Reset to First Element (Page 1)">🔄</button>
                            <button class="nav-btn-compact primary" id="nextBtn" onclick="quiz.nextElement()" title="Next Element (Ctrl+→)">➡️</button>
                        </div>
                    </div>
                </header>
                
                <div class="slides-container">
                    <div class="slides-wrapper" id="slidesWrapper">
                        <!-- Slides will be generated here -->
                    </div>
                </div>
                
                <!-- Floating Help Popup -->
                <div id="helpPopup" class="help-popup">
                    <div class="help-popup-header">
                        <span class="help-popup-icon" id="helpIcon">💡</span>
                        <span id="helpTitle">Field Help</span>
                    </div>
                    <div class="help-popup-content" id="helpContent">
                        Select a field to see help information
                    </div>
                </div>
            </div>
        `;

        this.generateSlides();
        this.createHelpSystem();
        this.attachHelpEventListeners();
        this.setupControlSystems();
        this.initializeOrderMapping();
    }

    setupControlSystems() {
        this.setupSearchSystem();
        this.setupOrderSystem();
    }

    setupSearchSystem() {
        // Initialize search system
        this.searchFields = {
            elementNumber: {
                id: 'elementNumberSearch',
                type: 'number',
                min: 1,
                max: 118,
                validator: (value) => {
                    const num = parseInt(value);
                    return !isNaN(num) && num >= 1 && num <= 118;
                },
                processor: (value) => {
                    // Convert atomic number to current ordered index
                    const atomicNumber = parseInt(value);
                    const originalIndex = atomicNumber - 1;
                    return this.getOrderedIndexFromOriginal(originalIndex);
                }
            }
            // Future search fields will be added here
        };

        // Add event listeners for search functionality
        setTimeout(() => {
            // Element number search input
            const elementNumberInput = document.getElementById('elementNumberSearch');
            if (elementNumberInput) {
                // Enter key search
                elementNumberInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.performSearch();
                    }
                });

                // Input validation
                elementNumberInput.addEventListener('input', (e) => {
                    this.validateSearchInput(e.target);
                });

                // Focus handling
                elementNumberInput.addEventListener('focus', () => {
                    this.hideHelpPopup(); // Hide any open help popup
                });
            }

            // Go button
            const goBtn = document.getElementById('searchGoBtn');
            if (goBtn) {
                // Remove onclick attribute and add proper event listener
                goBtn.removeAttribute('onclick');
                goBtn.addEventListener('click', () => {
                    this.performSearch();
                });
            }
        }, 100);
    }

    setupOrderSystem() {
        // Initialize ordering criteria
        this.orderCriteria = {
            default: {
                name: 'Atomic Number',
                sortFunction: (a, b) => a.atomicNumber - b.atomicNumber
            },
            state: {
                name: 'Physical State',
                sortFunction: (a, b) => {
                    const stateOrder = { 'S': 0, 'L': 1, 'G': 2 };
                    const stateCompare = stateOrder[a.state] - stateOrder[b.state];
                    return stateCompare !== 0 ? stateCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            metalType: {
                name: 'Metal Type',
                sortFunction: (a, b) => {
                    const typeOrder = { 'M': 0, 'N': 1, 'T': 2 };
                    const typeCompare = typeOrder[a.metalType] - typeOrder[b.metalType];
                    return typeCompare !== 0 ? typeCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            conductivity: {
                name: 'Conductivity',
                sortFunction: (a, b) => {
                    const condOrder = { 'C': 0, 'S': 1, 'I': 2 };
                    const condCompare = condOrder[a.conductivity] - condOrder[b.conductivity];
                    return condCompare !== 0 ? condCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            magneticSusceptibility: {
                name: 'Magnetic Susceptibility',
                sortFunction: (a, b) => {
                    const magOrder = { 'F': 0, 'P': 1, 'D': 2 };
                    const magCompare = magOrder[a.magneticSusceptibility] - magOrder[b.magneticSusceptibility];
                    return magCompare !== 0 ? magCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            magneticPermeability: {
                name: 'Magnetic Permeability',
                sortFunction: (a, b) => {
                    const permOrder = { 'H': 0, 'M': 1, 'L': 2, 'N': 3 };
                    const permCompare = permOrder[a.magneticPermeability] - permOrder[b.magneticPermeability];
                    return permCompare !== 0 ? permCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            jouleHeating: {
                name: 'Joule Heating',
                sortFunction: (a, b) => {
                    const jouleOrder = { 'H': 0, 'M': 1, 'L': 2, 'N': 3 };
                    const jouleCompare = jouleOrder[a.jouleHeating] - jouleOrder[b.jouleHeating];
                    return jouleCompare !== 0 ? jouleCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            chargeStorage: {
                name: 'Charge Storage',
                sortFunction: (a, b) => {
                    const chargeOrder = { 'H': 0, 'M': 1, 'L': 2, 'N': 3 };
                    const chargeCompare = chargeOrder[a.chargeStorage] - chargeOrder[b.chargeStorage];
                    return chargeCompare !== 0 ? chargeCompare : a.atomicNumber - b.atomicNumber;
                }
            },
            atomicNumber: {
                name: 'Atomic Number',
                sortFunction: (a, b) => a.atomicNumber - b.atomicNumber
            }
        };

        // Add event listeners for order dropdowns
        setTimeout(() => {
            const orderDropdown = document.getElementById('orderDropdown');
            const subOrderDropdown = document.getElementById('subOrderDropdown');
            
            if (orderDropdown) {
                orderDropdown.addEventListener('change', (e) => {
                    this.changeOrder(e.target.value, this.currentSubOrder);
                });
                
                // Restore saved primary order
                const savedOrder = this.quizState.currentOrder || 'default';
                orderDropdown.value = savedOrder;
            }
            
            if (subOrderDropdown) {
                subOrderDropdown.addEventListener('change', (e) => {
                    this.changeSubOrder(e.target.value);
                });
                
                // Restore saved secondary order
                const savedSubOrder = this.quizState.currentSubOrder || 'none';
                subOrderDropdown.value = savedSubOrder;
            }
            
            // Apply saved orders if they're not default
            if (this.quizState.currentOrder !== 'default' || this.quizState.currentSubOrder !== 'none') {
                this.changeOrder(this.quizState.currentOrder || 'default', this.quizState.currentSubOrder || 'none');
            }
        }, 100);
    }

    initializeOrderMapping() {
        // Create initial mapping for default order
        this.updateOrderMapping();
    }

    changeOrder(orderType, subOrderType = null) {
        if (!this.orderCriteria[orderType]) {
            console.error('Invalid order type:', orderType);
            return;
        }

        // Save current user answers before reordering
        this.saveCurrentUserAnswers();

        // Hide help popup during reorder
        this.hideHelpPopup();

        // Update current order
        this.currentOrder = orderType;
        if (subOrderType !== null) {
            this.currentSubOrder = subOrderType;
        }

        // Sort elements according to the new criteria (with sub-ordering)
        this.orderedElements = [...this.elements].sort(this.createDualSortFunction(orderType, this.currentSubOrder));

        // Update mapping
        this.updateOrderMapping();

        // Regenerate slides with new order
        this.regenerateSlides();

        // Find current element in new order
        const currentElementAtomicNumber = this.elements[this.getOriginalIndexFromOrdered(this.currentElementIndex)].atomicNumber;
        this.currentElementIndex = this.getOrderedIndexFromAtomicNumber(currentElementAtomicNumber);

        // Navigate to the current element in new order
        this.slideToElement(this.currentElementIndex);

        // Restore user answers
        this.restoreUserAnswers();

        // Update progress and save state
        this.updateProgress();
        this.saveProgress();

        // Show notification
        let notificationText = `Reordered by ${this.orderCriteria[orderType].name}`;
        if (this.currentSubOrder !== 'none' && this.orderCriteria[this.currentSubOrder]) {
            notificationText += ` → ${this.orderCriteria[this.currentSubOrder].name}`;
        }
        this.showSearchSuccess(notificationText);
    }

    changeSubOrder(subOrderType) {
        // Update sub-order and reapply sorting
        this.currentSubOrder = subOrderType;
        this.changeOrder(this.currentOrder, subOrderType);
    }

    createDualSortFunction(primaryOrder, secondaryOrder) {
        return (a, b) => {
            // Primary sorting
            let primaryCompare = 0;
            if (primaryOrder === 'default') {
                primaryCompare = a.atomicNumber - b.atomicNumber;
            } else if (this.orderCriteria[primaryOrder]) {
                primaryCompare = this.getSinglePropertyCompare(a, b, primaryOrder);
            }

            // If primary criteria are equal, apply secondary sorting
            if (primaryCompare === 0 && secondaryOrder !== 'none' && this.orderCriteria[secondaryOrder]) {
                if (secondaryOrder === 'atomicNumber') {
                    return a.atomicNumber - b.atomicNumber;
                } else {
                    const secondaryCompare = this.getSinglePropertyCompare(a, b, secondaryOrder);
                    return secondaryCompare !== 0 ? secondaryCompare : a.atomicNumber - b.atomicNumber;
                }
            }

            // If primary criteria are not equal, or no secondary order, use primary result
            return primaryCompare !== 0 ? primaryCompare : a.atomicNumber - b.atomicNumber;
        };
    }

    getSinglePropertyCompare(a, b, propertyType) {
        switch (propertyType) {
            case 'state': {
                const stateOrder = { 'S': 0, 'L': 1, 'G': 2 };
                return stateOrder[a.state] - stateOrder[b.state];
            }
            case 'metalType': {
                const typeOrder = { 'M': 0, 'N': 1, 'T': 2 };
                return typeOrder[a.metalType] - typeOrder[b.metalType];
            }
            case 'conductivity': {
                const condOrder = { 'C': 0, 'S': 1, 'I': 2 };
                return condOrder[a.conductivity] - condOrder[b.conductivity];
            }
            case 'magneticSusceptibility': {
                const magOrder = { 'F': 0, 'P': 1, 'D': 2 };
                return magOrder[a.magneticSusceptibility] - magOrder[b.magneticSusceptibility];
            }
            case 'magneticPermeability': {
                const permOrder = { 'H': 0, 'M': 1, 'L': 2, 'N': 3 };
                return permOrder[a.magneticPermeability] - permOrder[b.magneticPermeability];
            }
            case 'jouleHeating': {
                const jouleOrder = { 'H': 0, 'M': 1, 'L': 2, 'N': 3 };
                return jouleOrder[a.jouleHeating] - jouleOrder[b.jouleHeating];
            }
            case 'chargeStorage': {
                const chargeOrder = { 'H': 0, 'M': 1, 'L': 2, 'N': 3 };
                return chargeOrder[a.chargeStorage] - chargeOrder[b.chargeStorage];
            }
            case 'atomicNumber': {
                return a.atomicNumber - b.atomicNumber;
            }
            default:
                return a.atomicNumber - b.atomicNumber;
        }
    }

    updateOrderMapping() {
        // Create mapping from original index to ordered index and vice versa
        this.orderMapping = {};
        this.reverseOrderMapping = {};

        this.orderedElements.forEach((element, orderedIndex) => {
            const originalIndex = element.atomicNumber - 1;
            this.orderMapping[originalIndex] = orderedIndex;
            this.reverseOrderMapping[orderedIndex] = originalIndex;
        });
    }

    getOrderedIndexFromOriginal(originalIndex) {
        return this.orderMapping[originalIndex] !== undefined ? this.orderMapping[originalIndex] : -1;
    }

    getOriginalIndexFromOrdered(orderedIndex) {
        return this.reverseOrderMapping[orderedIndex] !== undefined ? this.reverseOrderMapping[orderedIndex] : -1;
    }

    getOrderedIndexFromAtomicNumber(atomicNumber) {
        const originalIndex = atomicNumber - 1;
        return this.getOrderedIndexFromOriginal(originalIndex);
    }

    saveCurrentUserAnswers() {
        // Save all current input values before reordering
        document.querySelectorAll('.quiz-input').forEach(input => {
            const elementIndex = input.getAttribute('data-element');
            const field = input.getAttribute('data-field');
            
            if (elementIndex !== null && field !== null) {
                const key = `${elementIndex}-${field}`;
                if (!this.quizState.userAnswers) {
                    this.quizState.userAnswers = {};
                }
                this.quizState.userAnswers[key] = input.value;
            }
        });
    }

    restoreUserAnswers() {
        // Restore user answers after reordering
        if (!this.quizState.userAnswers) return;

        setTimeout(() => {
            Object.entries(this.quizState.userAnswers).forEach(([key, value]) => {
                const [elementIndex, field] = key.split('-');
                const input = document.getElementById(`${field}-${elementIndex}`);
                if (input && value) {
                    input.value = value;
                    this.checkAnswer(input);
                }
            });

            // Update all element scores
            for (let i = 0; i < this.totalElements; i++) {
                this.updateElementScore(i);
            }

            // Re-attach help event listeners
            this.attachHelpEventListeners();
        }, 100);
    }

    regenerateSlides() {
        // Clear existing slides
        const slidesWrapper = document.getElementById('slidesWrapper');
        if (slidesWrapper) {
            slidesWrapper.innerHTML = '';
        }

        // Generate new slides based on ordered elements
        this.orderedElements.forEach((element, index) => {
            const slide = this.createElementSlide(element, index);
            slidesWrapper.appendChild(slide);
        });

        // Add completion slide
        const completionSlide = this.createCompletionSlide();
        slidesWrapper.appendChild(completionSlide);
    }

    validateSearchInput(input) {
        const fieldName = Object.keys(this.searchFields).find(key => 
            this.searchFields[key].id === input.id
        );
        
        if (fieldName) {
            const field = this.searchFields[fieldName];
            const value = input.value.trim();
            
            if (value === '') {
                input.style.borderColor = '';
                input.style.backgroundColor = '';
                return true;
            }
            
            if (field.validator(value)) {
                input.style.borderColor = '#4caf50';
                input.style.backgroundColor = 'rgba(76, 175, 80, 0.05)';
                return true;
            } else {
                input.style.borderColor = '#f44336';
                input.style.backgroundColor = 'rgba(244, 67, 54, 0.05)';
                return false;
            }
        }
        return false;
    }

    performSearch() {
        // Check element number search
        const elementNumberInput = document.getElementById('elementNumberSearch');
        
        if (elementNumberInput && elementNumberInput.value.trim() !== '') {
            const value = elementNumberInput.value.trim();
            const field = this.searchFields.elementNumber;
            
            if (field.validator(value)) {
                const targetIndex = field.processor(value);
                this.navigateToElement(targetIndex, 'Element Number Search');
                return true;
            } else {
                this.showSearchError('Please enter a valid element number between 1 and 118');
                return false;
            }
        }

        // Future search logic will be added here for other search fields
        
        // If no search criteria provided
        this.showSearchError('Please enter an element number to search');
        return false;
    }

    navigateToElement(elementIndex, searchType = 'Search') {
        if (elementIndex < 0 || elementIndex >= this.totalElements) {
            this.showSearchError(`Element ${elementIndex + 1} is out of range (1-118)`);
            return false;
        }

        // Hide help popup during navigation
        this.hideHelpPopup();
        
        // Update current element index
        this.currentElementIndex = elementIndex;
        
        // Navigate to the element
        this.slideToElement(elementIndex);
        
        // Update progress
        this.saveProgress();
        
        // Show success feedback
        this.showSearchSuccess(`Navigated to Element ${elementIndex + 1}: ${this.elements[elementIndex].name}`);
        
        // Clear search input after successful navigation
        setTimeout(() => {
            const elementNumberInput = document.getElementById('elementNumberSearch');
            if (elementNumberInput) {
                elementNumberInput.value = '';
                elementNumberInput.style.borderColor = '';
                elementNumberInput.style.backgroundColor = '';
            }
        }, 1000);
        
        return true;
    }

    showSearchError(message) {
        // Create or update error notification
        this.showSearchNotification(message, 'error');
    }

    showSearchSuccess(message) {
        // Create or update success notification
        this.showSearchNotification(message, 'success');
    }

    showSearchNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.getElementById('searchNotification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'searchNotification';
        notification.className = `search-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Method to add future search fields (extensible system)
    addSearchField(fieldName, config) {
        this.searchFields[fieldName] = config;
        
        // Show divider if this is the second field
        if (Object.keys(this.searchFields).length === 2) {
            const divider = document.getElementById('searchDivider');
            if (divider) {
                divider.style.display = 'block';
            }
        }
        
        // Add field to UI
        const futureFieldsContainer = document.getElementById('futureSearchFields');
        if (futureFieldsContainer) {
            futureFieldsContainer.style.display = 'flex';
            
            const fieldHTML = `
                <div class="search-field">
                    <label class="search-label" for="${config.id}">
                        <span class="search-label-icon">${config.icon || '🔍'}</span>
                        <span>${config.label}</span>
                    </label>
                    <input 
                        type="${config.type || 'text'}" 
                        id="${config.id}" 
                        class="search-input ${config.className || ''}" 
                        placeholder="${config.placeholder || ''}" 
                        ${config.min ? `min="${config.min}"` : ''}
                        ${config.max ? `max="${config.max}"` : ''}
                        title="${config.title || ''}"
                    >
                </div>
            `;
            
            futureFieldsContainer.insertAdjacentHTML('beforeend', fieldHTML);
        }
    }

    attachHelpEventListeners() {
        // Wait for DOM to be ready, then attach direct listeners to each input
        setTimeout(() => {
            const inputs = document.querySelectorAll('.quiz-input[data-help-type]');
            inputs.forEach(input => {
                input.addEventListener('focus', (e) => {
                    const helpType = e.target.getAttribute('data-help-type');
                    if (helpType) {
                        this.currentlyFocusedInput = e.target;
                        // Clear any pending hide timeout
                        if (this.hideTimeout) {
                            clearTimeout(this.hideTimeout);
                            this.hideTimeout = null;
                        }
                        this.showHelpPopup(helpType);
                    }
                });

                input.addEventListener('blur', (e) => {
                    // Check if the blur is due to clicking on another input
                    setTimeout(() => {
                        // If no other input got focus, hide the popup
                        const activeElement = document.activeElement;
                        if (!activeElement || !activeElement.classList.contains('quiz-input')) {
                            this.currentlyFocusedInput = null;
                            this.hideHelpPopup();
                        }
                    }, 50);
                });
            });
        }, 100);
    }

    createHelpSystem() {
        this.helpContent = {
            symbol: {
                icon: '⚛️',
                title: 'Chemical Symbol',
                className: 'symbol-help',
                content: 'Enter the unique 1-3 letter abbreviation for this element.',
                examples: {
                    'H': 'Hydrogen',
                    'He': 'Helium',
                    'Li': 'Lithium',
                    'Ca': 'Calcium',
                    'Fe': 'Iron',
                    'Au': 'Gold'
                },
                note: 'Symbols are derived from English or Latin names'
            },
            name: {
                icon: '📝',
                title: 'Element Name',
                className: 'name-help',
                content: 'Enter the full English name of the element.',
                examples: {
                    'H': 'Hydrogen',
                    'O': 'Oxygen',
                    'C': 'Carbon',
                    'N': 'Nitrogen',
                    'Ca': 'Calcium',
                    'Fe': 'Iron'
                },
                note: 'Use proper capitalization (first letter uppercase)'
            },
            mass: {
                icon: '⚖️',
                title: 'Atomic Mass',
                className: 'mass-help',
                content: 'Enter the standard atomic mass in unified atomic mass units (u).',
                examples: {
                    'H': '1.008',
                    'He': '4.003',
                    'C': '12.01',
                    'O': '16.00',
                    'Ca': '40.08',
                    'Fe': '55.85'
                },
                note: 'Include decimal places as shown in periodic tables'
            },
            state: {
                icon: '🌡️',
                title: 'Physical State',
                className: 'properties-help',
                content: 'Enter the physical state of the element at room temperature (25°C).',
                examples: {
                    'S': 'Solid',
                    'L': 'Liquid',
                    'G': 'Gas'
                },
                note: 'Only Br and Hg are liquids at room temperature'
            },
            metalType: {
                icon: '🔨',
                title: 'Metal Classification',
                className: 'properties-help',
                content: 'Classify the element based on its metallic properties.',
                examples: {
                    'M': 'Metal',
                    'N': 'Non-metal',
                    'T': 'Metalloid (Semi-metal)'
                },
                note: 'Metalloids have properties between metals and non-metals'
            },
            conductivity: {
                icon: '⚡',
                title: 'Electrical Conductivity',
                className: 'properties-help',
                content: 'Describe how well the element conducts electricity.',
                examples: {
                    'C': 'Conductor',
                    'S': 'Semiconductor',
                    'I': 'Insulator'
                },
                note: 'Most metals are conductors, most non-metals are insulators'
            },
            magneticSusceptibility: {
                icon: '🧲',
                title: 'Magnetic Susceptibility',
                className: 'magnetic-help',
                content: 'Describes how the element responds to magnetic fields.',
                examples: {
                    'F': 'Ferromagnetic (strongly attracted)',
                    'P': 'Paramagnetic (weakly attracted)',
                    'D': 'Diamagnetic (weakly repelled)'
                },
                note: 'Only Fe, Co, Ni are ferromagnetic at room temperature'
            },
            magneticPermeability: {
                icon: '🔄',
                title: 'Magnetic Permeability',
                className: 'magnetic-help',
                content: 'Measures how easily magnetic field lines pass through the material.',
                examples: {
                    'H': 'High permeability',
                    'M': 'Medium permeability',
                    'L': 'Low permeability',
                    'N': 'Normal (≈ vacuum)'
                },
                note: 'Ferromagnetic materials have high permeability'
            },
            jouleHeating: {
                icon: '🔥',
                title: 'Joule Heating Effect',
                className: 'electrical-help',
                content: 'Describes how much heat is generated when current flows through the element.',
                examples: {
                    'H': 'High heating (high resistance)',
                    'M': 'Medium heating',
                    'L': 'Low heating',
                    'N': 'No significant heating'
                },
                note: 'Better conductors generate less heat when carrying current'
            },
            chargeStorage: {
                icon: '🔋',
                title: 'Charge Storage Capacity',
                className: 'electrical-help',
                content: 'Ability to store electrical charge, important for capacitor and battery applications.',
                examples: {
                    'H': 'High storage capacity',
                    'M': 'Medium storage capacity',
                    'L': 'Low storage capacity',
                    'N': 'No storage capacity'
                },
                note: 'Important for energy storage and electronic applications'
            }
        };
    }

    generateSlides() {
        const slidesWrapper = document.getElementById('slidesWrapper');
        
        // Generate a slide for each element
        this.elements.forEach((element, index) => {
            const slide = this.createElementSlide(element, index);
            slidesWrapper.appendChild(slide);
        });

        // Add completion slide
        const completionSlide = this.createCompletionSlide();
        slidesWrapper.appendChild(completionSlide);
    }

    createElementSlide(element, index) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.setAttribute('data-element', index);

        slide.innerHTML = `
            <div class="element-card">
                <div class="element-header">
                    <div class="element-number">Element ${element.atomicNumber} of 118</div>
                    <div class="element-symbol-display ${element.classification}" id="symbolDisplay-${index}">
                        ${element.symbol}
                    </div>
                    <div class="element-classification ${element.classification}">
                        ${this.formatClassification(element.classification)}
                    </div>
                </div>

                <div class="score-display">
                    <div class="score-number" id="elementScore-${index}">0</div>
                    <div class="score-total">out of 10 questions</div>
                </div>

                <div class="quiz-fields">
                    <div class="quiz-field">
                        <label for="symbol-${index}">Symbol:</label>
                        <input type="text" 
                               id="symbol-${index}" 
                               class="quiz-input" 
                               data-field="symbol" 
                               data-element="${index}"
                               data-answer="${element.symbol}"
                               data-help-type="symbol"
                               placeholder="Enter symbol"
                               maxlength="3">
                    </div>

                    <div class="quiz-field">
                        <label for="name-${index}">Name:</label>
                        <input type="text" 
                               id="name-${index}" 
                               class="quiz-input" 
                               data-field="name" 
                               data-element="${index}"
                               data-answer="${element.name}"
                               data-help-type="name"
                               placeholder="Enter element name">
                    </div>

                    <div class="quiz-field full-width">
                        <label for="mass-${index}">Atomic Mass:</label>
                        <input type="text" 
                               id="mass-${index}" 
                               class="quiz-input" 
                               data-field="mass" 
                               data-element="${index}"
                               data-answer="${element.atomicMass}"
                               data-help-type="mass"
                               placeholder="Enter atomic mass">
                    </div>

                    <div class="quiz-field">
                        <label>Physical Properties:</label>
                        <div class="input-group">
                            <input type="text" 
                                   id="state-${index}" 
                                   class="quiz-input" 
                                   data-field="state" 
                                   data-element="${index}"
                                   data-answer="${element.state}"
                                   data-help-type="state"
                                   placeholder="State"
                                   maxlength="1">
                            <span class="input-separator">/</span>
                            <input type="text" 
                                   id="metalType-${index}" 
                                   class="quiz-input" 
                                   data-field="metalType" 
                                   data-element="${index}"
                                   data-answer="${element.metalType}"
                                   data-help-type="metalType"
                                   placeholder="Type"
                                   maxlength="1">
                            <span class="input-separator">/</span>
                            <input type="text" 
                                   id="conductivity-${index}" 
                                   class="quiz-input" 
                                   data-field="conductivity" 
                                   data-element="${index}"
                                   data-answer="${element.conductivity}"
                                   data-help-type="conductivity"
                                   placeholder="Cond."
                                   maxlength="1">
                        </div>
                    </div>

                    <div class="quiz-field">
                        <label>Magnetic Properties:</label>
                        <div class="input-group">
                            <input type="text" 
                                   id="magneticSusceptibility-${index}" 
                                   class="quiz-input" 
                                   data-field="magneticSusceptibility" 
                                   data-element="${index}"
                                   data-answer="${element.magneticSusceptibility}"
                                   data-help-type="magneticSusceptibility"
                                   placeholder="Sus."
                                   maxlength="1">
                            <span class="input-separator">/</span>
                            <input type="text" 
                                   id="magneticPermeability-${index}" 
                                   class="quiz-input" 
                                   data-field="magneticPermeability" 
                                   data-element="${index}"
                                   data-answer="${element.magneticPermeability}"
                                   data-help-type="magneticPermeability"
                                   placeholder="Perm."
                                   maxlength="1">
                        </div>
                    </div>

                    <div class="quiz-field">
                        <label>Electrical Properties:</label>
                        <div class="input-group">
                            <input type="text" 
                                   id="jouleHeating-${index}" 
                                   class="quiz-input" 
                                   data-field="jouleHeating" 
                                   data-element="${index}"
                                   data-answer="${element.jouleHeating}"
                                   data-help-type="jouleHeating"
                                   placeholder="Joule"
                                   maxlength="1">
                            <span class="input-separator">/</span>
                            <input type="text" 
                                   id="chargeStorage-${index}" 
                                   class="quiz-input" 
                                   data-field="chargeStorage" 
                                   data-element="${index}"
                                   data-answer="${element.chargeStorage}"
                                   data-help-type="chargeStorage"
                                   placeholder="Storage"
                                   maxlength="1">
                        </div>
                    </div>
                </div>

                <div class="quiz-actions">
                    <button class="action-btn btn-secondary" id="toggleAnswersBtn-${index}" onclick="quiz.toggleAnswers(${index})">
                        Show Answers
                    </button>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn btn-warning" onclick="quiz.resetElement(${index})">
                            Reset
                        </button>
                        <button class="action-btn btn-primary" onclick="quiz.checkAllAndNext(${index})">
                            Complete & Next
                        </button>
                    </div>
                </div>
            </div>
        `;

        return slide;
    }

    createCompletionSlide() {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.setAttribute('data-element', 'completion');

        slide.innerHTML = `
            <div class="completion-screen">
                <div class="completion-icon">🎉</div>
                <h2 class="completion-title">Congratulations!</h2>
                <p>You've completed the entire Periodic Table Quiz!</p>
                
                <div class="completion-stats">
                    <div class="stat-item">
                        <div class="stat-number" id="finalScore">0</div>
                        <div class="stat-label">Total Score</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="finalPercentage">0%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">118</div>
                        <div class="stat-label">Elements</div>
                    </div>
                </div>

                <div class="quiz-actions">
                    <button class="action-btn btn-primary" onclick="quiz.restart()">
                        Start Over
                    </button>
                    <button class="action-btn btn-secondary" onclick="quiz.reviewMistakes()">
                        Review Mistakes
                    </button>
                </div>
            </div>
        `;

        return slide;
    }

    setupEventListeners() {
        // Input event listeners for all quiz inputs
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quiz-input')) {
                this.checkAnswer(e.target);
                this.saveProgress();
            }
        });



        // Enter key navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('quiz-input')) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.moveToNextField(e.target);
                }
            }
            
            // Global navigation shortcuts
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousElement();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextElement();
                }
            }
        });

        // Prevent form submission on Enter
        document.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    showHelpPopup(helpType) {
        const popup = document.getElementById('helpPopup');
        const helpIcon = document.getElementById('helpIcon');
        const helpTitle = document.getElementById('helpTitle');
        const helpContent = document.getElementById('helpContent');
        
        if (!popup || !this.helpContent[helpType]) {
            return;
        }
        
        // Clear any pending hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        const help = this.helpContent[helpType];
        
        // Update popup content
        helpIcon.textContent = help.icon;
        helpTitle.textContent = help.title;
        
        // Create content HTML
        let contentHTML = `<p>${help.content}</p>`;
        
        if (help.examples) {
            contentHTML += `
                <div class="help-popup-examples">
                    <h6>Examples:</h6>
                    <div class="help-examples-grid">
            `;
            
            Object.entries(help.examples).forEach(([key, value]) => {
                contentHTML += `
                    <span class="help-example-key">${key}:</span>
                    <span class="help-example-value">${value}</span>
                `;
            });
            
            contentHTML += `</div></div>`;
        }
        
        if (help.note) {
            contentHTML += `<div class="help-popup-note">💡 ${help.note}</div>`;
        }
        
        helpContent.innerHTML = contentHTML;
        
        // Update popup class and show
        popup.className = `help-popup ${help.className}`;
        
        // Force reflow to ensure class change takes effect
        popup.offsetHeight;
        
        // Show popup
        popup.classList.add('show');
    }

    hideHelpPopup() {
        // Clear any pending timeouts first
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        const popup = document.getElementById('helpPopup');
        if (popup && popup.classList.contains('show')) {
            popup.classList.remove('show');
        }
    }

    checkAnswer(input) {
        const userAnswer = input.value.trim();
        const correctAnswer = input.getAttribute('data-answer');
        
        // Remove previous classes
        input.classList.remove('correct', 'incorrect');
        
        if (userAnswer === '') {
            // Empty input
            return;
        } else if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            input.classList.add('correct');
        } else {
            input.classList.add('incorrect');
        }
        
        this.updateElementScore(input.getAttribute('data-element'));
        this.updateProgress();
    }

    updateElementScore(elementIndex) {
        const inputs = document.querySelectorAll(`input[data-element="${elementIndex}"]`);
        let correct = 0;
        let total = inputs.length;
        
        inputs.forEach(input => {
            if (input.classList.contains('correct')) {
                correct++;
            }
        });
        
        const scoreElement = document.getElementById(`elementScore-${elementIndex}`);
        if (scoreElement) {
            scoreElement.textContent = correct;
        }
        
        // Save element score
        this.quizState.elementScores[elementIndex] = { correct, total };
    }

    updateProgress() {
        let totalCorrect = 0;
        let totalQuestions = this.totalElements * 10; // 10 questions per element
        
        Object.values(this.quizState.elementScores).forEach(score => {
            totalCorrect += score.correct;
        });
        
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${totalCorrect} / ${totalQuestions} (${percentage}%)`;
        }
        
        // Update quiz state
        this.quizState.totalCorrect = totalCorrect;
        this.quizState.percentage = percentage;
    }

    moveToNextField(currentInput) {
        const elementIndex = currentInput.getAttribute('data-element');
        const currentField = currentInput.getAttribute('data-field');
        
        // Field order
        const fieldOrder = ['symbol', 'name', 'mass', 'state', 'metalType', 'conductivity', 'magneticSusceptibility', 'magneticPermeability', 'jouleHeating', 'chargeStorage'];
        const currentFieldIndex = fieldOrder.indexOf(currentField);
        
        let nextInput = null;
        
        if (currentFieldIndex < fieldOrder.length - 1) {
            // Move to next field in same element
            const nextField = fieldOrder[currentFieldIndex + 1];
            nextInput = document.getElementById(`${nextField}-${elementIndex}`);
        } else {
            // Last field - move to next element or complete
            this.nextElement();
            return;
        }
        
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

    nextElement() {
        if (this.isTransitioning) return;
        
        if (this.currentElementIndex < this.totalElements) {
            this.currentElementIndex++;
            this.slideToElement(this.currentElementIndex);
            this.saveProgress();
        }
    }

    previousElement() {
        if (this.isTransitioning) return;
        
        if (this.currentElementIndex > 0) {
            this.currentElementIndex--;
            this.slideToElement(this.currentElementIndex);
            this.saveProgress();
        }
    }

    slideToElement(elementIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Hide help popup during transition
        this.hideHelpPopup();
        
        const slidesWrapper = document.getElementById('slidesWrapper');
        const translateX = -elementIndex * 100;
        
        slidesWrapper.style.transform = `translateX(${translateX}%)`;
        
        setTimeout(() => {
            this.isTransitioning = false;
            this.updateNavigationButtons();
            
            // Re-attach help event listeners for the new slide
            this.attachHelpEventListeners();
            
            // Focus first input of new element
            if (elementIndex < this.totalElements) {
                const firstInput = document.getElementById(`symbol-${elementIndex}`);
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }
        }, 600);
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentElementIndex === 0;
        }
        
        if (nextBtn) {
            if (this.currentElementIndex >= this.totalElements) {
                nextBtn.textContent = 'Complete';
            } else {
                nextBtn.textContent = 'Next →';
            }
        }
    }

    showCurrentElement() {
        this.slideToElement(this.currentElementIndex);
    }

    toggleAnswers(elementIndex) {
        const inputs = document.querySelectorAll(`input[data-element="${elementIndex}"]`);
        const toggleBtn = document.getElementById(`toggleAnswersBtn-${elementIndex}`);
        
        if (this.answersShown[elementIndex]) {
            // Hide answers - clear all inputs and remove styling
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
            });
            
            this.answersShown[elementIndex] = false;
            if (toggleBtn) {
                toggleBtn.textContent = 'Show Answers';
                toggleBtn.classList.remove('btn-info');
                toggleBtn.classList.add('btn-secondary');
            }
        } else {
            // Show answers - fill with correct answers
            inputs.forEach(input => {
                const correctAnswer = input.getAttribute('data-answer');
                input.value = correctAnswer;
                input.classList.remove('incorrect');
                input.classList.add('correct');
            });
            
            this.answersShown[elementIndex] = true;
            if (toggleBtn) {
                toggleBtn.textContent = 'Hide Answers';
                toggleBtn.classList.remove('btn-secondary');
                toggleBtn.classList.add('btn-info');
            }
        }
        
        this.updateElementScore(elementIndex);
        this.updateProgress();
        this.saveProgress();
    }

    resetElement(elementIndex) {
        const inputs = document.querySelectorAll(`input[data-element="${elementIndex}"]`);
        const toggleBtn = document.getElementById(`toggleAnswersBtn-${elementIndex}`);
        
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        });
        
        // Reset toggle state
        this.answersShown[elementIndex] = false;
        if (toggleBtn) {
            toggleBtn.textContent = 'Show Answers';
            toggleBtn.classList.remove('btn-info');
            toggleBtn.classList.add('btn-secondary');
        }
        
        this.updateElementScore(elementIndex);
        this.updateProgress();
        this.saveProgress();
        
        // Focus first input
        const firstInput = document.getElementById(`symbol-${elementIndex}`);
        if (firstInput) {
            firstInput.focus();
        }
    }

    checkAllAndNext(elementIndex) {
        const inputs = document.querySelectorAll(`input[data-element="${elementIndex}"]`);
        let allCorrect = true;
        
        inputs.forEach(input => {
            this.checkAnswer(input);
            if (!input.classList.contains('correct') && input.value.trim() !== '') {
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            setTimeout(() => this.nextElement(), 300);
        } else {
            // Highlight first incorrect field
            const firstIncorrect = document.querySelector(`input[data-element="${elementIndex}"].incorrect`);
            if (firstIncorrect) {
                firstIncorrect.focus();
                firstIncorrect.select();
            }
        }
    }

    restart() {
        this.currentElementIndex = 0;
        this.quizState = { elementScores: {}, totalCorrect: 0, percentage: 0, currentElement: 0 };
        this.answersShown = {}; // Reset all toggle states
        this.saveProgress();
        
        // Reset all inputs
        document.querySelectorAll('.quiz-input').forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        });
        
        // Reset scores and toggle buttons
        for (let i = 0; i < this.totalElements; i++) {
            const scoreElement = document.getElementById(`elementScore-${i}`);
            if (scoreElement) {
                scoreElement.textContent = '0';
            }
            
            const toggleBtn = document.getElementById(`toggleAnswersBtn-${i}`);
            if (toggleBtn) {
                toggleBtn.textContent = 'Show Answers';
                toggleBtn.classList.remove('btn-info');
                toggleBtn.classList.add('btn-secondary');
            }
        }
        
        this.updateProgress();
        this.slideToElement(0);
    }

    resetToFirst() {
        // Hide help popup
        this.hideHelpPopup();
        
        // Simply navigate to first element without clearing data
        this.currentElementIndex = 0;
        this.slideToElement(0);
        
        // Update progress display
        this.updateProgress();
        
        // Save current position
        this.saveProgress();
        
        // Show success notification
        this.showSearchSuccess("Reset to first element (Hydrogen)");
    }

    reviewMistakes() {
        // Find first element with mistakes
        for (let i = 0; i < this.totalElements; i++) {
            const inputs = document.querySelectorAll(`input[data-element="${i}"]`);
            const hasIncorrect = Array.from(inputs).some(input => 
                input.value.trim() !== '' && !input.classList.contains('correct')
            );
            
            if (hasIncorrect) {
                this.currentElementIndex = i;
                this.slideToElement(i);
                return;
            }
        }
        
        // No mistakes found, go to first element
        this.currentElementIndex = 0;
        this.slideToElement(0);
    }

    saveProgress() {
        this.quizState.currentElement = this.currentElementIndex;
        this.quizState.currentOrder = this.currentOrder;
        this.quizState.currentSubOrder = this.currentSubOrder;
        
        // Save all input values
        document.querySelectorAll('.quiz-input').forEach(input => {
            const elementIndex = input.getAttribute('data-element');
            const field = input.getAttribute('data-field');
            const key = `${elementIndex}-${field}`;
            
            if (!this.quizState.userAnswers) {
                this.quizState.userAnswers = {};
            }
            
            this.quizState.userAnswers[key] = input.value;
        });
        
        // Save toggle states
        this.quizState.answersShown = this.answersShown;
        
        localStorage.setItem('slidingQuizState', JSON.stringify(this.quizState));
    }

    loadQuizState() {
        const saved = localStorage.getItem('slidingQuizState');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            elementScores: {},
            totalCorrect: 0,
            percentage: 0,
            currentElement: 0,
            currentOrder: 'default',
            currentSubOrder: 'none',
            userAnswers: {},
            answersShown: {}
        };
    }

    restoreProgress() {
        this.currentElementIndex = this.quizState.currentElement || 0;
        
        // Restore current orders
        this.currentOrder = this.quizState.currentOrder || 'default';
        this.currentSubOrder = this.quizState.currentSubOrder || 'none';
        
        // Apply the saved orders if they're not default
        if (this.currentOrder !== 'default' || this.currentSubOrder !== 'none') {
            // Apply the saved order without triggering change event
            this.orderedElements = [...this.elements].sort(this.createDualSortFunction(this.currentOrder, this.currentSubOrder));
            this.updateOrderMapping();
            this.regenerateSlides();
        }
        
        // Restore toggle states
        if (this.quizState.answersShown) {
            this.answersShown = this.quizState.answersShown;
        }
        
        // Restore input values
        if (this.quizState.userAnswers) {
            setTimeout(() => {
                Object.entries(this.quizState.userAnswers).forEach(([key, value]) => {
                    const [elementIndex, field] = key.split('-');
                    const input = document.getElementById(`${field}-${elementIndex}`);
                    if (input) {
                        input.value = value;
                        this.checkAnswer(input);
                    }
                });
                
                // Restore toggle button states
                for (let i = 0; i < this.totalElements; i++) {
                    const toggleBtn = document.getElementById(`toggleAnswersBtn-${i}`);
                    if (toggleBtn && this.answersShown[i]) {
                        toggleBtn.textContent = 'Hide Answers';
                        toggleBtn.classList.remove('btn-secondary');
                        toggleBtn.classList.add('btn-info');
                    }
                }
                
                // Update all element scores
                for (let i = 0; i < this.totalElements; i++) {
                    this.updateElementScore(i);
                }
            }, 200);
        }
    }

    formatClassification(classification) {
        const classificationMap = {
            'alkali-metals': 'Alkali Metals',
            'alkaline-earth-metals': 'Alkaline Earth Metals',
            'transition-metals': 'Transition Metals',
            'post-transition-metals': 'Post-transition Metals',
            'metalloids': 'Metalloids',
            'nonmetals': 'Nonmetals',
            'halogens': 'Halogens',
            'noble-gases': 'Noble Gases',
            'lanthanides': 'Lanthanides',
            'actinides': 'Actinides'
        };
        
        return classificationMap[classification] || classification;
    }
}

// Initialize quiz when DOM is loaded
let quiz;
document.addEventListener('DOMContentLoaded', function() {
    quiz = new SlidingPeriodicQuiz();
});

// Global functions for button clicks
window.quiz = quiz;
window.quiz = quiz;