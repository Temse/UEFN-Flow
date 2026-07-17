import { Column, Task, ProjectTemplate } from './types';

export const PRO_TIPS = [
  "Nutze 'Verse', um komplexe Spielregeln zu erstellen, die mit Standard-Devices nicht möglich sind.",
  "Optimiere deine Texturen! Große Texturen verbrauchen viel Speicherplatz (Memory).",
  "HLODs sind dein bester Freund für Performance auf großen Maps.",
  "Teste deine Map immer mit mehreren Spielern, um Netzwerk-Lags zu finden.",
  "Nutze 'Data Layers', um verschiedene Versionen deiner Map effizient zu verwalten.",
  "Die 'Modelling Tools' in UEFN sind extrem mächtig für schnelles Prototyping.",
  "Achte auf das 'Memory Thermometer' – bleib unter 100k für beste Kompatibilität.",
  "Nutze 'Lumen' für realistische Beleuchtung, aber achte auf die Performance-Kosten.",
  "Verse-Code sollte modular aufgebaut sein, um ihn in anderen Projekten wiederzuverwenden.",
  "Vergiss nicht, 'Post Process Volumes' für den finalen Look deiner Map zu nutzen.",
  "Nutze 'Custom UI' mit Verse, um dein Spiel von anderen abzuheben.",
  "Regelmäßiges Speichern im Creator Portal verhindert Datenverlust bei Abstürzen.",
  "Analysiere die Statistiken deiner Map im Creator Portal, um Spieler-Verhalten zu verstehen.",
  "Nutze 'Sequencer' für beeindruckende In-Game Cinematics.",
  "Achte auf saubere Kollisionen – nichts frustriert Spieler mehr als unsichtbare Wände."
];

export const INITIAL_COLUMNS: Column[] = [
  { id: 'pre-production', title: '📝 Pre-Production' },
  { id: 'environment', title: '🛠️ Environment & Art' },
  { id: 'logic', title: '⚙️ Logic & Verse' },
  { id: 'optimization', title: '🧹 Optimization' },
  { id: 'release', title: '🎮 Playtesting & Release' },
];

