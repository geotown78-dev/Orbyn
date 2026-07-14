const fs = require('fs');
let code = fs.readFileSync('src/components/VoiceChannel.tsx', 'utf8');

if (!code.includes("candidateQueue")) {
    code = code.replace(
        /const peerConnections = useRef<Map<string, RTCPeerConnection>>\(new Map\(\)\);/,
        `const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());\n  const candidateQueue = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());`
    );

    code = code.replace(
        /await pc\.setRemoteDescription\(new RTCSessionDescription\(payload\.offer\)\);\n\s*const answer = await pc\.createAnswer\(\);\n\s*await pc\.setLocalDescription\(answer\);\n\s*room\.send\(\{/,
        `await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            
            // Process queued candidates
            const queue = candidateQueue.current.get(payload.senderId);
            if (queue) {
               for (const c of queue) {
                  await pc.addIceCandidate(new RTCIceCandidate(c)).catch(e => console.log('Ice add error', e));
               }
               candidateQueue.current.delete(payload.senderId);
            }

            room.send({`
    );

    code = code.replace(
        /await pc\.setRemoteDescription\(new RTCSessionDescription\(payload\.answer\)\);/,
        `await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
              // Process queued candidates
              const queue = candidateQueue.current.get(payload.senderId);
              if (queue) {
                 for (const c of queue) {
                    await pc.addIceCandidate(new RTCIceCandidate(c)).catch(e => console.log('Ice add error', e));
                 }
                 candidateQueue.current.delete(payload.senderId);
              }`
    );

    code = code.replace(
        /if \(pc && payload\.candidate\) \{\n\s*await pc\.addIceCandidate\(new RTCIceCandidate\(payload\.candidate\)\)\.catch\(e => console\.log\('Ice add error', e\)\);\n\s*\}/,
        `if (pc && payload.candidate) {
              if (pc.remoteDescription) {
                 await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(e => console.log('Ice add error', e));
              } else {
                 const queue = candidateQueue.current.get(payload.senderId) || [];
                 queue.push(payload.candidate);
                 candidateQueue.current.set(payload.senderId, queue);
              }
            }`
    );
}

fs.writeFileSync('src/components/VoiceChannel.tsx', code);
console.log("Patched VoiceChannel candidate queue");
