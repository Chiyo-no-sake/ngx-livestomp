import { TestBed } from '@angular/core/testing';

import { NgxLiveStompService } from './ngx-live-stomp.service';

describe('NgxLivestompService', () => {
  let service: NgxLiveStompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLiveStompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
