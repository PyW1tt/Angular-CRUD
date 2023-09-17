import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormGroupName, NgForm, Validators } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {

  imagePreview!: string | ArrayBuffer
  file!: File
  mUser: User = new User()
  upDateImage!: string
  task!: AngularFireUploadTask
  downloadURL!: Observable<string>
  key!: string

  // name = new FormControl('', Validators.required);
  // address = new FormControl('', Validators.required);
  // email = new FormControl('', [Validators.required, Validators.email]);
  // phone = new FormControl('', [Validators.required, Validators.minLength(10)]);

  constructor(private location: Location,
    private activeRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      // window.alert(JSON.stringify(params["key"]))
      this.key = params['key']

      const itemRef = this.db.object('user/' + this.key).valueChanges().subscribe((item: any) => {
        console.log(JSON.stringify(item))

        this.mUser.name = item['name']
        this.mUser.address = item['address']
        this.mUser.email = item['email']
        this.mUser.phone = item['phone']
        this.mUser.image = item['image']
        this.mUser.imageName = item['imageName']

      })
    })
  }

  onSubmit() {
    console.log(JSON.stringify(this.mUser))
    let itemRef = this.db.list('user')
    itemRef.update(this.key, this.mUser)

    // if (this.upDateImage != this.mUser.imageName) {
    //   const desertRef = this.storage.ref(this.upDateImage)
    //   desertRef.delete().subscribe(() => {
    //     console.log('deleted old image file')
    //   })
    // }

    window.alert('Edit success')
    this.location.back()
  }

  async onPreviewImage(event: any) {
    const metaImage = event.target.files[0]
    const path = `/user/${metaImage.name}`
    const ref = this.storage.ref(path)

    this.task = this.storage.upload(path, metaImage)
    if (metaImage) {
      this.file = metaImage

      const reader = new FileReader()
      reader.readAsDataURL(metaImage)
      reader.onload = () => {
        this.imagePreview = reader.result as string
      }

      await this.task;     
      this.mUser.image = await ref.getDownloadURL().toPromise();
      this.mUser.imageName = path
      alert('Image uploaded!');
    }

  }

  onCancel() {
    this.location.back()
  }


}


