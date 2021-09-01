import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LiveWebSocketService} from "./live-web-socket/live-web-socket.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NgxLiveStompService {

  constructor(private httpClient: HttpClient, private webSocket: LiveWebSocketService) {
  }

  /**
   * Returns an observable that listen for the real time value of a variable on backend.
   * The observable emits the new value at each update, and emits 'undefined' when the resource get deleted,
   * before completing the observable.
   * @param restEndpoint is the normal rest endpoint in GET configured to return the static data
   * @param updatesPath is the endpoint configured on backend at which we send events
   */
  live<Type>(restEndpoint: string, updatesPath: string): Observable<Type> {
    return new Observable<Type>(subscriber => {
      this.httpClient.get<Type>(restEndpoint).subscribe((item) => subscriber.next(item));
      this.webSocket.listenChanges<Type>(updatesPath).subscribe(update => {
        if(update.changeType === "DELETED") {
          subscriber.next(undefined);
          subscriber.complete()
        }
        subscriber.next(update.subject)
      });
    })
  }

  /**
   * Returns an observable that listen for the real time value of a list on backend
   * @param restEndpoint is the normal rest endpoint in GET configured to return the static data
   * @param updatesPath is the endpoint configured on backend at which we send events
   */
  liveList<Type>(restEndpoint: string, updatesPath: string): Observable<(Type & { id: any })[]> {
    type withId = Type & { id: any };

    let currentList: withId[] = [];

    return new Observable<withId[]>(subscriber => {
      this.httpClient.get<withId[]>(restEndpoint).subscribe((list) => {
        currentList = list;
        subscriber.next(list);
      });

      this.webSocket.listenChanges<withId>(updatesPath).subscribe(update => {
        switch (update.changeType) {
          case "CREATED":
            currentList = [...currentList, update.subject];
            break;
          case "UPDATED":
            const index = currentList.findIndex((item) => item.id === update.subject.id);
            currentList[index] = update.subject;
            break;
          case "DELETED":
            currentList = currentList.filter(item => item.id !== update.subject.id)
            break;
        }

        subscriber.next(currentList);
      })
    })
  }
}
