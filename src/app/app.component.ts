import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './_services/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

/** Class màn hình chính 
 * Name       Date          Comment
 * minhpv   27/06/2023      created
*/

export class AppComponent implements OnInit, OnDestroy {
  title = 'BAGroupn-bootstrap'
  flagImage = 'assets/img/tn_vn_flag.gif';
  numberView = 0;

  languages = [
    {img: 'assets/img/tn_vn_flag.gif', value: 'vn', name:'Việt Nam'},
    {img: 'assets/img/tn_us_flag.gif', value: 'en', name: 'English'}, 
  ];

  private authListenerSubs!: Subscription; 
  public userIsAuthenticated = false; 

  constructor(
    public translate: TranslateService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) 
  {
    translate.addLangs(['en', 'vn']);
    translate.setDefaultLang('vn');
  }

  ngOnInit(){  
    this.authListenerSubs = this.authenticationService.getAuthStatusListener().subscribe(
      isAuthenticated => {  
      this.userIsAuthenticated = isAuthenticated;  
    });  
  }  

  ngOnDestroy(){ 
    this.authListenerSubs.unsubscribe();   
  }  

  // Đổi ngôn ngữ
  switchLang(lang: string) {
    this.translate.use(lang);
    this.flagImage = this.languages.find(e => e.value == lang)?.img ?? '';    
  }

  // Đăng xuất
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