export const getTemplateTasks = (template: ProjectTemplate): Task[] => {
  const baseTasks: Task[] = [
    // Pre-Production
    {
      id: 'task-1',
      columnId: 'pre-production',
      title: 'Game Loop & Core Mechanics',
      description: 'Definiere den Kern deines Spiels.',
      subTasks: [
        { id: 'st-1-1', title: 'Siegbedingungen festlegen', completed: false },
        { id: 'st-1-2', title: 'Rundenanzahl bestimmen', completed: false },
        { id: 'st-1-3', title: 'Spieleranzahl (Min/Max)', completed: false },
      ],
      tips: ['Nutze das Island Settings Device für globale Regeln.', 'Skizziere den Loop auf Papier.'],
      notes: '',
    },
    {
      id: 'task-2',
      columnId: 'pre-production',
      title: 'Referenz-Bilder (Moodboard)',
      description: 'Sammle visuelle Inspiration.',
      subTasks: [
        { id: 'st-2-1', title: 'Pinterest/ArtStation Board erstellen', completed: false },
        { id: 'st-2-2', title: 'Farbschema festlegen', completed: false },
      ],
      tips: ['Achte auf Beleuchtung und Material-Referenzen.'],
      notes: '',
    },
    // Environment
    {
      id: 'task-3',
      columnId: 'environment',
      title: 'Greyboxing / Layout',
      description: 'Erstelle das grobe Layout mit einfachen Formen.',
      subTasks: [
        { id: 'st-3-1', title: 'Hauptwege blocken', completed: false },
        { id: 'st-3-2', title: 'Sichtlinien prüfen', completed: false },
        { id: 'st-3-3', title: 'Scale-Check mit Spieler-Dummy', completed: false },
      ],
      tips: ['Nutze Modelling Tools (Shift+5) für schnelles Prototyping.'],
      notes: '',
    },
    {
      id: 'task-4',
      columnId: 'environment',
      title: 'Terrain Sculpting',
      description: 'Forme die Landschaft.',
      subTasks: [
        { id: 'st-4-1', title: 'Berge und Täler formen', completed: false },
        { id: 'st-4-2', title: 'Material Layers malen (Gras, Stein)', completed: false },
      ],
      tips: ['Nutze den Sculpt-Brush mit niedriger Stärke für natürliche Übergänge.'],
      notes: '',
    },
    {
      id: 'task-5',
      columnId: 'environment',
      title: 'Props & Set Dressing',
      description: 'Fülle die Welt mit Details.',
      subTasks: [
        { id: 'st-5-1', title: 'Hauptgebäude platzieren', completed: false },
        { id: 'st-5-2', title: 'Natur-Elemente (Bäume, Steine)', completed: false },
        { id: 'st-5-3', title: 'Kleine Details (Müll, Kisten)', completed: false },
      ],
      tips: ['Variiere Rotation und Skalierung für mehr Realismus.'],
      notes: '',
    },
    {
      id: 'task-6',
      columnId: 'environment',
      title: 'Lumen Lighting & Sky Light Setup',
      description: 'Beleuchtung konfigurieren.',
      subTasks: [
        { id: 'st-6-1', title: 'Directional Light ausrichten', completed: false },
        { id: 'st-6-2', title: 'Sky Atmosphere anpassen', completed: false },
        { id: 'st-6-3', title: 'Post Process Volume hinzufügen', completed: false },
      ],
      tips: ['Aktiviere Lumen in den Project Settings für beste Qualität.'],
      notes: '',
    },
    // Logic (Standard)
    {
      id: 'task-7',
      columnId: 'logic',
      title: 'Spawnpads & Team Settings',
      description: 'Wo und wie Spieler starten.',
      subTasks: [
        { id: 'st-7-1', title: 'Player Spawner platzieren', completed: false },
        { id: 'st-7-2', title: 'Team Settings & Inventory Device', completed: false },
      ],
      tips: ['Stelle sicher, dass Spawnpads dem richtigen Team zugewiesen sind.'],
      notes: '',
    },
    {
      id: 'task-8',
      columnId: 'logic',
      title: 'End-Game Condition einrichten',
      description: 'Wie gewinnt man?',
      subTasks: [
        { id: 'st-8-1', title: 'End Game Device konfigurieren', completed: false },
        { id: 'st-8-2', title: 'Score Manager (optional)', completed: false },
      ],
      tips: ['Prüfe die Siegbedingungen in den Island Settings.'],
      notes: '',
    },
    // Optimization
    {
      id: 'task-opt-1',
      columnId: 'optimization',
      title: 'HLODs generieren',
      description: 'Wichtig für Performance auf Distanz.',
      isCritical: true,
      subTasks: [
        { id: 'st-opt-1-1', title: 'Level in Grid einteilen', completed: false },
        { id: 'st-opt-1-2', title: 'HLOD Layer zuweisen', completed: false },
        { id: 'st-opt-1-3', title: 'Build HLODs klicken', completed: false },
      ],
      tips: ['Window -> World Partition -> HLOD Editor.'],
      notes: '',
    },
    {
      id: 'task-opt-2',
      columnId: 'optimization',
      title: 'NavMesh Rebuild',
      description: 'KI-Navigation aktualisieren.',
      subTasks: [
        { id: 'st-opt-2-1', title: 'Nav Mesh Bounds Volume prüfen', completed: false },
        { id: 'st-opt-2-2', title: 'P drücken zum Visualisieren', completed: false },
      ],
      tips: ['Wichtig für Guards und Wildtiere.'],
      notes: '',
    },
    {
      id: 'task-opt-3',
      columnId: 'optimization',
      title: 'Memory Check durchführen',
      description: 'Ziel < 100k Speicher.',
      subTasks: [
        { id: 'st-opt-3-1', title: 'Project Size Tool öffnen', completed: false },
        { id: 'st-opt-3-2', title: 'Teure Assets identifizieren', completed: false },
      ],
      tips: ['Nutze Instanced Static Meshes wo möglich.'],
      notes: '',
    },
    {
      id: 'task-opt-4',
      columnId: 'optimization',
      title: 'World Partition Settings prüfen',
      description: 'Streaming-Einstellungen optimieren.',
      subTasks: [
        { id: 'st-opt-4-1', title: 'Loading Range anpassen', completed: false },
        { id: 'st-opt-4-2', title: 'Data Layers prüfen', completed: false },
      ],
      tips: ['Große Maps brauchen sauberes World Partitioning.'],
      notes: '',
    },
    // Release
    {
      id: 'task-rel-1',
      columnId: 'release',
      title: 'Private Playtest (Multiplayer)',
      description: 'Teste mit echten Spielern.',
      subTasks: [
        { id: 'st-rel-1-1', title: 'Private Version publizieren', completed: false },
        { id: 'st-rel-1-2', title: 'Codes an Tester senden', completed: false },
      ],
      tips: ['Nutze das Creator Portal für Playtest-Gruppen.'],
      notes: '',
    },
    {
      id: 'task-rel-2',
      columnId: 'release',
      title: 'Thumbnail 1920x1080 erstellen',
      description: 'Das Gesicht deiner Map.',
      subTasks: [
        { id: 'st-rel-2-1', title: 'High-Res Screenshot in UEFN', completed: false },
        { id: 'st-rel-2-2', title: 'Logo & Text hinzufügen', completed: false },
      ],
      tips: ['Keine Clickbait-Pfeile, Epic mag saubere Thumbnails.'],
      notes: '',
    },
    {
      id: 'task-rel-3',
      columnId: 'release',
      title: 'Creator Portal: IARC Rating & Release',
      description: 'Der finale Schritt.',
      subTasks: [
        { id: 'st-rel-3-1', title: 'IARC Fragebogen ausfüllen', completed: false },
        { id: 'st-rel-3-2', title: 'Map-Beschreibung & Tags', completed: false },
        { id: 'st-rel-3-3', title: 'Publish zur Review', completed: false },
      ],
      tips: ['Prüfe alle Copyright-Regeln vor dem Upload.'],
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
        title: 'Storm Controller & Beacon Setup',
        description: 'Die Zone muss sich bewegen.',
        subTasks: [
          { id: 'st-zw-1-1', title: 'Basic Storm Controller platzieren', completed: false },
          { id: 'st-zw-1-2', title: 'Phasen definieren', completed: false },
        ],
        tips: ['Nutze Advanced Storm Beacon für komplexe Bewegungen.'],
        notes: '',
      },
      {
        id: 'zw-2',
        columnId: 'logic',
        title: 'Randomized Loadout Granters',
        description: 'Zufällige Waffen für Spieler.',
        subTasks: [
          { id: 'st-zw-2-1', title: 'Item Granters befüllen', completed: false },
          { id: 'st-zw-2-2', title: 'Zufalls-Logik einstellen', completed: false },
        ],
        tips: ['Verse kann hier helfen, Loadouts fairer zu verteilen.'],
        notes: '',
      }
    ]);
  }

  if (template === 'tycoon') {
    addTasks([
      {
        id: 'ty-1',
        columnId: 'logic',
        title: 'Button Devices (Kauf-Stationen)',
        description: 'Wirtschaftssystem aufbauen.',
        subTasks: [
          { id: 'st-ty-1-1', title: 'Conditional Buttons für Käufe', completed: false },
          { id: 'st-ty-1-2', title: 'Währung (Gold) Setup', completed: false },
        ],
        tips: ['Verknüpfe Buttons mit Visual Effects für Feedback.'],
        notes: '',
      },
      {
        id: 'ty-2',
        columnId: 'logic',
        title: 'Vending Machines',
        description: 'Waffen und Items verkaufen.',
        subTasks: [
          { id: 'st-ty-2-1', title: 'Preise festlegen', completed: false },
          { id: 'st-ty-2-2', title: 'Bestand limitieren (optional)', completed: false },
        ],
        tips: ['Vending Machines sind intuitiv für Spieler.'],
        notes: '',
      },
      {
        id: 'ty-3',
        columnId: 'logic',
        title: 'Player Save Device',
        description: 'Fortschritt über Sessions speichern.',
        subTasks: [
          { id: 'st-ty-3-1', title: 'Save Point Device platzieren', completed: false },
          { id: 'st-ty-3-2', title: 'Auto-Save Intervalle', completed: false },
        ],
        tips: ['Wichtig für Tycoons, damit Spieler wiederkommen.'],
        notes: '',
      }
    ]);
  }

  if (template === 'bed-wars') {
    addTasks([
      {
        id: 'bw-1',
        columnId: 'logic',
        title: 'Bed Protection Logic',
        description: 'Das Bett muss zerstört werden können.',
        subTasks: [
          { id: 'st-bw-1-1', title: 'Objective Device (Bett) platzieren', completed: false },
          { id: 'st-bw-1-2', title: 'Respawn-Logik an Bett-Status koppeln', completed: false },
        ],
        tips: ['Nutze Verse, um den Respawn präzise zu steuern.'],
        notes: '',
      },
      {
        id: 'bw-2',
        columnId: 'logic',
        title: 'Resource Generators',
        description: 'Eisen, Gold und Diamanten spawnen.',
        subTasks: [
          { id: 'st-bw-2-1', title: 'Item Spawner für Ressourcen', completed: false },
          { id: 'st-bw-2-2', title: 'Upgrade-System für Generatoren', completed: false },
        ],
        tips: ['Timer Devices können die Spawn-Rate steuern.'],
        notes: '',
      }
    ]);
  }

  if (template === 'horror') {
    addTasks([
      {
        id: 'hr-1',
        columnId: 'environment',
        title: 'Atmospheric Fog & Lighting',
        description: 'Gruselige Stimmung erzeugen.',
        subTasks: [
          { id: 'st-hr-1-1', title: 'Exponential Height Fog einstellen', completed: false },
          { id: 'st-hr-1-2', title: 'Flackernde Lichter (Verse/Light Device)', completed: false },
        ],
        tips: ['Dunkelheit ist gut, aber Spieler müssen noch etwas sehen.'],
        notes: '',
      },
      {
        id: 'hr-2',
        columnId: 'logic',
        title: 'Jumpscare Triggers',
        description: 'Erschrecke deine Spieler.',
        subTasks: [
          { id: 'st-hr-2-1', title: 'Trigger mit Audio Player verknüpfen', completed: false },
          { id: 'st-hr-2-2', title: 'VFX Spawner für visuelle Effekte', completed: false },
        ],
        tips: ['Timing ist alles bei Jumpscares.'],
        notes: '',
      }
    ]);
  }

  if (template === 'racing') {
    addTasks([
      {
        id: 'rc-1',
        columnId: 'logic',
        title: 'Checkpoint System',
        description: 'Die Rennstrecke definieren.',
        subTasks: [
          { id: 'st-rc-1-1', title: 'Race Checkpoints platzieren', completed: false },
          { id: 'st-rc-1-2', title: 'Runden-Zähler einrichten', completed: false },
        ],
        tips: ['Nutze das Race Manager Device.'],
        notes: '',
      },
      {
        id: 'rc-2',
        columnId: 'logic',
        title: 'Vehicle Spawners',
        description: 'Autos für die Spieler.',
        subTasks: [
          { id: 'st-rc-2-1', title: 'Sportwagen oder Octane Spawner', completed: false },
          { id: 'st-rc-2-2', title: 'Fahrzeug-Modifikationen (optional)', completed: false },
        ],
        tips: ['Achte auf genug Platz für die Fahrzeuge.'],
        notes: '',
      }
    ]);
  }

  if (template === 'box-fight') {
    addTasks([
      {
        id: 'bf-1',
        columnId: 'logic',
        title: 'Barrier Setup',
        description: 'Spieler am Anfang trennen.',
        subTasks: [
          { id: 'st-bf-1-1', title: 'Barrier Device platzieren', completed: false },
          { id: 'st-bf-1-2', title: 'Auto-Disable nach X Sekunden', completed: false },
        ],
        tips: ['Nutze einen Timer, um die Barrieren zu steuern.'],
        notes: '',
      }
    ]);
  }

  if (template === 'prop-hunt') {
    addTasks([
      {
        id: 'ph-1',
        columnId: 'logic',
        title: 'Prop-O-Matic Setup',
        description: 'Spieler in Objekte verwandeln.',
        subTasks: [
          { id: 'st-ph-1-1', title: 'Prop-O-Matic Manager Device', completed: false },
          { id: 'st-ph-1-2', title: 'Hider vs Seeker Teams', completed: false },
        ],
        tips: ['Verstecke gute Props in der Map.'],
        notes: '',
      }
    ]);
  }

  if (template === 'red-vs-blue') {
    addTasks([
      {
        id: 'rvb-1',
        columnId: 'logic',
        title: 'Team Base Setup',
        description: 'Zwei Basen mit Waffen.',
        subTasks: [
          { id: 'st-rvb-1-1', title: 'Rote Basis mit Spawns', completed: false },
          { id: 'st-rvb-1-2', title: 'Blaue Basis mit Spawns', completed: false },
          { id: 'st-rvb-1-3', title: 'Waffen-Wände einrichten', completed: false },
        ],
        tips: ['Symmetrie ist wichtig für Fairness.'],
        notes: '',
      }
    ]);
  }

  // Always add Verse task if not blank
  if (template !== 'blank') {
    addTasks([{
      id: 'verse-1',
      columnId: 'logic',
      title: 'Verse Device erstellen & an Actor heften',
      description: 'Eigene Logik schreiben.',
      subTasks: [
        { id: 'st-v-1', title: 'New Verse File in Explorer', completed: false },
        { id: 'st-v-2', title: 'Build Verse Code', completed: false },
        { id: 'st-v-3', title: 'Device in die Map ziehen', completed: false },
      ],
      tips: ['Verse ist mächtig für Custom UI und komplexe Spielmodi.'],
      notes: '',
    }]);
  }

  return [...baseTasks, ...templateSpecificTasks];
};
