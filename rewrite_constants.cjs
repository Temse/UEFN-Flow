const fs = require('fs');

const code = `
import { Column, Task, ProjectTemplate } from './types';

export const getInitialColumns = (lang: string = 'de'): Column[] => [
  { id: 'pre-production', title: lang === 'en' ? '📝 Pre-Production' : '📝 Pre-Production' },
  { id: 'environment', title: lang === 'en' ? '🛠️ Environment & Art' : '🛠️ Environment & Art' },
  { id: 'logic', title: lang === 'en' ? '⚙️ Logic & Verse' : '⚙️ Logic & Verse' },
  { id: 'optimization', title: lang === 'en' ? '🧹 Optimization' : '🧹 Optimization' },
  { id: 'release', title: lang === 'en' ? '🎮 Playtesting & Release' : '🎮 Playtesting & Release' },
];

export const getTemplateTasks = (template: ProjectTemplate, lang: string = 'de'): Task[] => {
  const isEn = lang === 'en';
  
  const baseTasks: Task[] = [
    // Pre-Production
    {
      id: 'task-1',
      columnId: 'pre-production',
      title: isEn ? 'Game Loop & Core Mechanics' : 'Game Loop & Core Mechanics',
      description: isEn ? 'Define the rules and goal of the game.' : 'Definiere die Regeln und das Ziel des Spiels.',
      isCritical: true,
      subTasks: [
        { id: 'st-1-1', title: isEn ? 'Set win conditions' : 'Siegbedingungen festlegen', completed: false },
        { id: 'st-1-2', title: isEn ? 'Determine number of rounds' : 'Rundenanzahl bestimmen', completed: false },
        { id: 'st-1-3', title: isEn ? 'Player count (Min/Max)' : 'Spieleranzahl (Min/Max)', completed: false },
      ],
      tips: [isEn ? 'Keep it simple for the first version.' : 'Halte es für die erste Version simpel.'],
      notes: '',
    },
    {
      id: 'task-2',
      columnId: 'pre-production',
      title: isEn ? 'Reference Images (Moodboard)' : 'Referenz-Bilder (Moodboard)',
      description: isEn ? 'Collect ideas for the visual style.' : 'Sammle Ideen für den visuellen Stil.',
      subTasks: [
        { id: 'st-2-1', title: isEn ? 'Create Pinterest/ArtStation board' : 'Pinterest/ArtStation Board erstellen', completed: false },
        { id: 'st-2-2', title: isEn ? 'Set color scheme' : 'Farbschema festlegen', completed: false },
      ],
      tips: [isEn ? 'Colors create the atmosphere.' : 'Farben machen die Atmosphäre aus.'],
      notes: '',
    },
    // Environment & Art
    {
      id: 'task-3',
      columnId: 'environment',
      title: isEn ? 'Greyboxing / Layout' : 'Greyboxing / Layout',
      description: isEn ? 'Block out the level with simple shapes.' : 'Das Level mit simplen Blöcken abstecken.',
      isCritical: true,
      subTasks: [
        { id: 'st-3-1', title: isEn ? 'Block main paths' : 'Hauptwege blocken', completed: false },
        { id: 'st-3-2', title: isEn ? 'Check lines of sight' : 'Sichtlinien prüfen', completed: false },
        { id: 'st-3-3', title: isEn ? 'Scale-check with player dummy' : 'Scale-Check mit Spieler-Dummy', completed: false },
      ],
      tips: [isEn ? 'Do not detail yet, just test the gameplay.' : 'Noch nicht detaillieren, nur das Gameplay testen.'],
      notes: '',
    },
    {
      id: 'task-4',
      columnId: 'environment',
      title: isEn ? 'Terrain Sculpting' : 'Terrain Sculpting',
      description: isEn ? 'Landscape design.' : 'Landschaftsgestaltung.',
      subTasks: [
        { id: 'st-4-1', title: isEn ? 'Form mountains and valleys' : 'Berge und Täler formen', completed: false },
        { id: 'st-4-2', title: isEn ? 'Paint material layers (Grass, Rock)' : 'Material Layers malen (Gras, Stein)', completed: false },
      ],
      tips: [isEn ? 'Use the Erosion Tool for realistic mountains.' : 'Nutze das Erosion Tool für realistische Berge.'],
      notes: '',
    },
    {
      id: 'task-5',
      columnId: 'environment',
      title: isEn ? 'Props & Set Dressing' : 'Props & Set Dressing',
      description: isEn ? 'Bring life to the map.' : 'Leben in die Map bringen.',
      subTasks: [
        { id: 'st-5-1', title: isEn ? 'Place main buildings' : 'Hauptgebäude platzieren', completed: false },
        { id: 'st-5-2', title: isEn ? 'Nature elements (Trees, Rocks)' : 'Natur-Elemente (Bäume, Steine)', completed: false },
        { id: 'st-5-3', title: isEn ? 'Small details (Trash, Crates)' : 'Kleine Details (Müll, Kisten)', completed: false },
      ],
      tips: [isEn ? 'Rotate and scale props so they look natural.' : 'Rotiere und skaliere Props, damit sie natürlich wirken.'],
      notes: '',
    },
    {
      id: 'task-6',
      columnId: 'environment',
      title: isEn ? 'Lumen Lighting & Sky Light Setup' : 'Lumen Lighting & Sky Light Setup',
      description: isEn ? 'Global illumination and sky.' : 'Globale Beleuchtung und Himmel.',
      subTasks: [
        { id: 'st-6-1', title: isEn ? 'Orient Directional Light' : 'Directional Light ausrichten', completed: false },
        { id: 'st-6-2', title: isEn ? 'Adjust Sky Atmosphere' : 'Sky Atmosphere anpassen', completed: false },
        { id: 'st-6-3', title: isEn ? 'Add Post Process Volume' : 'Post Process Volume hinzufügen', completed: false },
      ],
      tips: [isEn ? 'Lighting changes the whole feel of the map.' : 'Licht verändert das komplette Gefühl der Map.'],
      notes: '',
    },
    // Logic
    {
      id: 'task-7',
      columnId: 'logic',
      title: isEn ? 'Spawnpads & Team Settings' : 'Spawnpads & Team Settings',
      description: isEn ? 'Where players spawn and their loadout.' : 'Wo Spieler spawnen und ihr Loadout.',
      isCritical: true,
      subTasks: [
        { id: 'st-7-1', title: isEn ? 'Place Player Spawners' : 'Player Spawner platzieren', completed: false },
        { id: 'st-7-2', title: isEn ? 'Team Settings & Inventory Device' : 'Team Settings & Inventory Device', completed: false },
      ],
      tips: [isEn ? 'Ensure spawns are facing the right direction.' : 'Achte darauf, dass die Spawns in die richtige Richtung zeigen.'],
      notes: '',
    },
    {
      id: 'task-8',
      columnId: 'logic',
      title: isEn ? 'End-Game Condition Setup' : 'End-Game Condition einrichten',
      description: isEn ? 'When does the game end?' : 'Wann ist das Spiel vorbei?',
      isCritical: true,
      subTasks: [
        { id: 'st-8-1', title: isEn ? 'Configure End Game Device' : 'End Game Device konfigurieren', completed: false },
        { id: 'st-8-2', title: isEn ? 'Score Manager (optional)' : 'Score Manager (optional)', completed: false },
      ],
      tips: [isEn ? 'Check win conditions in the Island Settings.' : 'Prüfe die Siegbedingungen in den Island Settings.'],
      notes: '',
    },
    // Optimization
    {
      id: 'task-opt-1',
      columnId: 'optimization',
      title: isEn ? 'Generate HLODs' : 'HLODs generieren',
      description: isEn ? 'Important for performance at a distance.' : 'Wichtig für Performance auf Distanz.',
      isCritical: true,
      subTasks: [
        { id: 'st-opt-1-1', title: isEn ? 'Divide level into grid' : 'Level in Grid einteilen', completed: false },
        { id: 'st-opt-1-2', title: isEn ? 'Assign HLOD Layer' : 'HLOD Layer zuweisen', completed: false },
        { id: 'st-opt-1-3', title: isEn ? 'Click Build HLODs' : 'Build HLODs klicken', completed: false },
      ],
      tips: [isEn ? 'Window -> World Partition -> HLOD Editor.' : 'Window -> World Partition -> HLOD Editor.'],
      notes: '',
    },
    {
      id: 'task-opt-2',
      columnId: 'optimization',
      title: isEn ? 'NavMesh Rebuild' : 'NavMesh Rebuild',
      description: isEn ? 'Update AI navigation.' : 'KI-Navigation aktualisieren.',
      subTasks: [
        { id: 'st-opt-2-1', title: isEn ? 'Check Nav Mesh Bounds Volume' : 'Nav Mesh Bounds Volume prüfen', completed: false },
        { id: 'st-opt-2-2', title: isEn ? 'Press P to visualize' : 'P drücken zum Visualisieren', completed: false },
      ],
      tips: [isEn ? 'Crucial for Guards and Wildlife.' : 'Wichtig für Guards und Wildtiere.'],
      notes: '',
    },
    {
      id: 'task-opt-3',
      columnId: 'optimization',
      title: isEn ? 'Perform Memory Check' : 'Memory Check durchführen',
      description: isEn ? 'Stay under the 100k memory limit.' : 'Bleibe unter dem 100k Memory Limit.',
      isCritical: true,
      subTasks: [
        { id: 'st-opt-3-1', title: isEn ? 'Open Project Size Tool' : 'Project Size Tool öffnen', completed: false },
        { id: 'st-opt-3-2', title: isEn ? 'Identify expensive assets' : 'Teure Assets identifizieren', completed: false },
      ],
      tips: [isEn ? 'Reuse assets to save memory.' : 'Verwende Assets wieder, um Memory zu sparen.'],
      notes: '',
    },
    {
      id: 'task-opt-4',
      columnId: 'optimization',
      title: isEn ? 'Check World Partition Settings' : 'World Partition Settings prüfen',
      description: isEn ? 'Load and unload areas dynamically.' : 'Lade und entlade Bereiche dynamisch.',
      subTasks: [
        { id: 'st-opt-4-1', title: isEn ? 'Adjust Loading Range' : 'Loading Range anpassen', completed: false },
        { id: 'st-opt-4-2', title: isEn ? 'Check Data Layers' : 'Data Layers prüfen', completed: false },
      ],
      tips: [isEn ? 'Large maps need clean World Partitioning.' : 'Große Maps brauchen sauberes World Partitioning.'],
      notes: '',
    },
    // Release
    {
      id: 'task-rel-1',
      columnId: 'release',
      title: isEn ? 'Private Playtest (Multiplayer)' : 'Private Playtest (Multiplayer)',
      description: isEn ? 'Test with real players.' : 'Teste mit echten Spielern.',
      subTasks: [
        { id: 'st-rel-1-1', title: isEn ? 'Publish Private Version' : 'Private Version publizieren', completed: false },
        { id: 'st-rel-1-2', title: isEn ? 'Send codes to testers' : 'Codes an Tester senden', completed: false },
      ],
      tips: [isEn ? 'Use the Creator Portal for playtest groups.' : 'Nutze das Creator Portal für Playtest-Gruppen.'],
      notes: '',
    },
    {
      id: 'task-rel-loc',
      columnId: 'release',
      title: isEn ? 'Localization (Lokalisieren)' : 'Lokalisieren (Localization)',
      description: isEn ? 'Translate your map for more players.' : 'Übersetze deine Map für mehr Spieler.',
      isCritical: true,
      subTasks: [
        { id: 'st-rel-loc-1', title: isEn ? 'Generate Localization files' : 'Localization Dateien generieren', completed: false },
        { id: 'st-rel-loc-2', title: isEn ? 'Translate texts (e.g. English)' : 'Texte übersetzen (z.B. Englisch)', completed: false },
        { id: 'st-rel-loc-3', title: isEn ? 'Test in-game' : 'Im Spiel testen', completed: false },
      ],
      tips: [isEn ? 'More languages = larger player base.' : 'Mehr Sprachen = größere Spielerbasis.'],
      notes: '',
    },
    {
      id: 'task-rel-2',
      columnId: 'release',
      title: isEn ? 'Create 1920x1080 Thumbnail' : 'Thumbnail 1920x1080 erstellen',
      description: isEn ? 'The face of your map.' : 'Das Gesicht deiner Map.',
      subTasks: [
        { id: 'st-rel-2-1', title: isEn ? 'Take High-Res Screenshot in UEFN' : 'High-Res Screenshot in UEFN', completed: false },
        { id: 'st-rel-2-2', title: isEn ? 'Add Logo & Text' : 'Logo & Text hinzufügen', completed: false },
      ],
      tips: [isEn ? 'No clickbait arrows, Epic prefers clean thumbnails.' : 'Keine Clickbait-Pfeile, Epic mag saubere Thumbnails.'],
      notes: '',
    },
    {
      id: 'task-rel-3',
      columnId: 'release',
      title: isEn ? 'Creator Portal: IARC Rating & Release' : 'Creator Portal: IARC Rating & Release',
      description: isEn ? 'The final step.' : 'Der finale Schritt.',
      subTasks: [
        { id: 'st-rel-3-1', title: isEn ? 'Fill out IARC questionnaire' : 'IARC Fragebogen ausfüllen', completed: false },
        { id: 'st-rel-3-2', title: isEn ? 'Map Description & Tags' : 'Map-Beschreibung & Tags', completed: false },
        { id: 'st-rel-3-3', title: isEn ? 'Publish for Review' : 'Publish zur Review', completed: false },
      ],
      tips: [isEn ? 'Check all copyright rules before uploading.' : 'Prüfe alle Copyright-Regeln vor dem Upload.'],
      notes: '',
    },
  ];

  const templateSpecificTasks: Task[] = [];
  const addTasks = (tasks: Task[]) => templateSpecificTasks.push(...tasks);

  if (template === 'zone-wars') {
    addTasks([
      {
        id: 'zw-1',
        columnId: 'logic',
        title: isEn ? 'Storm Controller & Beacon Setup' : 'Storm Controller & Beacon Setup',
        description: isEn ? 'The zone must move.' : 'Die Zone muss sich bewegen.',
        subTasks: [
          { id: 'st-zw-1-1', title: isEn ? 'Place Basic Storm Controller' : 'Basic Storm Controller platzieren', completed: false },
          { id: 'st-zw-1-2', title: isEn ? 'Define phases' : 'Phasen definieren', completed: false },
        ],
        tips: [isEn ? 'Use Advanced Storm Beacon for complex movements.' : 'Nutze Advanced Storm Beacon für komplexe Bewegungen.'],
        notes: '',
      },
      {
        id: 'zw-2',
        columnId: 'logic',
        title: isEn ? 'Randomized Loadout Granters' : 'Randomized Loadout Granters',
        description: isEn ? 'Random weapons for players.' : 'Zufällige Waffen für Spieler.',
        subTasks: [
          { id: 'st-zw-2-1', title: isEn ? 'Fill Item Granters' : 'Item Granters befüllen', completed: false },
          { id: 'st-zw-2-2', title: isEn ? 'Setup randomization logic' : 'Zufalls-Logik einstellen', completed: false },
        ],
        tips: [isEn ? 'Verse can help distribute loadouts more fairly.' : 'Verse kann hier helfen, Loadouts fairer zu verteilen.'],
        notes: '',
      }
    ]);
  }

  if (template === 'tycoon') {
    addTasks([
      {
        id: 'ty-1',
        columnId: 'logic',
        title: isEn ? 'Button Devices (Purchase Stations)' : 'Button Devices (Kauf-Stationen)',
        description: isEn ? 'Build the economy system.' : 'Wirtschaftssystem aufbauen.',
        subTasks: [
          { id: 'st-ty-1-1', title: isEn ? 'Conditional Buttons for purchases' : 'Conditional Buttons für Käufe', completed: false },
          { id: 'st-ty-1-2', title: isEn ? 'Currency (Gold) Setup' : 'Währung (Gold) Setup', completed: false },
        ],
        tips: [isEn ? 'Link Buttons with Visual Effects for feedback.' : 'Verknüpfe Buttons mit Visual Effects für Feedback.'],
        notes: '',
      },
      {
        id: 'ty-2',
        columnId: 'logic',
        title: isEn ? 'Vending Machines' : 'Vending Machines',
        description: isEn ? 'Sell weapons and items.' : 'Waffen und Items verkaufen.',
        subTasks: [
          { id: 'st-ty-2-1', title: isEn ? 'Set prices' : 'Preise festlegen', completed: false },
          { id: 'st-ty-2-2', title: isEn ? 'Limit stock (optional)' : 'Bestand limitieren (optional)', completed: false },
        ],
        tips: [isEn ? 'Vending Machines are intuitive for players.' : 'Vending Machines sind intuitiv für Spieler.'],
        notes: '',
      },
      {
        id: 'ty-3',
        columnId: 'logic',
        title: isEn ? 'Player Save Device' : 'Player Save Device',
        description: isEn ? 'Save progress across sessions.' : 'Fortschritt über Sessions speichern.',
        subTasks: [
          { id: 'st-ty-3-1', title: isEn ? 'Place Save Point Device' : 'Save Point Device platzieren', completed: false },
          { id: 'st-ty-3-2', title: isEn ? 'Auto-Save intervals' : 'Auto-Save Intervalle', completed: false },
        ],
        tips: [isEn ? 'Important for Tycoons so players return.' : 'Wichtig für Tycoons, damit Spieler wiederkommen.'],
        notes: '',
      }
    ]);
  }

  if (template === 'bed-wars') {
    addTasks([
      {
        id: 'bw-1',
        columnId: 'logic',
        title: isEn ? 'Bed Protection Logic' : 'Bed Protection Logic',
        description: isEn ? 'The bed must be destroyable.' : 'Das Bett muss zerstört werden können.',
        subTasks: [
          { id: 'st-bw-1-1', title: isEn ? 'Place Objective Device (Bed)' : 'Objective Device (Bett) platzieren', completed: false },
          { id: 'st-bw-1-2', title: isEn ? 'Link respawn logic to bed status' : 'Respawn-Logik an Bett-Status koppeln', completed: false },
        ],
        tips: [isEn ? 'Use Verse to control respawns precisely.' : 'Nutze Verse, um den Respawn präzise zu steuern.'],
        notes: '',
      },
      {
        id: 'bw-2',
        columnId: 'logic',
        title: isEn ? 'Resource Generators' : 'Resource Generators',
        description: isEn ? 'Spawn Iron, Gold, and Diamonds.' : 'Eisen, Gold und Diamanten spawnen.',
        subTasks: [
          { id: 'st-bw-2-1', title: isEn ? 'Item Spawner for resources' : 'Item Spawner für Ressourcen', completed: false },
          { id: 'st-bw-2-2', title: isEn ? 'Upgrade system for generators' : 'Upgrade-System für Generatoren', completed: false },
        ],
        tips: [isEn ? 'Timer Devices can control the spawn rate.' : 'Timer Devices können die Spawn-Rate steuern.'],
        notes: '',
      }
    ]);
  }

  if (template === 'horror') {
    addTasks([
      {
        id: 'hr-1',
        columnId: 'environment',
        title: isEn ? 'Atmospheric Fog & Lighting' : 'Atmospheric Fog & Lighting',
        description: isEn ? 'Create a spooky mood.' : 'Gruselige Stimmung erzeugen.',
        subTasks: [
          { id: 'st-hr-1-1', title: isEn ? 'Configure Exponential Height Fog' : 'Exponential Height Fog einstellen', completed: false },
          { id: 'st-hr-1-2', title: isEn ? 'Flickering lights (Verse/Light Device)' : 'Flackernde Lichter (Verse/Light Device)', completed: false },
        ],
        tips: [isEn ? 'Darkness is good, but players still need to see.' : 'Dunkelheit ist gut, aber Spieler müssen noch etwas sehen.'],
        notes: '',
      },
      {
        id: 'hr-2',
        columnId: 'logic',
        title: isEn ? 'Jumpscare Triggers' : 'Jumpscare Triggers',
        description: isEn ? 'Scare your players.' : 'Erschrecke deine Spieler.',
        subTasks: [
          { id: 'st-hr-2-1', title: isEn ? 'Link Trigger with Audio Player' : 'Trigger mit Audio Player verknüpfen', completed: false },
          { id: 'st-hr-2-2', title: isEn ? 'VFX Spawner for visual effects' : 'VFX Spawner für visuelle Effekte', completed: false },
        ],
        tips: [isEn ? 'Timing is everything with jumpscares.' : 'Timing ist alles bei Jumpscares.'],
        notes: '',
      }
    ]);
  }

  if (template === 'racing') {
    addTasks([
      {
        id: 'rc-1',
        columnId: 'logic',
        title: isEn ? 'Checkpoint System' : 'Checkpoint System',
        description: isEn ? 'Define the race track.' : 'Die Rennstrecke definieren.',
        subTasks: [
          { id: 'st-rc-1-1', title: isEn ? 'Place Race Checkpoints' : 'Race Checkpoints platzieren', completed: false },
          { id: 'st-rc-1-2', title: isEn ? 'Setup Lap Counter' : 'Runden-Zähler einrichten', completed: false },
        ],
        tips: [isEn ? 'Use the Race Manager Device.' : 'Nutze das Race Manager Device.'],
        notes: '',
      },
      {
        id: 'rc-2',
        columnId: 'logic',
        title: isEn ? 'Vehicle Spawners' : 'Vehicle Spawners',
        description: isEn ? 'Cars for the players.' : 'Autos für die Spieler.',
        subTasks: [
          { id: 'st-rc-2-1', title: isEn ? 'Sports Car or Octane Spawner' : 'Sportwagen oder Octane Spawner', completed: false },
          { id: 'st-rc-2-2', title: isEn ? 'Vehicle modifications (optional)' : 'Fahrzeug-Modifikationen (optional)', completed: false },
        ],
        tips: [isEn ? 'Ensure enough space for vehicles.' : 'Achte auf genug Platz für die Fahrzeuge.'],
        notes: '',
      }
    ]);
  }

  if (template === 'box-fight') {
    addTasks([
      {
        id: 'bf-1',
        columnId: 'logic',
        title: isEn ? 'Barrier Setup' : 'Barrier Setup',
        description: isEn ? 'Separate players at the start.' : 'Spieler am Anfang trennen.',
        subTasks: [
          { id: 'st-bf-1-1', title: isEn ? 'Place Barrier Device' : 'Barrier Device platzieren', completed: false },
          { id: 'st-bf-1-2', title: isEn ? 'Auto-Disable after X seconds' : 'Auto-Disable nach X Sekunden', completed: false },
        ],
        tips: [isEn ? 'Use a timer to control the barriers.' : 'Nutze einen Timer, um die Barrieren zu steuern.'],
        notes: '',
      }
    ]);
  }

  if (template === 'prop-hunt') {
    addTasks([
      {
        id: 'ph-1',
        columnId: 'logic',
        title: isEn ? 'Prop-O-Matic Setup' : 'Prop-O-Matic Setup',
        description: isEn ? 'Transform players into objects.' : 'Spieler in Objekte verwandeln.',
        subTasks: [
          { id: 'st-ph-1-1', title: isEn ? 'Prop-O-Matic Manager Device' : 'Prop-O-Matic Manager Device', completed: false },
          { id: 'st-ph-1-2', title: isEn ? 'Hider vs Seeker Teams' : 'Hider vs Seeker Teams', completed: false },
        ],
        tips: [isEn ? 'Hide good props around the map.' : 'Verstecke gute Props in der Map.'],
        notes: '',
      }
    ]);
  }

  if (template === 'red-vs-blue') {
    addTasks([
      {
        id: 'rvb-1',
        columnId: 'logic',
        title: isEn ? 'Team Base Setup' : 'Team Base Setup',
        description: isEn ? 'Two bases with weapons.' : 'Zwei Basen mit Waffen.',
        subTasks: [
          { id: 'st-rvb-1-1', title: isEn ? 'Red base with spawns' : 'Rote Basis mit Spawns', completed: false },
          { id: 'st-rvb-1-2', title: isEn ? 'Blue base with spawns' : 'Blaue Basis mit Spawns', completed: false },
          { id: 'st-rvb-1-3', title: isEn ? 'Setup weapon walls' : 'Waffen-Wände einrichten', completed: false },
        ],
        tips: [isEn ? 'Symmetry is important for fairness.' : 'Symmetrie ist wichtig für Fairness.'],
        notes: '',
      }
    ]);
  }

  // Always add Verse task if not blank
  if (template !== 'blank') {
    addTasks([{
      id: 'verse-1',
      columnId: 'logic',
      title: isEn ? 'Create Verse Device & attach to Actor' : 'Verse Device erstellen & an Actor heften',
      description: isEn ? 'Write custom logic.' : 'Eigene Logik schreiben.',
      subTasks: [
        { id: 'st-v-1', title: isEn ? 'New Verse File in Explorer' : 'New Verse File in Explorer', completed: false },
        { id: 'st-v-2', title: isEn ? 'Build Verse Code' : 'Build Verse Code', completed: false },
        { id: 'st-v-3', title: isEn ? 'Drag Device into map' : 'Device in die Map ziehen', completed: false },
      ],
      tips: [isEn ? 'Verse is powerful for Custom UI and complex game modes.' : 'Verse ist mächtig für Custom UI und komplexe Spielmodi.'],
      notes: '',
    }]);
  }

  return [...baseTasks, ...templateSpecificTasks];
};
`;

fs.writeFileSync('src/constants.ts', code);
