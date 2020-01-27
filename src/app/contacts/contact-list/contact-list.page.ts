import { ToastController, AlertController, IonInfiniteScroll } from '@ionic/angular';
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
  contacts2: Contact[] = [];
  infiniteScroll: IonInfiniteScroll;
  pager: any = {};
  nomer: number;
  pagedItemsinfinite: any[];
  Pagenumber: number;
  count: number;

  constructor(
    private contactService: ContactService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.nomer = 25;
    this.loadContacts();
  }

  async loadContacts() {
   document.getElementById('loading').style.display = 'block';
   document.getElementById('data').style.display = 'none';
    this.contacts2 = [];
    this.contacts = [];
    this.contacts2 = await this.contactService.getAll();
    this.setPageInfinite(1);
     document.getElementById('loading').style.display = 'none';
    document.getElementById('data').style.display = 'block';
  }
  setPageInfinite(page: number) {
    this.Pagenumber = page;
    // get pager object from service
    this.pager = this.getPager(this.contacts2.length, page);
    if(this.Pagenumber <= this.pager.totalPages) {
      // get current page of items
      this.pagedItemsinfinite = this.contacts2.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.count = 0;
      for (let item of this.pagedItemsinfinite) {
        this.contacts.push(this.pagedItemsinfinite[this.count]);
        this.count++;
      }
    }
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
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 17) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
  loadData(event) {
        // if(event.isTrusted === true){
        //   event.target.complete();
        // }

    setTimeout(() => {
      console.log(event);
      if(event.isTrusted === false){
        event.target.complete();
      }

      this.setPageInfinite(this.Pagenumber+1)
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
