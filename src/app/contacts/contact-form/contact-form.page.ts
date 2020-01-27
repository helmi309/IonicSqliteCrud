import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from './../shared/contact.service';
import { Contact } from './../shared/contact';
import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.page.html',
  styleUrls: ['./contact-form.page.scss'],
})
export class ContactFormPage implements OnInit {
  title: string = 'Name Kontak';
  contact: Contact;
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private localNotifications: LocalNotifications,
    public router: Router,
    private toastCtrl: ToastController) { }

  ngOnInit() {
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
        data: { secret: 'key_data' },
        icon : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJGZUogFWww-dABt7TfrqzhEqMEtQAAiKumBYaGLc_RerU_fI&s'
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
}