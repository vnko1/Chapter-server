import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  constructor(private jwtService: JwtService) {}

  handleConnection(socket: Socket): void {
    try {
      const token = socket.handshake.headers.token;
      if (!token) throw new WsException('Unauthorized');

      const clientId = socket.id;
      this.connectedClients.set(clientId, socket);
      socket.on('disconnect', () => {
        this.connectedClients.delete(clientId);
      });
    } catch (error) {
      socket.disconnect();
    }
  }

  emitEvent(event: string, data: any): void {
    this.connectedClients.forEach((client) => {
      //   console.log(
      //     '🚀 ~ SocketService ~ this.connectedClients.forEach ~ client:',
      //     client,
      //   );
      client.emit(event, data);
    });
  }
}
