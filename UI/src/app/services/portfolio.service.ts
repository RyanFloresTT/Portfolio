import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';

export interface CommitData {
  id: number;
  repositoryName: string;
  commitCount: number;
  lastUpdated: string;
  periodStart: string;
  periodEnd: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private hubConnection?: HubConnection;
  public commitData = signal<CommitData[]>([]);
  public connectionStatus = signal<string>('Disconnected');

  constructor(private http: HttpClient) {
    this.initializeSignalR();
  }

  private async initializeSignalR() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5220/portfolioHub')
      .build();

    this.hubConnection.on('CommitDataUpdated', (data: CommitData[]) => {
      this.commitData.set(data);
    });

    this.hubConnection.onclose(() => {
      this.connectionStatus.set('Disconnected');
    });

    this.hubConnection.onreconnecting(() => {
      this.connectionStatus.set('Reconnecting');
    });

    this.hubConnection.onreconnected(() => {
      this.connectionStatus.set('Connected');
    });

    try {
      await this.hubConnection.start();
      this.connectionStatus.set('Connected');
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.connectionStatus.set('Error');
    }
  }

  async loadCommitData() {
    try {
      const data = await firstValueFrom(this.http.get<CommitData[]>('http://localhost:5220/'));
      if (data) {
        this.commitData.set(data);
      }
    } catch (error) {
      console.error('Error loading commit data:', error);
    }
  }
}