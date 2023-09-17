import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  textSearch: string = ''
  items: Observable<any[]>
  lastKeypress: number = 0;

  constructor(private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) {
    this.items = db.list('/user', ref => ref.orderByChild('name')).snapshotChanges()
  }

  ngOnInit(): void {

  }

  search(event: Event) {
    let q = (event.target as HTMLInputElement).value
    if (q != "") {
      if ((event.timeStamp - this.lastKeypress) > 300) {
        this.items = this.db.list('/user',
          ref => ref.orderByChild('name')
            .limitToFirst(10)
            .startAt(q)
            .endAt(q + "\uf8ff"))
          .snapshotChanges();
      }
    } else {
      this.items = this.db.list('/user', ref => ref.orderByChild('name')).snapshotChanges();
    }
    this.lastKeypress = event.timeStamp
  }

  clearSearch() {
    this.textSearch = ''
  }

  onClickDeleteUser(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        console.log('key:' + JSON.stringify(item))
        let itemRef = this.db.list('user')
        itemRef.remove(item.key)
        const desertRef = this.storage.ref(item.payload.val().imageName)
        desertRef.delete().subscribe(()=>{
          
          Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        })
        
      }
    })

  }

  onClickEdit(item: any) {
    this.router.navigate(['user/edit', item.key])
  }
}
