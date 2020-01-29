import {DatabaseService} from './core/service/database.service';
import {Component} from '@angular/core';

import {Platform, MenuController, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    userDataAuto: any;
    toast: any;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private db: DatabaseService,
        private menu: MenuController,
        private fb: Facebook,
        private toastCtrl: ToastController,
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
            this.fb.getLoginStatus().then((res) => {
                if (res.status === 'connected') {
                    this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
                        this.userDataAuto = {
                            email: profile['email'],
                            first_name: profile['first_name'],
                            picture: profile['picture_large']['data']['url'],
                            username: profile['name']
                        };
                            this.toast = this.toastCtrl.create({
                                message: `<table ><td><img src="../assets/icon/facebook.png"></td><td><p><h2 >Welcome ${this.userDataAuto.first_name}</h2></p></td></table>`,
                                duration: 3000,
                                color: 'light',
                                position: 'top',
                            }).then((toastData)=>{
                                toastData.present();
                            });
                    });
                }
            });
        });
    }
}
