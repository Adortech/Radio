import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const hungarianRadioStations = [
  {
    id: 1,
    name: 'Kossuth Rádió',
    description: 'Public news and current affairs radio',
    url: 'https://mr-stream.connectmedia.hu/4741/mr1.mp3',
    genre: 'News',
    location: 'Budapest'
  },
  {
    id: 2,
    name: 'Petőfi Rádió',
    description: 'Music radio for younger audience',
    url: 'https://mr-stream.connectmedia.hu/4742/mr2.mp3',
    genre: 'Music',
    location: 'Budapest'
  },
  {
    id: 3,
    name: 'Bartók Rádió',
    description: 'Classical and cultural programming',
    url: 'https://mr-stream.connectmedia.hu/4743/mr3.mp3',
    genre: 'Classical',
    location: 'Budapest'
  },
  {
    id: 4,
    name: 'Dankó Rádió',
    description: 'Traditional Hungarian folk music',
    url: 'https://mr-stream.connectmedia.hu/4744/mr4.mp3',
    genre: 'Folk',
    location: 'Budapest'
  },
  {
    id: 5,
    name: 'Duna World Rádió',
    description: 'Hungarian programming for diaspora',
    url: 'https://mr-stream.connectmedia.hu/4761/dwr.mp3',
    genre: 'World',
    location: 'Budapest'
  },
  {
    id: 6,
    name: 'Info Rádió',
    description: 'News and information radio',
    url: 'https://stream.infostart.hu/lejatszo/stream',
    genre: 'News',
    location: 'Budapest'
  },
  {
    id: 7,
    name: 'Jazzy Rádió',
    description: 'Jazz and smooth music',
    url: 'https://radio.musorok.org/listen/jazzy/jazzy.mp3',
    genre: 'Jazz',
    location: 'Budapest'
  },
  {
    id: 8,
    name: 'Klasszik Rádió 92.1',
    description: 'Classical music radio',
    url: 'https://s04.diazol.hu:9600/live.mp3',
    genre: 'Classical',
    location: 'Budapest'
  },
  {
    id: 9,
    name: 'Klubrádió 95.3 FM',
    description: 'Talk and news radio',
    url: 'https://hu-stream05.klubradio.hu:8443/bpstream',
    genre: 'Talk',
    location: 'Budapest'
  },
  {
    id: 10,
    name: 'Lánchíd Rádió',
    description: 'Hungarian pop and rock music',
    url: 'http://stream001.radio.hu:8080/mr6m.mp3',
    genre: 'Pop/Rock',
    location: 'Budapest'
  }
];

function App() {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentSong, setCurrentSong] = useState('');
  const [filteredStations, setFilteredStations] = useState(hungarianRadioStations);
  
  const audioRef = useRef(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('radioFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('radioFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter stations based on search term and genre
  useEffect(() => {
    let filtered = hungarianRadioStations;

    if (searchTerm) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(station => station.genre === selectedGenre);
    }

    setFilteredStations(filtered);
  }, [searchTerm, selectedGenre]);

  const playStation = (station) => {
    if (currentStation && currentStation.id === station.id && isPlaying) {
      // If same station is playing, pause it
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play new station or resume
      setCurrentStation(station);
      if (audioRef.current) {
        audioRef.current.src = station.url;
        audioRef.current.play().catch(e => {
          console.error('Error playing audio:', e);
        });
        setIsPlaying(true);
      }
    }
  };

  const stopStation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleFavorite = (station) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === station.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== station.id);
      } else {
        return [...prev, station];
      }
    });
  };

  const isFavorite = (station) => {
    return favorites.some(fav => fav.id === station.id);
  };

  const genres = ['All', ...new Set(hungarianRadioStations.map(station => station.genre))];

  // Audio event handlers
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioError = (e) => {
    console.error('Audio error:', e);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🇭🇺 Magyar Rádió
          </h1>
          <p className="text-gray-200">Hungarian Internet Radio Stations</p>
        </div>

        {/* Current Playing Station */}
        {currentStation && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{currentStation.name}</h2>
                <p className="text-gray-200 mb-2">{currentStation.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-red-600 px-2 py-1 rounded text-sm">{currentStation.genre}</span>
                  <span className="text-sm">{currentStation.location}</span>
                  {currentSong && <span className="text-yellow-300">♪ {currentSong}</span>}
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => playStation(currentStation)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button
                  onClick={stopStation}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                >
                  ⏹️
                </button>
                
                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <span>🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-red-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-red-500 focus:outline-none"
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-800">{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Station List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStations.map(station => (
            <div
              key={station.id}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 transition-all hover:bg-white/20 cursor-pointer ${
                currentStation && currentStation.id === station.id ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => playStation(station)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{station.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(station);
                  }}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  {isFavorite(station) ? '⭐' : '☆'}
                </button>
              </div>
              
              <p className="text-gray-200 text-sm mb-3">{station.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-600 px-2 py-1 rounded text-xs text-white">
                    {station.genre}
                  </span>
                  <span className="text-xs text-gray-300">{station.location}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {currentStation && currentStation.id === station.id && isPlaying && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-red-500 animate-pulse"></div>
                      <div className="w-1 h-3 bg-red-500 animate-pulse delay-75"></div>
                      <div className="w-1 h-2 bg-red-500 animate-pulse delay-150"></div>
                    </div>
                  )}
                  <span className="text-green-400">●</span>
                  <span className="text-xs text-gray-300">LIVE</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">⭐ Your Favorites</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map(station => (
                <div
                  key={`fav-${station.id}`}
                  className="bg-yellow-600/20 backdrop-blur-lg rounded-xl p-4 transition-all hover:bg-yellow-600/30 cursor-pointer"
                  onClick={() => playStation(station)}
                >
                  <h3 className="text-lg font-bold text-white">{station.name}</h3>
                  <p className="text-gray-200 text-sm">{station.genre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Element */}
        <audio
          ref={audioRef}
          onPlay={handleAudioPlay}
          onPause={handleAudioPause}
          onError={handleAudioError}
          volume={volume}
        />
      </div>
    </div>
  );
}

export default App;