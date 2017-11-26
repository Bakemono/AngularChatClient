import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  private url = 'https://pacific-lake-56635.herokuapp.com';
  private socket;

  constructor() { }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      console.log('socket: ', this.socket);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      console.log('socket: ', this.socket);
      this.socket.on('user', (users) => {
        observer.next(users);
      });

      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

}
