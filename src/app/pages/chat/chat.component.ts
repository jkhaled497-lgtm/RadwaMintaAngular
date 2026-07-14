import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ChatService, Conversation, ChatMessage } from '../../core/services/chat.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  isChatOpen: boolean = false;
  availableConversations: Conversation[] = [];
  myConversations: Conversation[] = [];
  
  // Admin properties
  adminSystemChats: Conversation[] = [];
  adminUserChats: Conversation[] = [];
  activeTab: 'system' | 'users' = 'system';

  // Normal User properties
  normalUserChats: any[] = [
    { id: 'radwaminta', nameEn: 'Radwaminta Chat', icon: 'R', isAction: true },
    { id: 'supplier', nameEn: 'Supplier Chat', icon: 'S', isAction: false, originalId: null },
    { id: 'client', nameEn: 'Client Chat', icon: 'C', isAction: false, originalId: null }
  ];

  activeConversation: Conversation | null = null;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  totalUnreadCount: number = 0;
  publicUnreadCount: number = 0;
  privateUnreadCount: number = 0;
  isAdmin: boolean = false;
  isLoadingMore: boolean = false;
  allMessagesLoaded: boolean = false;
  private currentSkip: number = 0;

  private messagesSub: Subscription | undefined;
  private messageReceivedSub: Subscription | undefined;
  private routerSub: Subscription | undefined;
  private currentToken: string | null = null;

  constructor(
    private chatService: ChatService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isChatLoading: boolean = false;
  environmentImageUrl: any;

  toggleChat(): void {
    if (this.isChatOpen) {
      this.isChatOpen = false;
      return;
    }

    // Set loading state for 3 seconds before opening
    this.isChatLoading = true;
    setTimeout(() => {
      this.isChatLoading = false;
      this.isChatOpen = true;
      if (this.activeConversation && this.activeConversation.unreadCount && this.activeConversation.unreadCount > 0) {
        this.markAsRead(this.activeConversation.id);
      }
      this.scrollToBottom();
    }, 300);
  }

  ngOnInit(): void {
    this.environmentImageUrl = environment.FilesURL;
    if (isPlatformBrowser(this.platformId)) {
      this.currentToken = localStorage.getItem('token');
      if (this.currentToken) {
        this.initChatState();
      }

      this.routerSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const newToken = localStorage.getItem('token');
          if (newToken !== this.currentToken) {
            this.currentToken = newToken;
            if (newToken) {
              this.initChatState();
            } else {
              this.clearChatState();
            }
          }
        }
      });

      // Handle historical messages or room joins
      this.messagesSub = this.chatService.messages$.subscribe(msgs => {
        const chatContainer = document.getElementById('chat-messages-container');
        const scrollHeightBefore = chatContainer ? chatContainer.scrollHeight : 0;
        const scrollTopBefore = chatContainer ? chatContainer.scrollTop : 0;

        this.messages = msgs;
        
        if (this.isLoadingMore) {
           setTimeout(() => {
             if (chatContainer) {
               chatContainer.scrollTop = chatContainer.scrollHeight - scrollHeightBefore + scrollTopBefore;
             }
             this.isLoadingMore = false;
           }, 0);
        } else {
           this.scrollToBottom();
        }
      });

      // Handle single new message for dynamic updating
      this.messageReceivedSub = this.chatService.messageReceived$.subscribe(msg => {
        if (!msg) return;

        this.updateLastMessage(msg.conversationId, msg.content, msg.createdAt);

        if (this.activeConversation && this.activeConversation.id === msg.conversationId) {
          // Open conversation received a message
          this.messages.push(msg);
          this.scrollToBottom();
          if (this.isChatOpen) {
            this.markAsRead(msg.conversationId);
          } else {
             // Increment badge if chat is selected but widget is closed
             this.incrementBadge(msg.conversationId);
          }
        } else {
          // Message received for a background conversation
          this.incrementBadge(msg.conversationId);
        }
      });
    }
  }

  private initChatState(): void {
    this.extractUserIdFromToken();
    this.loadConversations();
    this.chatService.startConnection();
  }

  private clearChatState(): void {
    this.chatService.stopConnection();
    this.availableConversations = [];
    this.myConversations = [];
    this.adminSystemChats = [];
    this.adminUserChats = [];
    this.normalUserChats = [
      { id: 'radwaminta', nameEn: 'Radwaminta Chat', icon: 'R', isAction: true },
      { id: 'supplier', nameEn: 'Supplier Chat', icon: 'S', isAction: false, originalId: null },
      { id: 'client', nameEn: 'Client Chat', icon: 'C', isAction: false, originalId: null }
    ];
    this.activeConversation = null;
    this.messages = [];
    this.isChatOpen = false;
    this.currentUserId = '';
    this.totalUnreadCount = 0;
    this.publicUnreadCount = 0;
    this.privateUnreadCount = 0;
    this.isAdmin = false;
  }

  private incrementBadge(conversationId: string): void {
    const conv = this.myConversations.find(c => c.id === conversationId);
    if (conv) {
      conv.unreadCount = (conv.unreadCount || 0) + 1;
      this.calculateTotalUnread();
      this.mapNormalUserChats();
      this.processAdminChats();
    }
  }

  private updateLastMessage(conversationId: string, content: string, createdAt: Date | string): void {
    const conv = this.myConversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = content;
      conv.lastMessageAt = createdAt;
      this.sortConversations(this.myConversations);
    }
    
    const adminSys = this.adminSystemChats.find(c => c.id === conversationId);
    if (adminSys) {
      adminSys.lastMessage = content;
      adminSys.lastMessageAt = createdAt;
      this.sortConversations(this.adminSystemChats);
    }
    
    const adminUser = this.adminUserChats.find(c => c.id === conversationId);
    if (adminUser) {
      adminUser.lastMessage = content;
      adminUser.lastMessageAt = createdAt;
      this.sortConversations(this.adminUserChats);
    }
    
    const normal = this.normalUserChats.find(c => c.originalId === conversationId);
    if (normal) {
      normal.lastMessage = content;
      normal.lastMessageAt = createdAt;
      this.sortNormalUserChats();
    }
  }

  private sortConversations(chats: Conversation[]): void {
    chats.sort((a, b) => {
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA; // Descending (newest first)
    });
  }

  private sortNormalUserChats(): void {
    this.normalUserChats.sort((a, b) => {
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
    if (this.messageReceivedSub) {
      this.messageReceivedSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.chatService.stopConnection();
  }

  private extractUserIdFromToken(): void {
    debugger;
    const token = localStorage.getItem('token');
    const UserTypeForUser = localStorage.getItem('userType');
    this.isAdmin = UserTypeForUser === '3' || UserTypeForUser === 'Admin'; // Assuming 3 is Admin enum value
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.nameid || '';
        const userType = payload['UserType'];
        this.isAdmin = UserTypeForUser === '3' || UserTypeForUser === 'Admin'; // Assuming 3 is Admin enum value
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }

  loadConversations(): void {
    this.chatService.getAvailableConversations().subscribe({
      next: (convs) => {
        this.availableConversations = convs;
        this.mapNormalUserChats();
        this.processAdminChats();
      },
      error: (err) => console.error('Failed to load available conversations', err)
    });

    this.chatService.getMyConversations().subscribe({
      next: (myConvs) => {
        this.myConversations = myConvs;
        this.calculateTotalUnread();
        this.mapNormalUserChats();
        this.processAdminChats();
      },
      error: (err) => console.error('Failed to load my conversations', err)
    });
  }

  processAdminChats(): void {
    if (!this.isAdmin) return;

    this.adminUserChats = this.myConversations.filter(c => c.isSupportChat);
    this.sortConversations(this.adminUserChats);
    
    // System chats: Any available non-support chat + my joined non-support chats
    const systemChatsMap = new Map<string, Conversation>();
    this.availableConversations.forEach(c => {
      if (!c.isSupportChat) systemChatsMap.set(c.id, c);
    });
    this.myConversations.forEach(c => {
      if (!c.isSupportChat) systemChatsMap.set(c.id, c);
    });
    
    this.adminSystemChats = Array.from(systemChatsMap.values());
    this.sortConversations(this.adminSystemChats);
  }

  mapNormalUserChats(): void {
    if (this.isAdmin) return;

    // Map Supplier
    const supplier = this.availableConversations.find(c => c.nameEn.toLowerCase().includes('supplier')) || 
                     this.myConversations.find(c => c.nameEn.toLowerCase().includes('supplier'));
    if (supplier) {
      const idx = this.normalUserChats.findIndex(c => c.id === 'supplier');
      this.normalUserChats[idx].originalId = supplier.id;
      const mySupplier = this.myConversations.find(c => c.id === supplier.id);
      this.normalUserChats[idx].unreadCount = mySupplier?.unreadCount || 0;
      this.normalUserChats[idx].lastMessage = mySupplier?.lastMessage || supplier.lastMessage;
      this.normalUserChats[idx].lastMessageAt = mySupplier?.lastMessageAt || supplier.lastMessageAt;
    }

    // Map Client
    const client = this.availableConversations.find(c => c.nameEn.toLowerCase().includes('client')) || 
                   this.myConversations.find(c => c.nameEn.toLowerCase().includes('client'));
    if (client) {
      const idx = this.normalUserChats.findIndex(c => c.id === 'client');
      this.normalUserChats[idx].originalId = client.id;
      const myClient = this.myConversations.find(c => c.id === client.id);
      this.normalUserChats[idx].unreadCount = myClient?.unreadCount || 0;
      this.normalUserChats[idx].lastMessage = myClient?.lastMessage || client.lastMessage;
      this.normalUserChats[idx].lastMessageAt = myClient?.lastMessageAt || client.lastMessageAt;
    }

    // Map Support
    const support = this.myConversations.find(c => c.isSupportChat);
    const radwaIdx = this.normalUserChats.findIndex(c => c.id === 'radwaminta');
    if (support) {
      this.normalUserChats[radwaIdx].originalId = support.id;
      this.normalUserChats[radwaIdx].isAction = false;
      this.normalUserChats[radwaIdx].unreadCount = support.unreadCount || 0;
      this.normalUserChats[radwaIdx].lastMessage = support.lastMessage;
      this.normalUserChats[radwaIdx].lastMessageAt = support.lastMessageAt;
    }

    this.sortNormalUserChats();
  }

  selectNormalUserChat(chatDef: any): void {
    if (chatDef.isAction && chatDef.id === 'radwaminta') {
      this.startSupportChat();
    } else if (chatDef.originalId) {
      const conv = this.availableConversations.find(c => c.id === chatDef.originalId) || 
                   this.myConversations.find(c => c.id === chatDef.originalId);
      if (conv) {
        this.selectConversation(conv);
      }
    }
  }

  calculateTotalUnread(): void {
    this.totalUnreadCount = this.myConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    this.publicUnreadCount = this.myConversations.filter(c => !c.isSupportChat).reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    this.privateUnreadCount = this.myConversations.filter(c => c.isSupportChat).reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  }

  isConversationJoined(convId: string): boolean {
    return this.myConversations.some(c => c.id === convId);
  }

  startSupportChat(): void {
    this.chatService.startSupportChat().subscribe({
      next: (res) => {
        // Refresh conversations to get the newly created private chat
        this.chatService.getMyConversations().subscribe((convs) => {
          this.myConversations = convs;
          const supportConv = convs.find(c => c.id === res.conversationId);
          if (supportConv) {
            this.selectConversation(supportConv);
          }
        });
      },
      error: (err) => console.error('Failed to start support chat', err)
    });
  }

  async selectConversation(conv: Conversation): Promise<void> {
    const isJoined = this.myConversations.some(c => c.id === conv.id);

    if (!isJoined) {
      this.chatService.joinConversationHttp(conv.id).subscribe({
        next: async () => {
          this.myConversations.push(conv);
          await this.chatService.joinRoom(conv.id);
          this.markAsRead(conv.id);
          
          this.activeConversation = conv;
          this.currentSkip = 0;
          this.allMessagesLoaded = false;
        },
        error: (err) => console.error('Failed to join conversation', err)
      });
    } else {
      this.activeConversation = conv;
      this.currentSkip = 0;
      this.allMessagesLoaded = false;
      
      await this.chatService.joinRoom(conv.id);
      this.markAsRead(conv.id);
    }
  }

  markAsRead(conversationId: string): void {
    this.chatService.markAsRead(conversationId).subscribe(() => {
      const conv = this.myConversations.find(c => c.id === conversationId);
      if (conv && conv.unreadCount && conv.unreadCount > 0) {
        conv.unreadCount = 0;
        this.calculateTotalUnread();
        this.mapNormalUserChats();
        this.processAdminChats();
      }
    });
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || !this.activeConversation) return;

    const msgContent = this.newMessage;
    await this.chatService.sendMessage(this.activeConversation.id, msgContent);
    this.updateLastMessage(this.activeConversation.id, msgContent, new Date());
    this.newMessage = '';
  }

  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollTop === 0 && !this.isLoadingMore && !this.allMessagesLoaded && this.activeConversation) {
      this.isLoadingMore = true;
      this.currentSkip += 50;
      
      this.chatService.getChatHistory(this.activeConversation.id, this.currentSkip, 50).subscribe({
        next: (olderMessages) => {
          if (olderMessages.length < 50) {
            this.allMessagesLoaded = true;
          }
          // Prepend to messages array
          this.messages = [...olderMessages, ...this.messages];
        },
        error: (err) => {
          console.error('Failed to load more messages', err);
          this.isLoadingMore = false;
        }
      });
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-messages-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}
