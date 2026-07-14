import { useEffect, useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';
import { PhoneOff, Mic, MicOff, Signal } from 'lucide-react';

export const VoiceChannel = ({ channelId, channelName }: { channelId: string, channelName: string }) => {
  const { user, activeServer, setActiveVoiceChannel } = useApp();
  const [peers, setPeers] = useState<{ id: string, name: string, avatar: string, isMuted: boolean, stream: MediaStream | null }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const localStream = useRef<MediaStream | null>(null);
  
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        localStream.current = stream;
        startSignaling();
      })
      .catch(err => {
        console.error("Mic error", err);
        startSignaling(); // Still connect to see others even without mic
      });

    const startSignaling = () => {
      const room = supabase.channel(`voice:${activeServer}:${channelId}`, {
        config: {
          presence: { key: user.id },
          broadcast: { self: false }
        },
      });
      channelRef.current = room;

      room
        .on('presence', { event: 'sync' }, () => {
          const state = room.presenceState();
          const usersInRoom = Object.values(state).map((p: any) => p[0]);
          
          setPeers(currentPeers => {
             return usersInRoom.map(u => {
                const existing = currentPeers.find(p => p.id === u.user_id);
                return {
                   id: u.user_id,
                   name: u.user_name,
                   avatar: u.avatar,
                   isMuted: u.isMuted,
                   stream: existing ? existing.stream : null
                };
             });
          });
        })
        .on('broadcast', { event: 'signal' }, async ({ payload }) => {
          if (payload.targetId !== user.id && payload.targetId !== undefined) return;

          if (payload.type === 'join') {
            if (payload.senderId === user.id) return;
            const pc = createPeerConnection(payload.senderId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            room.send({
              type: 'broadcast',
              event: 'signal',
              payload: { type: 'offer', offer, senderId: user.id, targetId: payload.senderId }
            });
          } else if (payload.type === 'offer') {
            const pc = createPeerConnection(payload.senderId);
            await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            room.send({
              type: 'broadcast',
              event: 'signal',
              payload: { type: 'answer', answer, senderId: user.id, targetId: payload.senderId }
            });
          } else if (payload.type === 'answer') {
            const pc = peerConnections.current.get(payload.senderId);
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
            }
          } else if (payload.type === 'ice-candidate') {
            const pc = peerConnections.current.get(payload.senderId);
            if (pc && payload.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(e => console.log('Ice add error', e));
            }
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await room.track({
              user_id: user.id,
              user_name: user.name,
              avatar: user.avatar,
              isMuted: isMuted
            });
            room.send({
              type: 'broadcast',
              event: 'signal',
              payload: { type: 'join', senderId: user.id }
            });
          }
        });
    };

    const createPeerConnection = (targetId: string) => {
      if (peerConnections.current.has(targetId)) {
        return peerConnections.current.get(targetId)!;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      peerConnections.current.set(targetId, pc);

      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          pc.addTrack(track, localStream.current!);
        });
      }

      pc.onicecandidate = (e) => {
        if (e.candidate && channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'signal',
            payload: { type: 'ice-candidate', candidate: e.candidate, senderId: user.id, targetId }
          });
        }
      };

      pc.ontrack = (e) => {
        setPeers(current => current.map(p => {
          if (p.id === targetId) {
            return { ...p, stream: e.streams[0] };
          }
          return p;
        }));
      };

      return pc;
    };

    return () => {
      isMounted = false;
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [activeServer, channelId, user]);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !nextMute;
      });
    }
    if (channelRef.current && user) {
      channelRef.current.track({
        user_id: user.id,
        user_name: user.name,
        avatar: user.avatar,
        isMuted: nextMute
      });
    }
  };

  const handleDisconnect = () => {
    setActiveVoiceChannel(null);
  };

  return (
    <div className="bg-[#111218] border-t border-[#20212B] p-2 flex flex-col gap-2 shrink-0 relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
      {peers.map((peer) => (
        peer.id !== user?.id && peer.stream && (
          <AudioPlayer key={peer.id} stream={peer.stream} />
        )
      ))}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="text-green-500">
            <Signal size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-green-500 text-xs font-bold truncate">Voice Connected</span>
            <span className="text-gray-400 text-xs truncate">{channelName} / {activeServer === '@me' ? 'DM' : 'Server'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={toggleMute}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isMuted ? 'bg-[#2B2D31] text-red-400 hover:text-red-300' : 'bg-[#1A1B26] text-gray-300 hover:bg-[#2B2D31]'}`}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button 
            onClick={handleDisconnect}
            className="w-8 h-8 rounded bg-[#1A1B26] hover:bg-red-500/20 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AudioPlayer = ({ stream }: { stream: MediaStream }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay playsInline className="hidden" />;
};
