import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private hubConnection: signalR.HubConnection | undefined;
  
  // Expose a BehaviorSubject for the UI to subscribe to
  private visitorCountSubject = new BehaviorSubject<number>(10000);
  public visitorCount$ = this.visitorCountSubject.asObservable();

  private hubUrl = environment.apiUrl ? environment.apiUrl.replace('/api', '') + '/visitorhub' : 'https://localhost:7196/visitorhub';

  constructor() { }

  public init(): void {
    this.setupSignalR();
  }

  private setupSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection established for VisitorHub');
        
        // // 1. Check local storage
        // const hasVisited = localStorage.getItem('hasVisited');
        // const isFirstVisit = !hasVisited;
        
        // if (isFirstVisit) {
        //     localStorage.setItem('hasVisited', 'true');
        // }

        // 2. Register visit with backend hub
        this.hubConnection?.invoke('RegisterVisit', true)
            .catch(err => console.error('Error invoking RegisterVisit:', err));
      })
      .catch(err => console.error('Error establishing SignalR connection:', err));

    this.hubConnection.on('UpdateVisitorCount', (newCount: number) => {
      this.visitorCountSubject.next(newCount);
    });
  }
}
