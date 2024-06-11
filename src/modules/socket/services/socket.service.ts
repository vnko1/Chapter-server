import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/modules/user';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.headers.token;
      if (!token) throw new WsException('Unauthorized');

      const payload = await this.jwtService.verifyAsync(token as string, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserByPK(payload.sub);

      if (!user) throw new WsException('Unauthorized');

      const clientId = user.userId;
      this.connectedClients.set(clientId, socket);
      socket.on('disconnect', () => {
        this.connectedClients.delete(clientId);
      });
    } catch (error) {
      socket.disconnect();
    }
  }

  emitEvent(event: string, data: any, userId: string) {
    const client = this.connectedClients.get(userId);
    if (client) client.emit(event, data);
  }
}
