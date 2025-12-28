import React, { useState, useEffect, useCallback } from 'react';

interface MystProps {
  onClose: () => void;
}

interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  connections: string[];
  collectable?: Collectable;
  discovered: boolean;
}

interface Collectable {
  id: string;
  name: string;
  icon: string;
  description: string;
  collected: boolean;
}

const LOCATIONS: Location[] = [
  {
    id: 'ferry-building',
    name: 'Ferry Building',
    description: 'The fog rolls in from the bay. The clock tower stands silent, its hands frozen at 3:47. The usual crowds are gone. Only the echo of your footsteps remains.',
    image: '🏛️',
    connections: ['embarcadero', 'market-street'],
    collectable: { id: 'clock-hand', name: 'Broken Clock Hand', icon: '🕐', description: 'Time stopped here first.', collected: false },
    discovered: true,
  },
  {
    id: 'embarcadero',
    name: 'Embarcadero',
    description: 'The pier stretches into the mist. Sea lions used to bark here. Now there\'s only the gentle lap of waves against wood and the distant cry of a foghorn.',
    image: '⚓',
    connections: ['ferry-building', 'pier-39', 'coit-tower'],
    collectable: { id: 'sea-glass', name: 'Sea Glass', icon: '💎', description: 'Smoothed by countless tides.', collected: false },
    discovered: false,
  },
  {
    id: 'pier-39',
    name: 'Pier 39',
    description: 'Empty tourist stalls creak in the wind. A lone carousel horse stares at you with painted eyes. The sea lions have vanished with everyone else.',
    image: '🎠',
    connections: ['embarcadero', 'fishermans-wharf'],
    discovered: false,
  },
  {
    id: 'fishermans-wharf',
    name: 'Fisherman\'s Wharf',
    description: 'The smell of sourdough lingers impossibly. Boudin\'s oven still glows faintly. A half-eaten clam chowder bread bowl sits on a bench, untouched.',
    image: '🦞',
    connections: ['pier-39', 'ghirardelli'],
    collectable: { id: 'sourdough', name: 'Eternal Sourdough', icon: '🍞', description: 'Still warm. Always warm.', collected: false },
    discovered: false,
  },
  {
    id: 'ghirardelli',
    name: 'Ghirardelli Square',
    description: 'Chocolate still perfumes the air. The fountain runs dry. In a shop window, a sundae melts in eternal slow motion, never quite disappearing.',
    image: '🍫',
    connections: ['fishermans-wharf', 'fort-mason'],
    discovered: false,
  },
  {
    id: 'fort-mason',
    name: 'Fort Mason',
    description: 'The old military buildings stand sentinel against the fog. Through a window, you see an art installation: a room full of floating letters that spell "WHERE DID EVERYONE GO?"',
    image: '🏰',
    connections: ['ghirardelli', 'marina'],
    collectable: { id: 'letter-w', name: 'Floating Letter', icon: '🔤', description: 'It hovers slightly above your palm.', collected: false },
    discovered: false,
  },
  {
    id: 'marina',
    name: 'Marina Green',
    description: 'Kites hang frozen in the sky, their strings trailing down to nowhere. The Palace of Fine Arts looms through the mist like a Greek ruin dreaming of California.',
    image: '🪁',
    connections: ['fort-mason', 'palace-of-fine-arts', 'presidio'],
    discovered: false,
  },
  {
    id: 'palace-of-fine-arts',
    name: 'Palace of Fine Arts',
    description: 'Swans glide silently across the lagoon. The rotunda echoes with whispers you can\'t quite make out. Someone left a book on a bench: "The Collected Works of Myst".',
    image: '🏛️',
    connections: ['marina'],
    collectable: { id: 'myst-book', name: 'The Myst Book', icon: '📖', description: 'The pages are blank, waiting to be written.', collected: false },
    discovered: false,
  },
  {
    id: 'presidio',
    name: 'The Presidio',
    description: 'Eucalyptus trees whisper secrets. The old batteries overlook a bridge that disappears into whiteness. You find a ranger station with coffee still steaming on the desk.',
    image: '🌲',
    connections: ['marina', 'golden-gate'],
    discovered: false,
  },
  {
    id: 'golden-gate',
    name: 'Golden Gate Bridge',
    description: 'The bridge extends into pure white nothingness. The fog is so thick you can barely see the first tower. A single orange cable hums with an impossible melody.',
    image: '🌉',
    connections: ['presidio', 'marin-headlands'],
    collectable: { id: 'bridge-rivet', name: 'Bridge Rivet', icon: '🔩', description: 'International Orange, warm to the touch.', collected: false },
    discovered: false,
  },
  {
    id: 'marin-headlands',
    name: 'Marin Headlands',
    description: 'You\'ve crossed over. Looking back, San Francisco is a ghost city floating in cotton. Here, wild grass waves at nobody. A bunker door stands slightly ajar.',
    image: '⛰️',
    connections: ['golden-gate'],
    collectable: { id: 'fog-crystal', name: 'Crystallized Fog', icon: '❄️', description: 'The essence of San Francisco, solidified.', collected: false },
    discovered: false,
  },
  {
    id: 'coit-tower',
    name: 'Coit Tower',
    description: 'The murals inside tell stories of workers who aren\'t here anymore. The city spreads below, beautiful and empty. The elevator dings, but no one gets out.',
    image: '🗼',
    connections: ['embarcadero', 'north-beach'],
    discovered: false,
  },
  {
    id: 'north-beach',
    name: 'North Beach',
    description: 'City Lights Books is open, somehow. Beat poetry echoes from empty shelves. A typewriter clacks by itself, writing: "I saw the best minds of my generation disappear..."',
    image: '📚',
    connections: ['coit-tower', 'chinatown'],
    collectable: { id: 'poem', name: 'Self-Writing Poem', icon: '📝', description: 'It never stops composing.', collected: false },
    discovered: false,
  },
  {
    id: 'chinatown',
    name: 'Chinatown',
    description: 'Red lanterns sway without wind. The Dragon Gate stands proud but lonely. A fortune cookie on the ground says: "You are exactly where you need to be."',
    image: '🏮',
    connections: ['north-beach', 'union-square'],
    discovered: false,
  },
  {
    id: 'union-square',
    name: 'Union Square',
    description: 'The Dewey Monument watches over empty benches. Macy\'s windows display mannequins frozen mid-gesture. A cable car sits in the turnaround, waiting forever.',
    image: '🚋',
    connections: ['chinatown', 'market-street'],
    collectable: { id: 'cable-car-bell', name: 'Cable Car Bell', icon: '🔔', description: 'Ring it and hear the city remember.', collected: false },
    discovered: false,
  },
  {
    id: 'market-street',
    name: 'Market Street',
    description: 'The F-line runs empty, looping eternally. BART rumbles below but the entrances lead only to more fog. A newspaper box offers today\'s date, forever.',
    image: '🚃',
    connections: ['ferry-building', 'union-square', 'castro'],
    discovered: false,
  },
  {
    id: 'castro',
    name: 'The Castro',
    description: 'Rainbow flags wave proudly against the grey. The Castro Theatre marquee blinks: "NOW SHOWING: YOUR MEMORIES". Harvey Milk smiles from a mural, eternal.',
    image: '🏳️‍🌈',
    connections: ['market-street', 'mission'],
    collectable: { id: 'pride-pin', name: 'Rainbow Pin', icon: '🌈', description: 'Love persists.', collected: false },
    discovered: false,
  },
  {
    id: 'mission',
    name: 'The Mission',
    description: 'Murals tell stories in colors the fog can\'t dull. Dolores Park is empty but the sunshine struggles through. A burrito sits warm on a bench at La Taqueria.',
    image: '🎨',
    connections: ['castro', 'dolores-park'],
    discovered: false,
  },
  {
    id: 'dolores-park',
    name: 'Dolores Park',
    description: 'The view of downtown is perfect, buildings emerging from clouds. Someone\'s picnic basket remains, wine still uncorked. The palm trees whisper coordinates you don\'t understand.',
    image: '🌴',
    connections: ['mission'],
    collectable: { id: 'palm-frond', name: 'Golden Palm Frond', icon: '🌿', description: 'Points toward something hidden.', collected: false },
    discovered: false,
  },
];

