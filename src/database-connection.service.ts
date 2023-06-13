import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseConnectionService implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    await this.handleConnectionLost();
  }

  private async handleConnectionLost() {
    const isConnected = await this.connection.isConnected;
    if (!isConnected) {
      console.log('La conexión se ha perdido. Intentando reconectar...');
      await this.connection.connect();
      console.log('Reconexión exitosa');
    }
  }
}