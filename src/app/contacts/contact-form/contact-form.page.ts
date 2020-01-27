import {ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {ContactService} from './../shared/contact.service';
import {Contact} from './../shared/contact';
import {Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Router} from '@angular/router';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import * as watermark from 'watermarkjs';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.page.html',
    styleUrls: ['./contact-form.page.scss'],
})

export class ContactFormPage implements OnInit {

    @ViewChild('waterMarkedImage',  {static: true}) waterMarkImage: ElementRef;
    title: string = 'Name Kontak';
    contact: Contact;
    originalImage = null;
    blobImage = null;
    locationCordinates:any;
    loadingLocation:boolean;
    cameraOptions: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA
    }

    constructor(
        private camera: Camera,
        private geolocation: Geolocation,
        private contactService: ContactService,
        private route: ActivatedRoute,
        private localNotifications: LocalNotifications,
        public router: Router,
        private toastCtrl: ToastController)
    {
    }

    ngOnInit() {
      this.getLatLong();
        this.contact = new Contact();

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.title = 'Edit Kontak';
            this.loadContact(parseInt(idParam));
        }
    }
    async loadContact(id: number) {
        this.contact = await this.contactService.getById(id);
    }

    async onSubmit() {
        try {
            this.localNotifications.schedule({
                id: 1,
                title: 'Test 1',
                text: 'Test 2',
                sound: 'file://sound.mp3',
                attachments: ['file://img/rb-leipzig.jpg'],
                data: {secret: 'key_data'},
                icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJGZUogFWww-dABt7TfrqzhEqMEtQAAiKumBYaGLc_RerU_fI&s'
            });
            const result = await this.contactService.save(this.contact);
            this.contact.id = result.insertId;
            const toast = await this.toastCtrl.create({
                header: 'Sukses',
                message: 'Kontak Berhasil Tersimpan.',
                color: 'success',
                position: 'bottom',
                duration: 2000,
                showCloseButton: true,
            });
            toast.present();
            this.router.navigate(['contacts']);
        } catch (error) {
            const toast = await this.toastCtrl.create({
                header: 'Error',
                message: 'Terjadi kesalahan saat mencoba menyimpan Kontak.',
                color: 'danger',
                position: 'bottom',
                duration: 2000,
                showCloseButton: true,
            });
            toast.present();
        }
    }
    async getLatLong() {
        this.loadingLocation = true;
        this.geolocation.getCurrentPosition().then((resp) => {
            console.log(resp);
            this.locationCordinates = resp.coords;
            this.loadingLocation = false;
        }).catch((error) => {
            this.loadingLocation = false;
            console.log('Error getting location', error);
        });
    }
    async takeSnap() {
        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            this.originalImage = 'data:image/jpeg;base64,' + imageData;

            fetch(this.originalImage)
                .then(res => res.blob())
                .then(blob => {
                    this.blobImage = blob;
                    this.watermarkImage();
                });
        }, (error) => {
            console.log(error);
        });
    }
    async watermarkImage() {
        watermark([this.blobImage])
            .image(watermark.text.lowerLeft("(-35.117662, 148.457107)", '200px Arial', '#F5A905', 0.8))
            .then(img => {
                this.waterMarkImage.nativeElement.src = img.src;
                console.log(this.blobImage);
            });
    }
}
