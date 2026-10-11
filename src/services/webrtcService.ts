import { liveSocketService } from './liveCallSocketService';
import { CallType } from '../types';

interface WebRtcCallbacks {
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionState?: (state: RTCPeerConnectionState) => void;
  onError?: (err: Error) => void;
}

export class WebRtcManager {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callbacks: WebRtcCallbacks = {};
  private callId: string = '';
  private roomId: string = '';
  private isInitiator: boolean = false;
  private callType: CallType = 'audio';

  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  constructor(callbacks: WebRtcCallbacks) {
    this.callbacks = callbacks;
  }

  // Generate synthetic stream if microphone/camera is not accessible or denied
  private createFallbackStream(callType: CallType): MediaStream {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const dst = audioContext.createMediaStreamDestination();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioContext.currentTime);
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.001, audioContext.currentTime); // Inaudible fallback carrier
    osc.connect(gain);
    gain.connect(dst);
    osc.start();

    const audioTrack = dst.stream.getAudioTracks()[0];
    const tracks: MediaStreamTrack[] = [audioTrack];

    if (callType === 'video') {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let frame = 0;
        const render = () => {
          frame++;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, 640, 480);
          ctx.fillStyle = '#f59e0b';
          ctx.font = '24px sans-serif';
          ctx.fillText('Zebra Live Video Call', 190, 220);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '16px sans-serif';
          ctx.fillText(`Camera Preview (${frame})`, 230, 260);
          requestAnimationFrame(render);
        };
        render();
        const canvasStream = canvas.captureStream(25);
        if (canvasStream.getVideoTracks().length > 0) {
          tracks.push(canvasStream.getVideoTracks()[0]);
        }
      }
    }

    return new MediaStream(tracks);
  }

  public async startLocalMedia(callType: CallType): Promise<MediaStream> {
    this.callType = callType;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
        });
        this.localStream = stream;
      } else {
        this.localStream = this.createFallbackStream(callType);
      }
    } catch (err: any) {
      console.warn('[WebRTC] MediaDevice error, using fallback stream:', err.message);
      this.localStream = this.createFallbackStream(callType);
    }

    if (this.callbacks.onLocalStream && this.localStream) {
      this.callbacks.onLocalStream(this.localStream);
    }
    return this.localStream;
  }

  public initPeerConnection(callId: string, roomId: string, isInitiator: boolean) {
    this.callId = callId;
    this.roomId = roomId;
    this.isInitiator = isInitiator;

    this.pc = new RTCPeerConnection({
      iceServers: this.iceServers
    });

    this.remoteStream = new MediaStream();
    if (this.callbacks.onRemoteStream) {
      this.callbacks.onRemoteStream(this.remoteStream);
    }

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.pc?.addTrack(track, this.localStream!);
      });
    }

    // Handle remote track
    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track);
      });
      if (this.callbacks.onRemoteStream && this.remoteStream) {
        this.callbacks.onRemoteStream(this.remoteStream);
      }
    };

    // ICE candidates
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        liveSocketService.sendWebRtcSignal({
          type: 'candidate',
          callId: this.callId,
          roomId: this.roomId,
          from: '',
          data: event.candidate
        });
      }
    };

    // Connection state
    this.pc.onconnectionstatechange = () => {
      if (this.pc && this.callbacks.onConnectionState) {
        this.callbacks.onConnectionState(this.pc.connectionState);
      }
    };
  }

  public async createOffer(): Promise<void> {
    if (!this.pc) return;
    try {
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.callType === 'video'
      });
      await this.pc.setLocalDescription(offer);

      liveSocketService.sendWebRtcSignal({
        type: 'offer',
        callId: this.callId,
        roomId: this.roomId,
        from: '',
        data: offer
      });
    } catch (err: any) {
      console.error('[WebRTC] createOffer error:', err);
      if (this.callbacks.onError) this.callbacks.onError(err);
    }
  }

  public async handleSignal(signalType: 'offer' | 'answer' | 'candidate', data: any) {
    if (!this.pc) return;
    try {
      if (signalType === 'offer') {
        await this.pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        liveSocketService.sendWebRtcSignal({
          type: 'answer',
          callId: this.callId,
          roomId: this.roomId,
          from: '',
          data: answer
        });
      } else if (signalType === 'answer') {
        await this.pc.setRemoteDescription(new RTCSessionDescription(data));
      } else if (signalType === 'candidate') {
        if (data) {
          await this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      }
    } catch (err: any) {
      console.warn('[WebRTC] handleSignal error:', err);
    }
  }

  public toggleMute(): boolean {
    if (!this.localStream) return false;
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      return !audioTrack.enabled; // true if muted
    }
    return false;
  }

  public toggleVideo(): boolean {
    if (!this.localStream) return false;
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return !videoTrack.enabled; // true if camera is off
    }
    return false;
  }

  public stop() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.remoteStream = null;
  }
}
