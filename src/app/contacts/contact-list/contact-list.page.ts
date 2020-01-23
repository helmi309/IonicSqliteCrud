import { ToastController, AlertController } from '@ionic/angular';
import { ContactService } from './../shared/contact.service';
import { Contact } from './../shared/contact';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadContacts();
  }

  async loadContacts() {
   document.getElementById('loading').style.display = 'block';
   document.getElementById('data').style.display = 'none';
    this.contacts = await this.contactService.getAll();
     document.getElementById('loading').style.display = 'none';
    document.getElementById('data').style.display = 'block';
  }

  doSerchClear() {
    this.loadContacts();
  }
  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.loadContacts();
    }, 1000);
  }

  async doSerchBarChange($event: any) {
    const value = $event.target.value;
    if (value && value.length >= 2) {
      this.contacts = await this.contactService.filter(value);
    }
    else if (value.length === 0) {
      this.contacts = await this.contactService.getAll();
    }
  }

  async delete(contact: Contact) {
    const alert = await this.alertCtrl.create({
      header: 'Delete?',
      message: `Apakah Anda ingin menghapus kontak: ${contact.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          handler: () => {
            this.executeDelete(contact);
          }
        }
      ]
    });
    alert.present();
  }

  async executeDelete(contact: Contact) {
    try {
      // Removendo do banco de dados
      await this.contactService.delete(contact.id);

      // Removendo do array
      const index = this.contacts.indexOf(contact);
      this.contacts.splice(index, 1);

      const toast = await this.toastCtrl.create({
        header: 'Sukses',
        message: 'Kontak berhasil dihapus.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Error',
        message: 'Terjadi kesalahan saat mencoba menghapus Kontak.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
  }
}
