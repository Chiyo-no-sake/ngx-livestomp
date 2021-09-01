# LiveStomp Client for Angular

This library provides easy access to events and variables with real-time updates from a server using my library <a href="https://github.com/KatonKalu/SpringLiveStomp">SpringLiveStomp</a>.

## Installation

This library requires 2 peer dependencies in order to work:

```shell
npm install --save @stomp/rx-stomp @stomp/ng2-stompjs
```

after having installed them, you can proceed with the package installation:

```shell
npm install --save ngx-livestomp
```


### Usage

1) Create an object of type ``RxStompConfig`` similar to the following, customizing parameters:

```typescript
export const rxStompConfig: RxStompConfig = {
  // Which server?
  brokerURL: 'ws://127.0.0.1:8080/ws',

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },

  logRawCommunication: true,

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 500,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    if(!environment.production)
      console.log(new Date(), msg);
  },
};
```

2) In your AppModule, import ```RxLiveStompModule``` and configure it with the object previously created:

```typescript
// ... other imports
import {rxStompConfig} from "./rx-stomp.config";
import {NgxLiveStompModule} from "ngx-livestomp"

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxLiveStompModule.forRoot(rxStompConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

3) Now, simply use the service via DI:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <p *ngFor="let hero of heroes | async">
      {{hero.name}}, rating: {{hero.rating}}
    </p>
    <br>
    Hero with id 1:
    <p>{{(heroWithID1 | async)?.name}}, rating: {{(heroWithID1 | async)?.rating}}</p>
    <br>
    Poster: {{poster?.text}}
    <p></p>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  heroes?: Observable<Hero[]>;
  heroWithID1?: Observable<Hero>;
  poster?: {text: string};

  constructor(private restService: NgxLiveStompService) {
  }

  ngOnInit(): void {
    this.heroes = this.restService.liveList<Hero>('http://localhost:8080/heroes', '/topic/heroes/updates');
    this.heroWithID1 = this.restService.live<Hero>('http://localhost:8080/heroes/1', '/topic/heroes/1/updates');
    this.restService.live<{ text:string }>('http://localhost:8080/poster', '/topic/poster/updates').subscribe(poster => {
      console.log(poster);
      this.poster = poster
    })
  }

}
```

In this example, the list ```heroes``` and the variables ```heroWithID1``` and ```poster``` are now synchronized with back-end changes, thus are updated in real-time.

For more examples of usage, see the following repo:
https://github.com/KatonKalu/Stomp-Reactive-Example