const STORAGE_KEY = 'zos-myst-save';

const Myst: React.FC<MystProps> = ({ onClose }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocationId, setCurrentLocationId] = useState('ferry-building');
  const [inventory, setInventory] = useState<Collectable[]>([]);
  const [message, setMessage] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [fogOpacity, setFogOpacity] = useState(0.8);

  // Load game state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { locations: savedLocations, currentLocationId: savedLocation, inventory: savedInventory } = JSON.parse(saved);
      setLocations(savedLocations);
      setCurrentLocationId(savedLocation);
      setInventory(savedInventory);
    } else {
      setLocations(LOCATIONS);
    }
  }, []);

  // Save game state
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        locations,
        currentLocationId,
        inventory,
      }));
    }
  }, [locations, currentLocationId, inventory]);

  // Fog animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFogOpacity(prev => 0.6 + Math.sin(Date.now() / 3000) * 0.2);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const currentLocation = locations.find(l => l.id === currentLocationId);

  const moveTo = useCallback((locationId: string) => {
    setLocations(prev => prev.map(l =>
      l.id === locationId ? { ...l, discovered: true } : l
    ));
    setCurrentLocationId(locationId);
    setMessage('');
  }, []);

  const collectItem = useCallback(() => {
    if (!currentLocation?.collectable || currentLocation.collectable.collected) return;

    const item = currentLocation.collectable;
    setInventory(prev => [...prev, { ...item, collected: true }]);
    setLocations(prev => prev.map(l =>
      l.id === currentLocationId
        ? { ...l, collectable: { ...l.collectable!, collected: true } }
        : l
    ));
    setMessage(`You found: ${item.name}`);
  }, [currentLocation, currentLocationId]);

  const discoveredCount = locations.filter(l => l.discovered).length;
  const collectedCount = inventory.length;
  const totalCollectables = LOCATIONS.filter(l => l.collectable).length;

  if (!currentLocation) return null;

  return (
    <div className="h-full flex flex-col bg-[#1a1a2e] text-[#e0e0e0] font-serif overflow-hidden">
      {/* Fog overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(200, 200, 210, ${fogOpacity}) 100%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-20 p-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-2xl">🌫️</span>
          <div>
            <h1 className="text-xl tracking-widest">M Y S T</h1>
            <p className="text-xs text-white/40 italic">San Francisco, ???</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm"
          >
            🎒 {collectedCount}/{totalCollectables}
          </button>
          <span className="text-sm text-white/40">
            📍 {discoveredCount}/{locations.length} discovered
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex relative z-20">
        {/* Location view */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-8xl mb-6 animate-pulse">{currentLocation.image}</div>
          <h2 className="text-3xl mb-4 tracking-wide">{currentLocation.name}</h2>
          <p className="max-w-xl text-lg leading-relaxed text-white/70 mb-8">
            {currentLocation.description}
          </p>

          {/* Collectable */}
          {currentLocation.collectable && !currentLocation.collectable.collected && (
            <button
              onClick={collectItem}
              className="mb-6 px-6 py-3 bg-amber-900/50 hover:bg-amber-800/50 border border-amber-600/50 rounded-lg transition-all animate-pulse"
            >
              <span className="text-2xl mr-2">{currentLocation.collectable.icon}</span>
              <span>Take {currentLocation.collectable.name}</span>
            </button>
          )}

          {message && (
            <div className="mb-6 px-4 py-2 bg-green-900/30 border border-green-600/30 rounded text-green-300">
              {message}
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-3">
            {currentLocation.connections.map(connectionId => {
              const destination = locations.find(l => l.id === connectionId);
              if (!destination) return null;
              return (
                <button
                  key={connectionId}
                  onClick={() => moveTo(connectionId)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-lg transition-all"
                >
                  {destination.discovered ? destination.name : '??? (unexplored)'}
                  <span className="ml-2 text-white/30">→</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inventory panel */}
        {showInventory && (
          <div className="w-72 bg-black/40 border-l border-white/10 p-4 overflow-auto">
            <h3 className="text-lg mb-4 tracking-wide">Collected Memories</h3>
            {inventory.length === 0 ? (
              <p className="text-white/40 italic text-sm">
                The fog holds many secrets. Keep exploring...
              </p>
            ) : (
              <div className="space-y-3">
                {inventory.map(item => (
                  <div key={item.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <p className="text-xs text-white/50 italic">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {collectedCount === totalCollectables && (
              <div className="mt-6 p-4 bg-amber-900/30 border border-amber-600/30 rounded-lg text-center">
                <div className="text-2xl mb-2">✨</div>
                <p className="text-amber-200">
                  You've gathered all the memories. The fog begins to lift...
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-20 p-3 border-t border-white/10 text-center text-xs text-white/30 italic">
        "In the fog, all paths lead somewhere. The question is: where did everyone go?"
      </div>
    </div>
  );
};

export default Myst;
