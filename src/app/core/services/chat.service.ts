import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Conversation {
  id: string;
  nameEn: string;
  nameAr: string;
  unreadCount?: number;
  imageUrl?: string;
  isSupportChat?: boolean;
  lastMessage?: string;
  lastMessageAt?: Date | string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection | undefined;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private messageReceivedSubject = new BehaviorSubject<ChatMessage | null>(null);
  public messageReceived$ = this.messageReceivedSubject.asObservable();
  
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAvailableConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/api/Chat/Available`);
  }

  getMyConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/api/Chat/MyChats`);
  }

  joinConversationHttp(conversationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Chat/Join/${conversationId}`, {});
  }

  startSupportChat(): Observable<{ conversationId: string }> {
    return this.http.post<{ conversationId: string }>(`${this.apiUrl}/api/Chat/Support`, {});
  }

  markAsRead(conversationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Chat/Read/${conversationId}`, {});
  }

  getChatHistory(conversationId: string, skip: number = 0, take: number = 50): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/api/Chat/History/${conversationId}?skip=${skip}&take=${take}`);
  }

  public startConnection(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/chathub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ' + err));

    this.addListeners();
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  private addListeners(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (data: ChatMessage) => {
      this.messageReceivedSubject.next(data);
    });

    this.hubConnection.on('LoadHistory', (history: ChatMessage[]) => {
      this.messagesSubject.next(history);
    });
  }

  public async joinRoom(conversationId: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      // Clear current messages when joining a new room
      this.messagesSubject.next([]);
      await this.hubConnection.invoke('JoinRoom', conversationId);
    }
  }

  public async sendMessage(conversationId: string, content: string, messageType: number = 0): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      const command = { conversationId, content, messageType };
      await this.hubConnection.invoke('SendMessage', command);
    }
  }
}
