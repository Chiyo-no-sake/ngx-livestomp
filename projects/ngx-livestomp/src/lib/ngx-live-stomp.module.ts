import {ModuleWithProviders, NgModule} from '@angular/core';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from "@stomp/ng2-stompjs";
import {RxStompConfig} from "@stomp/rx-stomp";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [HttpClientModule],
})
export class NgxLiveStompModule {
  static forRoot(config: RxStompConfig): ModuleWithProviders<NgxLiveStompModule> {
    return {
      ngModule: NgxLiveStompModule,
      providers: [
        {
          provide: InjectableRxStompConfig,
          useValue: config,
        },
        {
          provide: RxStompService,
          useFactory: rxStompServiceFactory,
          deps: [InjectableRxStompConfig],
        },
        HttpClient
      ]
    }
  }
}
