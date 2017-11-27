import { Component, OnInit, OnDestroy } from '@angular/core';

import { Message } from './models/message.model';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  message: Message;
  messages: Message[] = [];
  currentMessage: string;
  messagesSubscription: any;
  usersSubscription: any;
  users: string[] = [];
  menuOpen: boolean = false;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messagesSubscription = this.chatService.getMessages().subscribe((message: Message) => {
      let date = new Date();
      message.time = date.getHours() + ':' + date.getMinutes();
      this.messages.push(message);

      // Wait a bit until message is added to the list
      // otherwise the height is not up to date
      setTimeout(() => {
        this.scrollToBottom(document.getElementById('messages-wrapper'));
      }, 200);

    });

    // Get list of online users
    this.usersSubscription = this.chatService.getUsers().subscribe((users: string[]) => {
      this.users = Object.values(users);
    });
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  toggleMenu(event) {
    this.menuOpen = !this.menuOpen;
  }

  sendMessage(){
    // Don't send empty message
    if(!this.currentMessage) {
      return;
    }
    this.chatService.sendMessage(this.currentMessage);

    // Empty the input after sending
    this.currentMessage = '';
  }

  // Helper function to scroll to the bottom of the chat view
  private scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }
}
