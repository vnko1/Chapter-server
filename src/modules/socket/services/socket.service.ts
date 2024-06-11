import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    console.log('🚀 ~ SocketService ~ handleConnection ~ socket:', socket);
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);
    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
  }

  emitEvent(event: string, data: any): void {
    this.connectedClients.forEach((client) => {
      console.log(
        '🚀 ~ SocketService ~ this.connectedClients.forEach ~ client:',
        client,
      );
      client.emit(event, data);
    });
  }
}
