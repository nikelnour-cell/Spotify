/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Library, Plus, Heart, Play, Pause, SkipForward, SkipBack, 
  Volume2, Maximize2, Users, Share2, Settings, Trophy, ThumbsUp, ThumbsDown, 
  Sparkles, ShieldCheck, Crown, Flame, Music, Radio, Clock, Check, Copy, 
  AlertCircle, ChevronRight, ArrowUpDown, Filter, Disc, MessageSquare, RefreshCw,
  Sliders, Info, FileText, Smartphone, Laptop, CheckCircle2, UserPlus, Send
} from 'lucide-react';

// --- TYPES ---
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  addedBy: {
    name: string;
    avatar: string;
  };
  addedAt: string;
  score: number;
  userVote?: 'up' | 'down' | null;
  explicit?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  host: {
    name: string;
    avatar: string;
  };
  participantsCount: number;
  participants: { id: string; name: string; avatar: string; role: 'host' | 'collaborator' }[];
  isCollaborative: boolean;
  scoringRules: {
    maxVotesPerUser: number;
    allowDownvotes: boolean;
    autoSort: boolean;
    anonymousVoting: boolean;
  };
  tracks: Track[];
}

interface ActivityItem {
  id: string;
  user: { name: string; avatar: string };
  action: string;
  target: string;
  time: string;
  type: 'vote' | 'add' | 'join';
}

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'home' | 'playlist' | 'spec'>('playlist');
  const [activeSpecBlock, setActiveSpecBlock] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveSimulationActive, setLiveSimulationActive] = useState<boolean>(false);

  // Search in add modal
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Mock Data for Collaborative Playlist with Scoring
  const [playlist, setPlaylist] = useState<Playlist>({
    id: 'collab-1',
    title: 'Soirée Rooftop Samedi 🌅',
    description: 'Playlist collaborative officielle pour le coucher de soleil. Votez pour vos sons préférés ! Le top 10 passe en priorité.',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    host: {
      name: 'Alexandre M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    participantsCount: 8,
    participants: [
      { id: '1', name: 'Alexandre M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'host' },
      { id: '2', name: 'Chloé V.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'collaborator' },
      { id: '3', name: 'Thomas K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'collaborator' },
      { id: '4', name: 'Sarah L.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'collaborator' },
    ],
    isCollaborative: true,
    scoringRules: {
      maxVotesPerUser: 5,
      allowDownvotes: true,
      autoSort: true,
      anonymousVoting: false
    },
    tracks: [
      {
        id: 't1',
        title: 'Espresso',
        artist: 'Sabrina Carpenter',
        album: 'Short n\' Sweet',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
        duration: '2:55',
        addedBy: { name: 'Chloé V.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
        addedAt: 'Il y a 12 min',
        score: 42,
        userVote: 'up',
        explicit: false
      },
      {
        id: 't2',
        title: 'BIRDS OF A FEATHER',
        artist: 'Billie Eilish',
        album: 'HIT ME HARD AND SOFT',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
        duration: '3:32',
        addedBy: { name: 'Thomas K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        addedAt: 'Il y a 25 min',
        score: 38,
        userVote: 'up',
        explicit: true
      },
      {
        id: 't3',
        title: 'Houdini',
        artist: 'Dua Lipa',
        album: 'Radical Optimism',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
        duration: '3:05',
        addedBy: { name: 'Sarah L.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
        addedAt: 'Il y a 40 min',
        score: 29,
        userVote: null,
        explicit: false
      },
      {
        id: 't4',
        title: 'Austin (BootsStop)',
        artist: 'Dasha',
        album: 'What Happens Now?',
        coverUrl: 'https://images.unsplash.com/photo-1511253462538-f027c945d471?w=300&auto=format&fit=crop&q=80',
        duration: '2:51',
        addedBy: { name: 'Alexandre M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        addedAt: 'Il y a 1h',
        score: 19,
        userVote: null,
        explicit: false
      },
      {
        id: 't5',
        title: 'Gata Only',
        artist: 'FloyyMenor, Cris Mj',
        album: 'Gata Only',
        coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80',
        duration: '3:42',
        addedBy: { name: 'Thomas K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        addedAt: 'Il y a 2h',
        score: 14,
        userVote: null,
        explicit: true
      },
      {
        id: 't6',
        title: 'I Had Some Help',
        artist: 'Post Malone, Morgan Wallen',
        album: 'F-1 Trillion',
        coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
        duration: '2:58',
        addedBy: { name: 'Chloé V.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
        addedAt: 'Il y a 3h',
        score: 8,
        userVote: null,
        explicit: false
      }
    ]
  });

  // Recent activity feed
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 'a1', user: { name: 'Chloé V.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' }, action: 'a voté +1 pour', target: 'Espresso', time: 'Il y a 2 min', type: 'vote' },
    { id: 'a2', user: { name: 'Thomas K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }, action: 'a ajouté', target: 'BIRDS OF A FEATHER', time: 'Il y a 25 min', type: 'add' },
    { id: 'a3', user: { name: 'Lucas B.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }, action: 'a rejoint la session', target: '', time: 'Il y a 45 min', type: 'join' },
  ]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Live simulation effect
  useEffect(() => {
    if (!liveSimulationActive) return;
    const interval = setInterval(() => {
      const randomTracks = ['Espresso', 'BIRDS OF A FEATHER', 'Houdini', 'Austin (BootsStop)'];
      const randomUsers = [
        { name: 'Chloé V.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
        { name: 'Thomas K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        { name: 'Sarah L.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
      ];
      const selectedTrackTitle = randomTracks[Math.floor(Math.random() * randomTracks.length)];
      const selectedUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const voteDelta = Math.random() > 0.3 ? 1 : -1;

      setPlaylist(prev => {
        const updatedTracks = prev.tracks.map(t => {
          if (t.title === selectedTrackTitle) {
            return { ...t, score: t.score + voteDelta };
          }
          return t;
        });
        if (prev.scoringRules.autoSort) {
          updatedTracks.sort((a, b) => b.score - a.score);
        }
        return { ...prev, tracks: updatedTracks };
      });

      setActivities(prev => [
        {
          id: Math.random().toString(),
          user: selectedUser,
          action: voteDelta > 0 ? 'a voté +1 pour' : 'a voté -1 pour',
          target: selectedTrackTitle,
          time: 'À l\'instant',
          type: 'vote'
        },
        ...prev.slice(0, 10)
      ]);

      showToast(`${selectedUser.name} a voté ${voteDelta > 0 ? '+1' : '-1'} sur "${selectedTrackTitle}"`);
    }, 4500);

    return () => clearInterval(interval);
  }, [liveSimulationActive]);

  // Handle voting
  const handleVote = (trackId: string, direction: 'up' | 'down') => {
    setPlaylist(prev => {
      const updatedTracks = prev.tracks.map(track => {
        if (track.id === trackId) {
          let scoreChange = 0;
          let newVote: 'up' | 'down' | null = direction;

          if (track.userVote === direction) {
            // Undo vote
            scoreChange = direction === 'up' ? -1 : 1;
            newVote = null;
          } else if (track.userVote === null) {
            scoreChange = direction === 'up' ? 1 : -1;
          } else {
            // Switching vote from up to down or vice versa
            scoreChange = direction === 'up' ? 2 : -2;
          }

          return {
            ...track,
            score: track.score + scoreChange,
            userVote: newVote
          };
        }
        return track;
      });

      if (prev.scoringRules.autoSort) {
        updatedTracks.sort((a, b) => b.score - a.score);
      }

      return {
        ...prev,
        tracks: updatedTracks
      };
    });
    showToast('Votre vote a été pris en compte et synchronisé en temps réel.');
  };

  // Add sample track
  const handleAddTrack = (title: string, artist: string, album: string, coverUrl: string) => {
    const newTrack: Track = {
      id: 't-' + Date.now(),
      title,
      artist,
      album,
      coverUrl,
      duration: '3:15',
      addedBy: { name: 'Alexandre M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      addedAt: 'À l\'instant',
      score: 1,
      userVote: 'up',
      explicit: false
    };

    setPlaylist(prev => {
      const updated = [newTrack, ...prev.tracks];
      if (prev.scoringRules.autoSort) {
        updated.sort((a, b) => b.score - a.score);
      }
      return { ...prev, tracks: updated };
    });

    setActivities(prev => [
      {
        id: Math.random().toString(),
        user: { name: 'Alexandre M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        action: 'a ajouté',
        target: title,
        time: 'À l\'instant',
        type: 'add'
      },
      ...prev
    ]);

    setShowAddModal(false);
    showToast(`"${title}" ajouté et voté (+1) avec succès !`);
  };

  return (
    <div className="flex h-screen bg-[#121212] text-[#e0e0e0] font-sans overflow-hidden select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#282828] border border-[#3e3e3e] text-white px-4 py-3 rounded-md shadow-2xl flex items-center space-x-3 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Spotify Desktop Navigation) */}
      <aside className="w-64 bg-black flex flex-col p-6 space-y-6 hidden md:flex shrink-0">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 px-2 cursor-pointer group" onClick={() => setActiveTab('playlist')}>
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition">
            <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.599-.12-.42.18-.78.6-.9 4.56-1.02 8.52-.6 11.76 1.44.36.24.48.66.24 1.02zm1.44-3.84c-.3.48-.9.66-1.38.36-3.24-1.98-8.16-2.58-11.94-1.41-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.26-1.32 9.78-.66 13.62 1.68.48.3.66.9.36 1.35zm.12-4.02C13.8 7.32 8.04 7.14 4.8 8.1 4.14 8.3 3.42 7.92 3.24 7.26c-.2-.66.18-1.38.84-1.56 3.84-1.14 10.32-.96 14.64 1.62.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Spotify</span>
          <span className="text-xs bg-[#282828] text-[#1DB954] px-1.5 py-0.5 rounded font-mono font-semibold ml-1 border border-[#1DB954]/20">JAM +</span>
        </div>

        {/* Main Nav Links */}
        <nav className="space-y-3">
          <button 
            onClick={() => setActiveTab('playlist')}
            className={`flex items-center space-x-4 w-full px-3 py-2.5 rounded-md text-sm font-semibold transition ${activeTab === 'playlist' ? 'text-white bg-[#282828]' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <Home className="w-5 h-5" />
            <span>Playlist Collaborative</span>
          </button>
          <button 
            onClick={() => setActiveTab('spec')}
            className={`flex items-center space-x-4 w-full px-3 py-2.5 rounded-md text-sm font-semibold transition ${activeTab === 'spec' ? 'text-white bg-[#282828]' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span>Spécification Produit (Blocs 1-8)</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('playlist');
              setShowInviteModal(true);
            }}
            className="flex items-center space-x-4 w-full px-3 py-2.5 rounded-md text-sm font-semibold text-[#b3b3b3] hover:text-white transition"
          >
            <UserPlus className="w-5 h-5" />
            <span>Inviter des amis</span>
          </button>
        </nav>

        <hr className="border-[#282828]" />

        {/* Playlists quick list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          <div className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider px-3 mb-2">Playlists & Sessions</div>
          
          <div 
            onClick={() => setActiveTab('playlist')}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-[#282828]/50 cursor-pointer text-sm text-white group transition"
          >
            <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <p className="font-medium truncate group-hover:underline">Soirée Rooftop Samedi 🌅</p>
              <p className="text-xs text-[#b3b3b3]">Collaboratif • 8 participants</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-[#282828]/50 cursor-pointer text-sm text-[#b3b3b3] hover:text-white group transition">
            <div className="w-10 h-10 rounded bg-[#282828] flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-[#b3b3b3]" />
            </div>
            <div className="truncate">
              <p className="font-medium truncate">Road Trip Côte Atlantique</p>
              <p className="text-xs text-[#727272]">Collaboratif • 4 participants</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-[#282828]/50 cursor-pointer text-sm text-[#b3b3b3] hover:text-white group transition">
            <div className="w-10 h-10 rounded bg-[#282828] flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-[#b3b3b3]" />
            </div>
            <div className="truncate">
              <p className="font-medium truncate">Bureau Focus Lo-Fi ☕</p>
              <p className="text-xs text-[#727272]">Collaboratif • 12 participants</p>
            </div>
          </div>
        </div>

        {/* Live Simulation Control Card */}
        <div className="bg-[#242424] p-3.5 rounded-lg border border-[#3e3e3e] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#1DB954]" />
              <span className="text-xs font-bold text-white">Simulateur Live</span>
            </div>
            <button 
              onClick={() => setLiveSimulationActive(!liveSimulationActive)}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition duration-300 ${liveSimulationActive ? 'bg-[#1DB954]' : 'bg-[#535353]'}`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition duration-300 ${liveSimulationActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <p className="text-[11px] text-[#b3b3b3] leading-relaxed">
            {liveSimulationActive ? "Actif : Des votes automatiques simulent l'activité des amis en temps réel." : "Activer pour simuler des votes d'amis et observer le classement dynamique."}
          </p>
        </div>

        {/* User Badge */}
        <div className="pt-2 border-t border-[#282828] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              alt="Alexandre M." 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1DB954]" 
            />
            <div className="truncate">
              <p className="text-sm font-bold text-white truncate">Alexandre M.</p>
              <p className="text-xs text-[#1DB954] font-medium">Spotify Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-[#1e3a2f] via-[#121212] to-[#121212] overflow-y-auto relative custom-scrollbar">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  if (activeTab === 'spec') {
                    setActiveTab('playlist');
                    showToast('Retour à la playlist collaborative');
                  } else {
                    showToast('Vous êtes sur la page principale');
                  }
                }}
                className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white/90 hover:text-white hover:bg-black transition group relative"
                title="Page précédente"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button 
                onClick={() => {
                  if (activeTab === 'playlist') {
                    setActiveTab('spec');
                    showToast('Passage à la spécification produit');
                  }
                }}
                className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white/90 hover:text-white hover:bg-black transition group relative"
                title="Page suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="hidden sm:flex items-center bg-[#242424] rounded-full px-4 py-2 w-72 space-x-2 border border-transparent focus-within:border-white">
              <Search className="w-4 h-4 text-[#b3b3b3]" />
              <input 
                type="text" 
                placeholder="Que souhaitez-vous écouter ?" 
                className="bg-transparent text-sm text-white placeholder-[#b3b3b3] outline-none w-full"
                onClick={() => setShowAddModal(true)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition flex items-center space-x-2 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>Inviter</span>
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="bg-black/40 hover:bg-black/60 p-2 rounded-full text-white transition border border-white/10"
              title="Paramètres de scoring"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* TAB 1: COLLABORATIVE PLAYLIST VIEW */}
        {activeTab === 'playlist' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Back / Navigation Bar */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setActiveTab('spec');
                  showToast('Redirection vers la spécification produit');
                }}
                className="flex items-center space-x-2 bg-black/40 hover:bg-black/70 text-[#b3b3b3] hover:text-white px-3.5 py-2 rounded-full text-xs font-bold transition border border-white/5"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Voir la Spécification Produit</span>
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-[#b3b3b3]">
                <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></span>
                <span>Session Jam & Scoring Active</span>
              </div>
            </div>

            {/* Playlist Header Hero */}
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-white/10">
              <div className="relative group shrink-0">
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.title} 
                  className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-xl shadow-2xl ring-1 ring-white/10" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                  <button className="w-14 h-14 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl hover:scale-105 transition">
                    <Play className="w-7 h-7 fill-black ml-1" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#1DB954]/20 text-[#1DB954] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Playlist Collaborative & Scoring</span>
                  </span>
                  <span className="text-xs text-[#b3b3b3]">• Mis à jour en direct</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{playlist.title}</h1>
                <p className="text-sm text-[#b3b3b3] max-w-2xl leading-relaxed">{playlist.description}</p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <img src={playlist.host.avatar} alt={playlist.host.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-white font-semibold">Créée par <span className="underline">{playlist.host.name}</span></span>
                  </div>

                  <span className="text-[#727272]">•</span>
                  
                  {/* Participants avatars stack */}
                  <div className="flex items-center cursor-pointer" onClick={() => setShowInviteModal(true)}>
                    <div className="flex -space-x-2 overflow-hidden">
                      {playlist.participants.map((p, i) => (
                        <img key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-[#121212] object-cover" src={p.avatar} alt={p.name} />
                      ))}
                    </div>
                    <span className="text-xs text-[#b3b3b3] ml-3 font-medium hover:text-white transition">
                      +4 autres participants actifs
                    </span>
                  </div>

                  <span className="text-[#727272]">•</span>
                  <span className="text-white font-semibold">{playlist.tracks.length} morceaux</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Play, Shuffle, Add, Filter) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:scale-105 transition shadow-xl"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
                </button>

                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-full transition text-sm border border-white/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un morceau</span>
                </button>

                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-full transition text-sm border border-white/10"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager la session</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#b3b3b3]">
                <div className="flex items-center space-x-1.5 bg-[#242424] px-3 py-1.5 rounded-full border border-white/5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span className="text-white font-medium">Tri automatique par score</span>
                </div>
              </div>
            </div>

            {/* Tracks Table Header */}
            <div className="grid grid-cols-12 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider py-2 px-4 border-b border-white/10">
              <div className="col-span-1 md:col-span-1">#</div>
              <div className="col-span-5 md:col-span-4">Titre</div>
              <div className="hidden md:block md:col-span-3">Album</div>
              <div className="col-span-4 md:col-span-2">Proposé par</div>
              <div className="col-span-2 md:col-span-2 text-right pr-4">Score & Votes</div>
            </div>

            {/* Tracks List */}
            <div className="space-y-1 pb-24">
              {playlist.tracks.map((track, index) => {
                const isTopThree = index < 3;
                return (
                  <div 
                    key={track.id}
                    className="grid grid-cols-12 items-center py-3 px-4 rounded-lg hover:bg-white/5 group transition cursor-pointer border border-transparent hover:border-white/5"
                    onDoubleClick={() => {
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                  >
                    {/* Rank / Index */}
                    <div className="col-span-1 flex items-center space-x-2">
                      <span className={`text-sm font-bold w-6 text-center ${isTopThree ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Title & Artist */}
                    <div className="col-span-5 md:col-span-4 flex items-center space-x-3 truncate">
                      <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded object-cover shadow" />
                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-[#1DB954] transition">{track.title}</p>
                          {track.explicit && (
                            <span className="bg-[#535353] text-[9px] text-white px-1 py-0.5 rounded font-bold">E</span>
                          )}
                          {index === 0 && (
                            <span className="bg-[#1DB954] text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                              <Trophy className="w-3 h-3 fill-black" />
                              <span>TOP 1</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="hidden md:block md:col-span-3 text-xs text-[#b3b3b3] truncate pr-4">
                      {track.album}
                    </div>

                    {/* Added By */}
                    <div className="col-span-4 md:col-span-2 flex items-center space-x-2 truncate">
                      <img src={track.addedBy.avatar} alt={track.addedBy.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <p className="text-xs text-white truncate">{track.addedBy.name}</p>
                        <p className="text-[10px] text-[#727272]">{track.addedAt}</p>
                      </div>
                    </div>

                    {/* Score & Voting Buttons */}
                    <div className="col-span-2 md:col-span-2 flex items-center justify-end space-x-2">
                      <div className="flex items-center bg-[#242424] rounded-full p-1 border border-white/10 shadow-inner">
                        {/* Downvote */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(track.id, 'down');
                          }}
                          className={`p-1.5 rounded-full transition ${track.userVote === 'down' ? 'bg-red-500/20 text-red-400' : 'text-[#b3b3b3] hover:text-white'}`}
                          title="Voter -1"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        <span className={`text-xs font-black px-2 min-w-[28px] text-center ${track.score > 0 ? 'text-[#1DB954]' : track.score < 0 ? 'text-red-400' : 'text-white'}`}>
                          {track.score > 0 ? `+${track.score}` : track.score}
                        </span>

                        {/* Upvote */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(track.id, 'up');
                          }}
                          className={`p-1.5 rounded-full transition ${track.userVote === 'up' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}
                          title="Voter +1"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Activity Stream Section */}
            <div className="bg-[#181818] p-6 rounded-xl border border-white/5 space-y-4 mb-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-[#1DB954] animate-pulse" />
                  <h3 className="text-base font-bold text-white">Activité en direct des participants</h3>
                </div>
                <span className="text-xs text-[#b3b3b3] bg-[#282828] px-3 py-1 rounded-full">Synchronisé en temps réel</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activities.slice(0, 3).map((act) => (
                  <div key={act.id} className="bg-[#242424] p-3.5 rounded-lg flex items-center space-x-3 border border-white/5">
                    <img src={act.user.avatar} alt={act.user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="truncate text-xs">
                      <p className="text-white font-medium truncate">
                        <span className="font-bold text-[#1DB954]">{act.user.name}</span> {act.action}
                      </p>
                      {act.target && <p className="text-white font-semibold truncate mt-0.5">"{act.target}"</p>}
                      <p className="text-[#727272] text-[10px] mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COMPLETE PRODUCT SPECIFICATION (BLOCKS 1-8) */}
        {activeTab === 'spec' && (
          <div className="p-6 md:p-12 space-y-8 max-w-5xl mx-auto w-full pb-32">
            
            {/* Back to playlist button */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setActiveTab('playlist');
                  showToast('Retour à la playlist collaborative');
                }}
                className="flex items-center space-x-2 bg-black/40 hover:bg-black/70 text-[#b3b3b3] hover:text-white px-3.5 py-2 rounded-full text-xs font-bold transition border border-white/5"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Retour à la Playlist Collaborative</span>
              </button>
            </div>

            {/* Header Spec */}
            <div className="space-y-3 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="bg-[#1DB954]/20 text-[#1DB954] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Spécification Produit • Spotify Encore Design System
                </span>
                <span className="text-xs text-[#b3b3b3]">• Version 2.4 (2026)</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Playlist collaborative avec scoring</h1>
              <p className="text-base text-[#b3b3b3] leading-relaxed">
                Spécification fonctionnelle, UX et UI complète rédigée par l'équipe produit Spotify. Cette fonctionnalité intègre nativement le système de scoring et de vote au sein des playlists collaboratives et des sessions Jam.
              </p>
            </div>

            {/* Block Navigation Pills */}
            <div className="flex flex-wrap gap-2 pb-4">
              {[
                { id: 1, label: '1. Concept fonctionnel' },
                { id: 2, label: '2. Parcours utilisateurs' },
                { id: 3, label: '3. Règles de scoring' },
                { id: 4, label: '4. Écrans & Wireframes' },
                { id: 5, label: '5. Comportement UI' },
                { id: 6, label: '6. Cas d\'usage' },
                { id: 7, label: '7. Edge cases' },
                { id: 8, label: '8. Logique produit' },
              ].map(block => (
                <button
                  key={block.id}
                  onClick={() => setActiveSpecBlock(block.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${activeSpecBlock === block.id ? 'bg-[#1DB954] text-black shadow-lg' : 'bg-[#242424] text-[#b3b3b3] hover:text-white hover:bg-[#333]'}`}
                >
                  {block.label}
                </button>
              ))}
            </div>

            {/* Spec Content Box */}
            <div className="bg-[#181818] p-6 md:p-8 rounded-2xl border border-white/10 space-y-6 shadow-2xl">
              
              {activeSpecBlock === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">1. Concept fonctionnel</h2>
                  </div>
                  <p className="text-sm text-[#b3b3b3] leading-relaxed">
                    La <strong className="text-white">Playlist Collaborative avec Scoring</strong> révolutionne l'écoute partagée sur Spotify en combinant la flexibilité des playlists collaboratives et la gamification des votes en temps réel.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#242424] p-4 rounded-xl border border-white/5 space-y-2">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-[#1DB954]" />
                        <span>Bénéfices pour l'Hôte</span>
                      </h3>
                      <p className="text-xs text-[#b3b3b3] leading-relaxed">
                        Fini les doublons ou les morceaux hors-sujet. L'hôte garde le contrôle tout en déléguant la curation au groupe. Les morceaux plébiscités montent automatiquement en haut de la file d'attente.
                      </p>
                    </div>
                    <div className="bg-[#242424] p-4 rounded-xl border border-white/5 space-y-2">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Users className="w-4 h-4 text-[#1DB954]" />
                        <span>Bénéfices pour les Contributeurs</span>
                      </h3>
                      <p className="text-xs text-[#b3b3b3] leading-relaxed">
                        Chaque participant peut proposer ses titres préférés et voter (+1 / -1) sur les suggestions des autres. Le score reflète instantanément le consensus musical du groupe.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSpecBlock === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <UserPlus className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">2. Parcours utilisateurs complets</h2>
                  </div>
                  <ul className="space-y-3 text-sm text-[#b3b3b3] leading-relaxed">
                    <li className="flex items-start space-x-3 bg-[#242424] p-3.5 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#1DB954] text-black font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                      <div>
                        <strong className="text-white">Création & Paramétrage :</strong> Depuis la bibliothèque, l'utilisateur crée une nouvelle playlist ou édite une playlist existante en activant le mode "Collaboratif avec Scoring".
                      </div>
                    </li>
                    <li className="flex items-start space-x-3 bg-[#242424] p-3.5 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#1DB954] text-black font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                      <div>
                        <strong className="text-white">Invitation des participants :</strong> Partage d'un lien universel (`spotify.link/jam-score...`) ou QR code scannable en présentiel. Gestion des rôles (Hôte vs Contributeur).
                      </div>
                    </li>
                    <li className="flex items-start space-x-3 bg-[#242424] p-3.5 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#1DB954] text-black font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                      <div>
                        <strong className="text-white">Contribution & Votes :</strong> Ajout de morceaux via la barre de recherche intégrée. Attribution de points (+1 / -1) par les participants. Classement automatique en temps réel.
                      </div>
                    </li>
                    <li className="flex items-start space-x-3 bg-[#242424] p-3.5 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#1DB954] text-black font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                      <div>
                        <strong className="text-white">Clôture & Archivage :</strong> À la fin de la session (ex: fin de soirée), l'hôte peut figer le classement définitif dans une playlist permanente.
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {activeSpecBlock === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <Trophy className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">3. Règles de scoring et de tri</h2>
                  </div>
                  <div className="space-y-3 text-sm text-[#b3b3b3] leading-relaxed">
                    <p className="bg-[#242424] p-4 rounded-xl">
                      <strong className="text-white">Algorithme de Score :</strong> Score = (Total Upvotes) - (Total Downvotes). Chaque utilisateur dispose d'un quota par défaut de votes pour éviter le spam (ex: max 10 votes par session, modifiable par l'hôte).
                    </p>
                    <p className="bg-[#242424] p-4 rounded-xl">
                      <strong className="text-white">Règles de Départage :</strong> En cas d'égalité de score entre deux morceaux, le critère secondaire est l'ordre chronologique d'ajout (le plus ancien en premier) ou le bonus de l'hôte si activé.
                    </p>
                    <p className="bg-[#242424] p-4 rounded-xl">
                      <strong className="text-white">Anti-Abus :</strong> Empêchement de voter sur ses propres morceaux (optionnel selon les paramètres) et limitation du taux de requêtes (rate limiting) pour contrer les scripts de vote automatique.
                    </p>
                  </div>
                </div>
              )}

              {activeSpecBlock === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <Smartphone className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">4. Écrans à concevoir</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">Écran Principal Playlist</h3>
                      <p className="text-xs text-[#b3b3b3]">En-tête cover art, badges de statut, liste des pistes triées par score avec boutons de vote +/- intuitifs.</p>
                    </div>
                    <div className="bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">Modal d'Ajout & Recherche</h3>
                      <p className="text-xs text-[#b3b3b3]">Recherche rapide dans le catalogue Spotify avec aperçu audio de 30 secondes et bouton "Proposer".</p>
                    </div>
                    <div className="bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">Panneau Paramètres de Scoring</h3>
                      <p className="text-xs text-[#b3b3b3]">Curseurs et toggles pour l'hôte : droit de veto, votes anonymes, tri automatique, quota de votes.</p>
                    </div>
                    <div className="bg-#[242424] bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">Flux d'Activité en direct</h3>
                      <p className="text-xs text-[#b3b3b3]">Notifications contextuelles sous forme de ticker montrant qui a voté ou ajouté quel morceau.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSpecBlock === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <Sliders className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">5. Comportement UI (Design System Encore)</h2>
                  </div>
                  <p className="text-sm text-[#b3b3b3] leading-relaxed">
                    Respect absolu des directives graphiques de Spotify Encore :
                  </p>
                  <ul className="space-y-2 text-sm text-[#b3b3b3]">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                      <span>Palette sombre (`#121212`, `#181818`, `#282828`) et accents vert Spotify (`#1DB954`).</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                      <span>Typographie Circular / Inter avec hiérarchie stricte (titres en gras, métadonnées en gris `#b3b3b3`).</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                      <span>Micro-animations haptiques et transitions fluides lors du re-tri instantané des morceaux après un vote.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeSpecBlock === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <Music className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">6. Cas d'usage principaux</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">🎉 Soirée entre amis</h3>
                      <p className="text-xs text-[#b3b3b3]">Éviter les disputes sur la musique : chacun vote pour les sons qui mettent l'ambiance.</p>
                    </div>
                    <div className="bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">🚗 Road Trip</h3>
                      <p className="text-xs text-[#b3b3b3]">Le passager et les occupants à l'arrière alimentent la playlist du trajet en temps réel.</p>
                    </div>
                    <div className="bg-[#242424] p-4 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-white">🏢 Bureau & Team</h3>
                      <p className="text-xs text-[#b3b3b3]">Ambiance de travail collaborative sans imposer les goûts d'une seule personne.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSpecBlock === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <AlertCircle className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">7. Edge cases & Résolution</h2>
                  </div>
                  <div className="space-y-3 text-sm text-[#b3b3b3]">
                    <div className="bg-[#242424] p-3.5 rounded-xl">
                      <strong className="text-white">Votes simultanés :</strong> Utilisation de WebSockets avec résolution de conflits optimiste pour éviter toute latence d'affichage.
                    </div>
                    <div className="bg-[#242424] p-3.5 rounded-xl">
                      <strong className="text-white">Morceau ajouté en double :</strong> Détection automatique par l'URI Spotify et fusion des votes si le morceau est déjà présent.
                    </div>
                    <div className="bg-[#242424] p-3.5 rounded-xl">
                      <strong className="text-white">Déconnexion réseau :</strong> File d'attente locale des votes synchronisée automatiquement dès le rétablissement de la connexion.
                    </div>
                  </div>
                </div>
              )}

              {activeSpecBlock === 8 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-3 text-[#1DB954]">
                    <Info className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">8. Logique produit & Écosystème</h2>
                  </div>
                  <p className="text-sm text-[#b3b3b3] leading-relaxed">
                    Cette fonctionnalité prolonge naturellement le succès des fonctionnalités sociales de Spotify telles que <strong className="text-white">Blend</strong> et <strong className="text-white">Jam</strong>. En introduisant le scoring, Spotify transforme l'écoute passive en une expérience ludique, interactive et fédératrice, renforçant la rétention et le partage organique sur la plateforme.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* BOTTOM PLAYER BAR */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-[#282828] px-4 flex items-center justify-between z-30">
        
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 w-1/4">
          <img 
            src={playlist.tracks[currentTrackIndex]?.coverUrl || playlist.tracks[0].coverUrl} 
            alt="Current track" 
            className="w-14 h-14 rounded-md object-cover shadow" 
          />
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {playlist.tracks[currentTrackIndex]?.title || playlist.tracks[0].title}
            </p>
            <p className="text-xs text-[#b3b3b3] truncate hover:underline cursor-pointer">
              {playlist.tracks[currentTrackIndex]?.artist || playlist.tracks[0].artist}
            </p>
          </div>
          <button className="text-[#b3b3b3] hover:text-white transition">
            <Heart className="w-4 h-4 text-[#1DB954] fill-[#1DB954]" />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 w-2/4 max-w-md">
          <div className="flex items-center space-x-6">
            <button className="text-[#b3b3b3] hover:text-white transition">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentTrackIndex(prev => (prev > 0 ? prev - 1 : playlist.tracks.length - 1))}
              className="text-[#b3b3b3] hover:text-white transition"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>
            <button 
              onClick={() => setCurrentTrackIndex(prev => (prev < playlist.tracks.length - 1 ? prev + 1 : 0))}
              className="text-[#b3b3b3] hover:text-white transition"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition">
              <Radio className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full text-xs text-[#b3b3b3]">
            <span>1:12</span>
            <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full overflow-hidden cursor-pointer group">
              <div className="w-1/3 h-full bg-white group-hover:bg-[#1DB954] transition"></div>
            </div>
            <span>{playlist.tracks[currentTrackIndex]?.duration || '3:00'}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-[#b3b3b3]" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 accent-[#1DB954] cursor-pointer h-1 bg-[#4d4d4d] rounded-lg" 
            />
          </div>
          <button className="text-[#b3b3b3] hover:text-white transition">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* MODAL: ADD TRACK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#242424] w-full max-w-lg rounded-2xl p-6 border border-white/10 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Ajouter un morceau à la session</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#b3b3b3] hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#b3b3b3]" />
                <input 
                  type="text" 
                  placeholder="Rechercher un artiste (ex: Daft Punk, Stromae, Angèle...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-[#b3b3b3] outline-none focus:border-[#1DB954]"
                  autoFocus
                />
              </div>

              {/* Quick Artist Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-[#b3b3b3] self-center mr-1">Suggestions :</span>
                {['Daft Punk', 'Stromae', 'The Weeknd', 'Angèle', 'Orelsan', 'Taylor Swift'].map((artistName) => (
                  <button
                    key={artistName}
                    onClick={() => setSearchQuery(artistName)}
                    className="bg-[#181818] hover:bg-[#333] text-white text-[11px] px-2.5 py-1 rounded-full border border-white/5 transition"
                  >
                    {artistName}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              <div className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                {searchQuery ? 'Résultats de recherche' : 'Suggestions populaires'}
              </div>

              {(() => {
                const catalog = [
                  { title: 'Good Luck, Babe!', artist: 'Chappell Roan', album: 'Good Luck, Babe!', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Not Like Us', artist: 'Kendrick Lamar', album: 'Not Like Us', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Taste', artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Pink Pony Club', artist: 'Chappell Roan', album: 'The Rise and Fall', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Formidable', artist: 'Stromae', album: 'racine carrée', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Balance ton quoi', artist: 'Angèle', album: 'Brol', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80' },
                  { title: 'La Terre est ronde', artist: 'Orelsan', album: 'Le Chant des sirènes', cover: 'https://images.unsplash.com/photo-1511253462538-f027c945d471?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Feu de bois', artist: 'Damso', album: 'Lithopédion', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80' },
                  { title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' }
                ];

                const filtered = catalog.filter(item => 
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.album.toLowerCase().includes(searchQuery.toLowerCase())
                );

                const results = filtered.length > 0 ? filtered : (searchQuery.trim() ? [
                  {
                    title: `Titre phare de ${searchQuery}`,
                    artist: searchQuery,
                    album: 'Spotify Catalog 2026',
                    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                  }
                ] : catalog.slice(0, 6));

                return results.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleAddTrack(item.title, item.artist, item.album, item.cover)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#333] transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <img src={item.cover} alt={item.title} className="w-10 h-10 rounded object-cover shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-semibold text-white group-hover:text-[#1DB954] truncate">{item.title}</p>
                        <p className="text-xs text-[#b3b3b3] truncate">{item.artist}</p>
                      </div>
                    </div>
                    <button className="bg-white/10 hover:bg-[#1DB954] hover:text-black text-white text-xs font-bold px-3 py-1.5 rounded-full transition shrink-0 ml-2">
                      Proposer (+1)
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVITE & SHARE */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#242424] w-full max-w-md rounded-2xl p-6 border border-white/10 space-y-6 shadow-2xl animate-fade-in text-center">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Inviter des participants</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#b3b3b3] hover:text-white">✕</button>
            </div>

            <div className="bg-[#181818] p-4 rounded-xl flex flex-col items-center justify-center space-y-3 border border-white/5">
              <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow">
                {/* Simulated QR Code */}
                <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white text-xs font-mono p-2 text-center rounded">
                  <Music className="w-8 h-8 text-[#1DB954] mb-1" />
                  <span>spotify.link/jam-score</span>
                </div>
              </div>
              <p className="text-xs text-[#b3b3b3]">Scannez pour rejoindre la session collaborative avec scoring en direct.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 bg-[#181818] p-2.5 rounded-lg border border-white/5">
                <input 
                  type="text" 
                  readOnly 
                  value="https://spotify.link/jam-score-rooftop-2026" 
                  className="bg-transparent text-xs text-white outline-none w-full px-2 font-mono" 
                />
                <button 
                  onClick={() => showToast('Lien copié dans le presse-papier !')}
                  className="bg-[#1DB954] text-black text-xs font-bold px-3 py-1.5 rounded hover:scale-105 transition shrink-0"
                >
                  Copier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#242424] w-full max-w-md rounded-2xl p-6 border border-white/10 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Paramètres de Scoring</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-[#b3b3b3] hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between bg-[#181818] p-3.5 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-white">Tri automatique par score</p>
                  <p className="text-xs text-[#b3b3b3]">Réordonne les morceaux en temps réel</p>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#1DB954] w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between bg-[#181818] p-3.5 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-white">Autoriser les votes négatifs (-1)</p>
                  <p className="text-xs text-[#b3b3b3]">Permet de baisser le score des propositions</p>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#1DB954] w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between bg-[#181818] p-3.5 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-white">Votes anonymes</p>
                  <p className="text-xs text-[#b3b3b3]">Masque l'auteur des votes individuels</p>
                </div>
                <input type="checkbox" className="accent-[#1DB954] w-4 h-4 cursor-pointer" />
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    setShowSettingsModal(false);
                    showToast('Paramètres enregistrés avec succès.');
                  }}
                  className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:scale-[1.02] transition shadow-lg text-sm"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
