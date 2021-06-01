import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Message, MessageBody } from '../../../../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(
    private http: HttpClient,
    private afMessaging: AngularFireMessaging
  ) { }

  /** Current user's token for push notifications */
  get token$(): Observable<string | null> {
    return this.afMessaging.getToken;
  }

  /** Observable of notifications when application is active */
  get messages$(): Observable<Message> {
    return this.afMessaging.messages as Observable<Message>;
  }

  /**
   * Asks user's permission for receiving push notifications.
   * @return Observable token or null in case of deny
   */
  requestToken(): Observable<string | null> {
    return this.afMessaging.requestToken;
  }

  /**
   * Sends post request to FCM api for push notifications.
   * @param to - notification receiver
   * @param data - request data by MessageBody model
   */
  send(to: string, data: MessageBody): Observable<{}> {
    return this.http.post(
      'https://fcm.googleapis.com/fcm/send',
      { to, data },
      { headers: { 'Authorization': `key=${environment.firebase.messagingServerKey}` } }
    );
  }
}
