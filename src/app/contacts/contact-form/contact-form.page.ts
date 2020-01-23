import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from './../shared/contact.service';
import { Contact } from './../shared/contact';
import { Component, OnInit } from '@angular/core';

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
      const result = await this.contactService.save(this.contact);
      this.contact.id = result.insertId;

      const toast = await this.toastCtrl.create({
        header: 'Sukses',
        message: 'Kontak Berhasil Tersimpan.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
    console.log(error);
      const toast = await this.toastCtrl.create({
        header: 'Error',
        message: 'Terjadi kesalahan saat mencoba menyimpan Kontak.'+ error,
        color: 'danger',
        position: 'bottom',
        duration: 20000
      });

      toast.present();
    }
  }
}
