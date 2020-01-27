import { DatabaseService } from './core/service/database.service';
import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: DatabaseService,
    private menu: MenuController

  ) {
    this.initializeApp();
  }
   openFirst() {
      this.menu.enable(true, 'first');
      this.menu.open('first');
    }

    openEnd() {
      this.menu.open('end');
    }

    openCustom() {
      this.menu.enable(true, 'custom');
      this.menu.open('custom');
    }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
      this.db.openDatabase();
    });
  }
}
